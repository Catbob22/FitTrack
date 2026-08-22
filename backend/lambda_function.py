import json
import os
import uuid
from datetime import date
from decimal import Decimal, InvalidOperation

import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key


dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])

WORKOUT_TYPES = {"Push", "Pull", "Legs", "Cardio", "Other"}
SETTINGS_ENTRY_ID = "SETTINGS"


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            if obj % 1 == 0:
                return int(obj)
            return float(obj)

        return super().default(obj)


def response(status_code, data):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(data, cls=DecimalEncoder)
    }


def get_user_id(event):
    return (
        event.get("requestContext", {})
        .get("authorizer", {})
        .get("jwt", {})
        .get("claims", {})
        .get("sub")
    )


def to_decimal(value, field_name, errors):
    if isinstance(value, bool) or value is None or value == "":
        errors.append(f"{field_name} is required.")
        return None

    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError):
        errors.append(f"{field_name} must be a number.")
        return None


def validate_workout(body):
    """Return normalized values and any user-facing validation errors."""
    errors = []

    workout_date = body.get("date")
    try:
        date.fromisoformat(workout_date)
    except (TypeError, ValueError):
        errors.append("Date must be a valid date.")

    workout_type = body.get("workoutType")
    if workout_type not in WORKOUT_TYPES:
        errors.append("Workout type is invalid.")

    exercise = body.get("exercise", "")
    if not isinstance(exercise, str) or not exercise.strip():
        errors.append("Exercise is required.")
    elif len(exercise.strip()) > 100:
        errors.append("Exercise must be 100 characters or fewer.")

    notes = body.get("notes", "")
    if notes is None:
        notes = ""
    if not isinstance(notes, str):
        errors.append("Notes must be text.")
    elif len(notes.strip()) > 1000:
        errors.append("Notes must be 1000 characters or fewer.")

    normalized = {
        "date": workout_date,
        "workoutType": workout_type,
        "exercise": exercise.strip() if isinstance(exercise, str) else "",
        "notes": notes.strip() if isinstance(notes, str) else ""
    }

    if workout_type == "Cardio":
        duration = to_decimal(body.get("duration"), "Duration", errors)
        distance = to_decimal(body.get("distance"), "Distance", errors)

        if duration is not None and duration <= 0:
            errors.append("Duration must be greater than zero.")
        if distance is not None and distance < 0:
            errors.append("Distance cannot be negative.")

        normalized.update({
            "sets": Decimal(0),
            "reps": Decimal(0),
            "weight": Decimal(0),
            "duration": duration,
            "distance": distance
        })
    else:
        sets = to_decimal(body.get("sets"), "Sets", errors)
        reps = to_decimal(body.get("reps"), "Reps", errors)
        weight = to_decimal(body.get("weight"), "Weight", errors)

        if sets is not None and (sets <= 0 or sets % 1 != 0):
            errors.append("Sets must be a whole number greater than zero.")
        if reps is not None and (reps <= 0 or reps % 1 != 0):
            errors.append("Reps must be a whole number greater than zero.")
        if weight is not None and weight < 0:
            errors.append("Weight cannot be negative.")

        normalized.update({
            "sets": sets,
            "reps": reps,
            "weight": weight,
            "duration": Decimal(0),
            "distance": Decimal(0)
        })

    return normalized, errors


def read_request_body(event):
    try:
        body = json.loads(event.get("body") or "{}", parse_float=Decimal)
    except json.JSONDecodeError:
        return None

    return body if isinstance(body, dict) else None


def is_missing_item_error(error):
    return error.response["Error"]["Code"] == "ConditionalCheckFailedException"


def validate_weekly_goal(body):
    goal = body.get("weeklyGoal")

    if isinstance(goal, bool) or goal is None or goal == "":
        return None, "Weekly goal is required."

    try:
        goal = Decimal(str(goal))
    except (InvalidOperation, ValueError):
        return None, "Weekly goal must be a number."

    if goal % 1 != 0 or goal < 1 or goal > 14:
        return None, "Weekly goal must be a whole number from 1 to 14."

    return int(goal), None


