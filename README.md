# FitTrack

FitTrack is a cloud-connected fitness tracking web application that I developed as an independent project.

It allows users to securely sign in, record strength and cardio workouts, review workout history, set weekly goals, and monitor their training progress.

## Live Demo

https://d14xx7qs8lh29q.cloudfront.net

> Sign-in is required to access personal workout data.

## Run Locally

1. Clone the repository and open the project folder.

2. Install dependencies:


npm install


3. Start the development server:


npm run dev


4. Open the local URL shown in the terminal, usually:


http://127.0.0.1:5500


> To use sign-in and API features locally, the Cognito callback URL and API Gateway CORS settings must allow the local address. 

## Features

- User authentication with Amazon Cognito
- Log strength and cardio workouts
- Edit and delete existing workout entries
- Search and filter workout history
- Weekly training summaries
- Weekly workout goals
- Exercise progress and personal best tracking
- Week-to-week training comparisons
- Responsive web interface

## Architecture

FitTrack uses a serverless AWS architecture:

```
User Browser
    |
    v
CloudFront
    |
    v
S3 Static Frontend

User Browser -----------------> Cognito
    |                            |
    |                     Login / Tokens
    |
    | Authorization: Bearer <access token>
    v
API Gateway
    |
JWT Authorizer
    |
    v
Lambda
    |
    v
DynamoDB
```

## Technologies Used
### Frontend
- HTML
- CSS
- JavaScript
- Vite
- oidc-client-ts
### AWS
- Amazon S3
- Amazon CloudFront
- Amazon Cognito
- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- AWS IAM
### Backend
- Python
- boto3


## Project Structure
FitTrack/
|-- frontend/
│   |-- index.html
│   |-- app.js
│   |-- main.js
│   |-- style.css
│   |-- package.json
│   |-- package-lock.json
│
|-- backend/
│   |-- lambda_function.py
│
|-- docs/
|-- screenshots/
|-- .gitignore
|-- README.md

## Security
Some security measures implemented in FitTrack include:
- Authentication through Amazon Cognito
- Authorization tokens sent to protected API routes
- API Gateway JWT authorization
- User identity derived from verified Cognito token claims
- User-specific DynamoDB partitioning
- Server-side input validation
- Conditional checks when modifying or deleting records
- No AWS access keys or secret keys stored in frontend source code

Client-side validation is used for usability, while the Lambda backend independently validates submitted workout data before storing it

## Testing
Testing documentation will be added to the docs folder.
Planned test coverage includes:
- Workout creation, editing and deletion
- Strength and cardio validation
- Weekly goal validation
- Authentication failures
- User data isolation
- Search and filtering
- Responsive interface behaviour

## User Feedback
Usability testing and feedback will be documented as the project develops.
The aim is to record:
1. What users were asked to do
2. Problems or observations discovered
3. Improvements made
4. Results after retesting

## What I Learned
Through FitTrack, I gained practical experience in:
- Connecting a frontend application to serverless AWS services
- Implementing authentication using OpenID Connect
- Protecting APIs using bearer access tokens
- Designing user-specific data storage in DynamoDB
- Performing client-side and server-side validation
- Building CRUD functionality
- Deploying a static web application through S3 and CloudFront
- Debugging communication between frontend and cloud services

## Future Improvements
Possible future improvements include:
- Expanded automated testing
- Improved monitoring and logging
- Additional progress visualisations
- More usability testing and feedback
- Further accessibility improvements

## Project Status
FitTrack is an ongoing independent project and will continue to be improved as I learn and test new ideas