def lambda_handler(event, context):
    route_key = event.get("routeKey")
    user_id = get_user_id(event)

    # API Gateway normally blocks these requests first. This is a safe fallback.
    if not user_id:
        return response(401, {"message": "Unauthorized"})

    if route_key == "GET /settings":
        result = table.get_item(
            Key={"userId": user_id, "entryId": SETTINGS_ENTRY_ID}
        )
        settings = result.get("Item", {})

        return response(200, {
            "weeklyGoal": settings.get("weeklyGoal")
        })

    if route_key == "PUT /settings":
        body = read_request_body(event)
        if body is None:
            return response(400, {"message": "Request body must be valid JSON."})

        weekly_goal, error_message = validate_weekly_goal(body)
        if error_message:
            return response(400, {"message": error_message})

        table.put_item(
            Item={
                "userId": user_id,
                "entryId": SETTINGS_ENTRY_ID,
                "entryType": "settings",
                "weeklyGoal": weekly_goal
            }
        )

        return response(200, {
            "message": "Weekly goal saved successfully",
            "weeklyGoal": weekly_goal
        })

    if route_key == "POST /entries":
        body = read_request_body(event)
        if body is None:
            return response(400, {"message": "Request body must be valid JSON."})

        workout, errors = validate_workout(body)
        if errors:
            return response(400, {"message": "Invalid workout data.", "errors": errors})

        new_entry = {
            "userId": user_id,
            "entryId": str(uuid.uuid4()),
            **workout
        }
        table.put_item(Item=new_entry)

        return response(201, {
            "message": "Workout saved successfully",
            "workout": new_entry
        })

    if route_key == "GET /entries":
        result = table.query(
            KeyConditionExpression=Key("userId").eq(user_id)
        )
        workouts = [
            item
            for item in result.get("Items", [])
            if item.get("entryId") != SETTINGS_ENTRY_ID
        ]

        return response(200, {"workouts": workouts})

    if route_key == "PUT /entries/{entryId}":
        entry_id = (event.get("pathParameters") or {}).get("entryId")
        if not entry_id:
            return response(400, {"message": "Workout ID is required."})
        if entry_id == SETTINGS_ENTRY_ID:
            return response(404, {"message": "Workout not found."})

        body = read_request_body(event)
        if body is None:
            return response(400, {"message": "Request body must be valid JSON."})

        workout, errors = validate_workout(body)
        if errors:
            return response(400, {"message": "Invalid workout data.", "errors": errors})

        try:
            result = table.update_item(
                Key={"userId": user_id, "entryId": entry_id},
                ConditionExpression="attribute_exists(entryId)",
                UpdateExpression=(
                    "SET #date = :date, workoutType = :workoutType, "
                    "exercise = :exercise, #sets = :sets, reps = :reps, "
                    "weight = :weight, notes = :notes, "
                    "#duration = :duration, distance = :distance"
                ),
                ExpressionAttributeNames={
                    "#date": "date",
                    "#sets": "sets",
                    "#duration": "duration"
                },
                ExpressionAttributeValues={
                    ":date": workout["date"],
                    ":workoutType": workout["workoutType"],
                    ":exercise": workout["exercise"],
                    ":sets": workout["sets"],
                    ":reps": workout["reps"],
                    ":weight": workout["weight"],
                    ":notes": workout["notes"],
                    ":duration": workout["duration"],
                    ":distance": workout["distance"]
                },
                ReturnValues="ALL_NEW"
            )
        except ClientError as error:
            if is_missing_item_error(error):
                return response(404, {"message": "Workout not found."})
            raise

        return response(200, {
            "message": "Workout updated successfully",
            "workout": result["Attributes"]
        })

    if route_key == "DELETE /entries/{entryId}":
        entry_id = (event.get("pathParameters") or {}).get("entryId")
        if not entry_id:
            return response(400, {"message": "Workout ID is required."})
        if entry_id == SETTINGS_ENTRY_ID:
            return response(404, {"message": "Workout not found."})

        try:
            table.delete_item(
                Key={"userId": user_id, "entryId": entry_id},
                ConditionExpression="attribute_exists(entryId)"
            )
        except ClientError as error:
            if is_missing_item_error(error):
                return response(404, {"message": "Workout not found."})
            raise

        return response(200, {"message": "Workout deleted successfully"})

    return response(404, {"message": "Route not found"})
