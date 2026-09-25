/* =========================================
   GET HTML ELEMENTS
========================================= */

/* Log Workout form */
const workoutModal = document.getElementById("workoutModal");
const openWorkoutButton = document.getElementById("openWorkoutButton");
const closeWorkoutButton = document.getElementById("closeWorkoutButton");

const workoutForm = document.getElementById("workoutForm");
const submitButton = document.getElementById("submitButton");

const workoutDateInput = document.getElementById("date");
const workoutType = document.getElementById("workoutType");
const exerciseInput = document.getElementById("exercise");
const setsInput = document.getElementById("sets");
const repsInput = document.getElementById("reps");
const weightInput = document.getElementById("weight");
const durationInput = document.getElementById("duration");
const distanceInput = document.getElementById("distance");
const notesInput = document.getElementById("notes");

const strengthFields = document.getElementById("strengthFields"); /* These are used to calculate for equivalent */
const cardioFields = document.getElementById("cardioFields");


/* Edit form */
const editForm = document.getElementById("editForm");
const editDateInput = document.getElementById("editDate");
const editWorkoutType = document.getElementById("editWorkoutType");
const editExerciseInput = document.getElementById("editExercise");
const editSetsInput = document.getElementById("editSets");
const editRepsInput = document.getElementById("editReps");
const editWeightInput = document.getElementById("editWeight");
const editDurationInput = document.getElementById("editDuration");
const editDistanceInput = document.getElementById("editDistance");
const editNotesInput = document.getElementById("editNotes");

const editStrengthFields = document.getElementById("editStrengthFields"); /* These are used to calculate for equivalent */
const editCardioFields = document.getElementById("editCardioFields");

const editModal = document.getElementById("editModal");
const cancelEditButton = document.getElementById("cancelEditButton");
const closeModalButton = document.getElementById("closeModalButton");
const updateButton = document.getElementById("updateButton");


/* Main page tabs */
const weeklySummaryTabButton = document.getElementById(
    "weeklySummaryTabButton"
);
const historyTabButton = document.getElementById("historyTabButton");

const weeklySummaryView = document.getElementById(
    "weeklySummaryView"
);
const historyView = document.getElementById("historyView");


/* Workout History */
const workoutList = document.getElementById("workoutList");
const historyResultCount = document.getElementById("historyResultCount");
const searchExercise = document.getElementById("searchExercise");
const typeFilter = document.getElementById("typeFilter");


/* Logged workout summary */
const loggedWorkoutModal = document.getElementById("loggedWorkoutModal");
const loggedWorkoutTitle = document.getElementById("loggedWorkoutTitle");
const loggedWorkoutContent = document.getElementById("loggedWorkoutContent");
const closeLoggedWorkoutButton = document.getElementById(
    "closeLoggedWorkoutButton"
);
const doneLoggedWorkoutButton = document.getElementById(
    "doneLoggedWorkoutButton"
);


/* Weekly summary */
const weeklySummaryTitle = document.getElementById("weeklySummaryTitle");
const weeklyDateRange = document.getElementById("weeklyDateRange");
const weeklySummaryContent = document.getElementById("weeklySummaryContent");

const previousWeekButton = document.getElementById("previousWeekButton");
const currentWeekButton = document.getElementById("currentWeekButton");
const nextWeekButton = document.getElementById("nextWeekButton");
const weekNavigationDate = document.getElementById("weekNavigationDate");

const weeklyGoalButton = document.getElementById("weeklyGoalButton");
const weeklyGoalModal = document.getElementById("weeklyGoalModal");
const weeklyGoalForm = document.getElementById("weeklyGoalForm");
const weeklyGoalInput = document.getElementById("weeklyGoalInput");
const closeWeeklyGoalButton = document.getElementById(
    "closeWeeklyGoalButton"
);
const cancelWeeklyGoalButton = document.getElementById(
    "cancelWeeklyGoalButton"
);
const saveWeeklyGoalButton = document.getElementById(
    "saveWeeklyGoalButton"
);


/* Exercise progress */
const exerciseProgressButton = document.getElementById(
    "exerciseProgressButton"
);
const exerciseProgressModal = document.getElementById(
    "exerciseProgressModal" /* Fills ENTIRE page */
);
const closeExerciseProgressButton = document.getElementById(
    "closeExerciseProgressButton"
);
const exerciseProgressSelect = document.getElementById(
    "exerciseProgressSelect" /* Choose the exercise type */
);
const exerciseProgressContent = document.getElementById(
    "exerciseProgressContent"
);


/* Delete confirmation */
const deleteModal = document.getElementById("deleteModal"); /* again modal is ENTIRE page */
const closeDeleteButton = document.getElementById("closeDeleteButton");
const cancelDeleteButton = document.getElementById("cancelDeleteButton");
const confirmDeleteButton = document.getElementById("confirmDeleteButton");
const deleteWorkoutName = document.getElementById("deleteWorkoutName");


/* Fun equivalents */
const funEquivalentModal = document.getElementById("funEquivalentModal");
const closeFunEquivalentButton = document.getElementById(
    "closeFunEquivalentButton"
);
const funEquivalentContent = document.getElementById(
    "funEquivalentContent"
);

const splitFunModal = document.getElementById("splitFunModal"); /* modal for split fun equivalent */
const closeSplitFunButton = document.getElementById(
    "closeSplitFunButton"
);
const splitFunTitle = document.getElementById("splitFunTitle");
const splitFunContent = document.getElementById("splitFunContent");


/* Workout split sessions */
const sessionModal = document.getElementById("sessionModal");
const closeSessionButton = document.getElementById(
    "closeSessionButton"
);
const sessionTitle = document.getElementById("sessionTitle");
const sessionContent = document.getElementById("sessionContent");


/* Toast notification at the top right */
const toast = document.getElementById("toast");
const tryDemoButton = document.getElementById("tryDemoButton");


/* =========================================
   API AND APP DATA
========================================= */

const API_URL =
    "https://es7gui262k.execute-api.ap-southeast-1.amazonaws.com/entries";

let workouts = [];
let editingEntryId = null;
let deletingEntryId = null;
let weeklyGoal = null;
let demoMode = false;

let summaryReferenceDate = new Date();

window.fitTrackDemoMode = false;


tryDemoButton.addEventListener("click", startDemoMode);


function startDemoMode() {
    demoMode = true;
    window.fitTrackDemoMode = true;

    workouts = createDemoWorkouts();
    weeklyGoal = 4;
    summaryReferenceDate = new Date();

    const email = document.getElementById("email");
    const signIn = document.getElementById("signIn");
    const signOut = document.getElementById("signOut");
    const signedOutMessage = document.getElementById("signedOutMessage");
    const appContent = document.getElementById("appContent");

    email.textContent = "Demo mode";
    email.classList.remove("hidden");
    signIn.classList.add("hidden");
    signOut.textContent = "Exit Demo";
    signOut.classList.remove("hidden");
    signedOutMessage.classList.add("hidden");
    appContent.classList.remove("hidden");
    openWorkoutButton.classList.remove("hidden");

    showWeeklySummaryView();
    renderWeeklySummary();
    filterWorkouts();

    showToast("Demo mode started. Changes reset when you leave.");
}


function createDemoWorkouts() {
    const currentWeek = getWeekRange(new Date());
    const today = new Date();
    const todayOffset =
        today.getDay() === 0
            ? 6
            : today.getDay() - 1;

    function dateForOffset(offset) {
        const date = new Date(currentWeek.monday);

        date.setDate(
            currentWeek.monday.getDate() + Math.min(offset, todayOffset)
        );

        return getDateKey(date);
    }

    const previousWeekDate = new Date(currentWeek.monday);
    previousWeekDate.setDate(previousWeekDate.getDate() - 5);

    return [
        {
            entryId: "demo-1",
            date: dateForOffset(0),
            workoutType: "Push",
            exercise: "Bench Press",
            sets: 3,
            reps: 8,
            weight: 70,
            duration: 0,
            distance: 0,
            notes: "Felt strong today"
        },
        {
            entryId: "demo-2",
            date: dateForOffset(0),
            workoutType: "Push",
            exercise: "Shoulder Press",
            sets: 3,
            reps: 10,
            weight: 22.5,
            duration: 0,
            distance: 0,
            notes: "Controlled reps"
        },
        {
            entryId: "demo-3",
            date: dateForOffset(2),
            workoutType: "Pull",
            exercise: "Lat Pulldown",
            sets: 4,
            reps: 10,
            weight: 50,
            duration: 0,
            distance: 0,
            notes: "Focused on full range of motion"
        },
        {
            entryId: "demo-4",
            date: dateForOffset(4),
            workoutType: "Legs",
            exercise: "Barbell Squat",
            sets: 4,
            reps: 6,
            weight: 85,
            duration: 0,
            distance: 0,
            notes: "Added 5 kg from last week"
        },
        {
            entryId: "demo-5",
            date: dateForOffset(todayOffset),
            workoutType: "Cardio",
            exercise: "Outdoor Run",
            sets: 0,
            reps: 0,
            weight: 0,
            duration: 30,
            distance: 5,
            notes: "Comfortable pace"
        },
        {
            entryId: "demo-6",
            date: getDateKey(previousWeekDate),
            workoutType: "Push",
            exercise: "Bench Press",
            sets: 3,
            reps: 8,
            weight: 65,
            duration: 0,
            distance: 0,
            notes: "Previous week"
        }
    ];
}


/* =========================================
   BASIC APP HELPERS
========================================= */

function setDefaultDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    workoutDateInput.value = year + "-" + month + "-" + day;
}


function showLoadingState() { /* yes */
    weeklySummaryContent.innerHTML = `
        <div class="loading-state">
            Loading weekly summary...
        </div>
    `;

    historyResultCount.textContent = "Loading workouts...";

    workoutList.innerHTML = `
        <div class="loading-state">
            Loading workouts...
        </div>
    `;
}


function getWorkoutById(entryId) {
    for (let i = 0; i < workouts.length; i++) {
        if (workouts[i].entryId === entryId) {
            return workouts[i];
        }
    }

    return null;
}


function getEntryTotalReps(workout) {
    return (
        Number(workout.sets || 0) *
        Number(workout.reps || 0)
    );
}


function getEntryVolume(workout) {
    return (
        getEntryTotalReps(workout) *
        Number(workout.weight || 0)
    );
}


/* =========================================
   MAIN PAGE TABS
========================================= */

weeklySummaryTabButton.addEventListener(
    "click",
    showWeeklySummaryView
);

historyTabButton.addEventListener(
    "click",
    showHistoryView
);


function showWeeklySummaryView() {
    weeklySummaryView.classList.remove("hidden");
    historyView.classList.add("hidden");

    weeklySummaryTabButton.classList.add("active");
    historyTabButton.classList.remove("active");
}


function showHistoryView() {
    weeklySummaryView.classList.add("hidden");
    historyView.classList.remove("hidden");

    weeklySummaryTabButton.classList.remove("active");
    historyTabButton.classList.add("active");

    filterWorkouts();
}


/* =========================================
   LOG WORKOUT POPUP
========================================= */

openWorkoutButton.addEventListener(
    "click",
    openWorkoutModal
);

closeWorkoutButton.addEventListener(
    "click",
    closeWorkoutModal
);


function openWorkoutModal() {
    openModal(workoutModal);
}


function closeWorkoutModal() {
    closeModal(workoutModal);
}


/* =========================================
   SHOW CORRECT FORM FIELDS
========================================= */

workoutType.addEventListener("change", updateMainFormFields);
editWorkoutType.addEventListener("change", updateEditFormFields);


function updateMainFormFields() {
    const isCardio = workoutType.value === "Cardio";

    if (isCardio) {
        strengthFields.classList.add("hidden");
        cardioFields.classList.remove("hidden");
    } else {
        strengthFields.classList.remove("hidden");
        cardioFields.classList.add("hidden");
    }

    setsInput.required = !isCardio;
    repsInput.required = !isCardio;
    weightInput.required = !isCardio;

    durationInput.required = isCardio;
    distanceInput.required = isCardio;
}


function updateEditFormFields() {
    const isCardio = editWorkoutType.value === "Cardio";

    if (isCardio) {
        editStrengthFields.classList.add("hidden");
        editCardioFields.classList.remove("hidden");
    } else {
        editStrengthFields.classList.remove("hidden");
        editCardioFields.classList.add("hidden");
    }

    editSetsInput.required = !isCardio;
    editRepsInput.required = !isCardio;
    editWeightInput.required = !isCardio;

    editDurationInput.required = isCardio;
    editDistanceInput.required = isCardio;
}


/* =========================================
   READ FORM DATA
========================================= */

function getMainFormWorkout() {
    const type = workoutType.value;
    const isCardio = type === "Cardio";

    return {
        date: workoutDateInput.value,
        workoutType: type,
        exercise: exerciseInput.value.trim(),

        sets: isCardio ? 0 : Number(setsInput.value),
        reps: isCardio ? 0 : Number(repsInput.value),
        weight: isCardio ? 0 : Number(weightInput.value),

        duration: isCardio ? Number(durationInput.value) : 0,
        distance: isCardio ? Number(distanceInput.value) : 0,

        notes: notesInput.value.trim()
    };
}


function getEditFormWorkout() {
    const type = editWorkoutType.value;
    const isCardio = type === "Cardio";

    return {
        date: editDateInput.value,
        workoutType: type,
        exercise: editExerciseInput.value.trim(),

        sets: isCardio ? 0 : Number(editSetsInput.value),
        reps: isCardio ? 0 : Number(editRepsInput.value),
        weight: isCardio ? 0 : Number(editWeightInput.value),

        duration: isCardio ? Number(editDurationInput.value) : 0,
        distance: isCardio ? Number(editDistanceInput.value) : 0,

        notes: editNotesInput.value.trim()
    };
}


/* =========================================
   LOAD WORKOUTS
========================================= */

async function loadWorkouts() {
    if (demoMode) {
        renderWeeklySummary();
        filterWorkouts();
        return;
    }

    try {
        const user = await window.userManager.getUser();

        const response = await fetch(API_URL, {
            headers: {
                "Authorization": `Bearer ${user.access_token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load workouts");
        }

        const data = await response.json();

        workouts = data.workouts || [];

        renderWeeklySummary();
        filterWorkouts();

        /*
           If Exercise Progress is already open,
           refresh it after the data changes.
        */
        if (exerciseProgressModal.classList.contains("show")) {
            populateExerciseProgressOptions();
            renderExerciseProgress();
        }

    } catch (error) {
        console.log(error);
        showToast("Could not load workouts.", true);
    }
}


async function loadWeeklyGoal() {
    if (demoMode) {
        weeklyGoal = 4;
        renderWeeklySummary();
        return;
    }

    try {
        const user = await window.userManager.getUser();

        const response = await fetch(
            API_URL.replace("/entries", "/settings"),
            {
                headers: {
                    "Authorization": `Bearer ${user.access_token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to load weekly goal");
        }

        const data = await response.json();

        weeklyGoal = data.weeklyGoal || null;
        renderWeeklySummary();

    } catch (error) {
        console.log(error);
        showToast("Could not load your weekly goal.", true);
    }
}


/* =========================================
   ADD NEW WORKOUT
========================================= */

workoutForm.addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();

        const newWorkout = getMainFormWorkout();

        try {
            submitButton.disabled = true;
            submitButton.textContent = "Logging...";

            if (demoMode) {
                newWorkout.entryId = "demo-" + Date.now();
                workouts.push(newWorkout);
            } else {
                const user = await window.userManager.getUser();

                const response = await fetch(
                    API_URL,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${user.access_token}`
                        },
                        body: JSON.stringify(newWorkout)
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to save workout");
                }
            }

            workoutForm.reset();
            setDefaultDate();
            updateMainFormFields();

            closeWorkoutModal();

            summaryReferenceDate =
                new Date(newWorkout.date + "T00:00:00");

            showWeeklySummaryView();

            await loadWorkouts();

            showLoggedWorkoutSummary(newWorkout);

        } catch (error) {
            console.log(error);
            showToast("Could not add workout.", true);

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Log Workout";
        }
    }
);


/* =========================================
   SHOW SUMMARY AFTER LOGGING
========================================= */

closeLoggedWorkoutButton.addEventListener(
    "click",
    closeLoggedWorkoutSummary
);

doneLoggedWorkoutButton.addEventListener(
    "click",
    closeLoggedWorkoutSummary
);


function showLoggedWorkoutSummary(workout) {
    loggedWorkoutTitle.textContent =
        workout.exercise + " Logged!";

    if (workout.workoutType === "Cardio") {
        showLoggedCardioSummary(workout);
    } else {
        showLoggedStrengthSummary(workout);
    }

    openModal(loggedWorkoutModal);
}


function showLoggedStrengthSummary(workout) {
    const totalReps = getEntryTotalReps(workout);
    const volume = getEntryVolume(workout);

    const milestoneData = getMilestoneData(volume);
    const equivalent = milestoneData.current;

    const equivalentCount =
        volume / equivalent.weight;

    loggedWorkoutContent.innerHTML = `
        <div class="summary-grid">
            ${createSummaryBox("Type", workout.workoutType)}
            ${createSummaryBox("Sets", workout.sets)}
            ${createSummaryBox("Total reps", totalReps)}
            ${createSummaryBox(
        "Weight",
        formatNumber(workout.weight) + " kg"
    )}
        </div>

        <div class="logged-fun-card">
            <div class="fun-emoji">${equivalent.emoji}</div>

            <p>
                You moved
                <strong>${formatNumber(volume)} kg</strong>
                in this workout.
            </p>

            <p>
                That is about
                <strong>${formatNumber(equivalentCount)} ×</strong>
                ${equivalent.name}.
            </p>
        </div>

        <p class="logged-summary-date">
            ${formatDateFromString(workout.date)}
        </p>
    `;
}


function showLoggedCardioSummary(workout) {
    const trackLapDistance = 0.4;
    const trackLaps =
        Number(workout.distance || 0) / trackLapDistance;

    loggedWorkoutContent.innerHTML = `
        <div class="summary-grid">
            ${createSummaryBox("Type", "Cardio")}
            ${createSummaryBox(
        "Duration",
        formatNumber(workout.duration) + " min"
    )}
            ${createSummaryBox(
        "Distance",
        formatNumber(workout.distance) + " km"
    )}
        </div>

        <div class="logged-fun-card">
            <div class="fun-emoji">🏃</div>

            <p>
                That distance is about
                <strong>${formatNumber(trackLaps)}</strong>
                laps of a 400 m running track.
            </p>
        </div>

        <p class="logged-summary-date">
            ${formatDateFromString(workout.date)}
        </p>
    `;
}


function closeLoggedWorkoutSummary() {
    closeModal(loggedWorkoutModal);
}


/* =========================================
   OPEN EDIT POPUP
========================================= */

function editWorkout(entryId) {
    const selectedWorkout =
        getWorkoutById(entryId);

    if (selectedWorkout === null) {
        showToast("Workout could not be found.", true);
        return;
    }

    editingEntryId = selectedWorkout.entryId;

    editDateInput.value = selectedWorkout.date;
    editWorkoutType.value = selectedWorkout.workoutType;
    editExerciseInput.value = selectedWorkout.exercise;

    editSetsInput.value = selectedWorkout.sets || "";
    editRepsInput.value = selectedWorkout.reps || "";
    editWeightInput.value = selectedWorkout.weight || "";

    editDurationInput.value = selectedWorkout.duration || "";
    editDistanceInput.value = selectedWorkout.distance || "";

    editNotesInput.value = selectedWorkout.notes || "";

    updateEditFormFields();
    openModal(editModal);
}


/* =========================================
   UPDATE WORKOUT
========================================= */

editForm.addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();

        if (editingEntryId === null) {
            showToast("No workout is selected.", true);
            return;
        }

        const updatedWorkout =
            getEditFormWorkout();

        try {
            updateButton.disabled = true;
            updateButton.textContent = "Updating...";

            if (demoMode) {
                const workoutIndex = workouts.findIndex(
                    workout => workout.entryId === editingEntryId
                );

                if (workoutIndex === -1) {
                    throw new Error("Workout could not be found");
                }

                workouts[workoutIndex] = {
                    ...workouts[workoutIndex],
                    ...updatedWorkout
                };
            } else {
                const user = await window.userManager.getUser();

                const response = await fetch(
                    API_URL + "/" + editingEntryId,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${user.access_token}`
                        },
                        body: JSON.stringify(updatedWorkout)
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to update workout");
                }
            }

            closeEditModal();
            await loadWorkouts();

            showToast("Workout updated successfully!");

        } catch (error) {
            console.log(error);
            showToast("Could not update workout.", true);

        } finally {
            updateButton.disabled = false;
            updateButton.textContent = "Update Exercise";
        }
    }
);


cancelEditButton.addEventListener("click", closeEditModal);
closeModalButton.addEventListener("click", closeEditModal);


function closeEditModal() {
    closeModal(editModal);
    editingEntryId = null;
}


/* =========================================
   DELETE WORKOUT
========================================= */

closeDeleteButton.addEventListener("click", closeDeleteModal);
cancelDeleteButton.addEventListener("click", closeDeleteModal);
confirmDeleteButton.addEventListener("click", confirmDeleteWorkout);


function deleteWorkout(entryId) {
    const selectedWorkout =
        getWorkoutById(entryId);

    if (selectedWorkout === null) {
        showToast("Workout could not be found.", true);
        return;
    }

    deletingEntryId = entryId;

    deleteWorkoutName.textContent =
        selectedWorkout.exercise +
        " • " +
        formatDateFromString(selectedWorkout.date);

    openModal(deleteModal);
}


function closeDeleteModal() {
    closeModal(deleteModal);
    deletingEntryId = null;
}


async function confirmDeleteWorkout() {
    if (deletingEntryId === null) {
        return;
    }

    try {
        confirmDeleteButton.disabled = true;
        confirmDeleteButton.textContent = "Deleting...";

        if (demoMode) {
            workouts = workouts.filter(
                workout => workout.entryId !== deletingEntryId
            );
        } else {
            const user = await window.userManager.getUser();

            const response = await fetch(
                API_URL + "/" + deletingEntryId,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${user.access_token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete workout");
            }
        }

        closeDeleteModal();
        await loadWorkouts();

        showToast("Workout deleted successfully!");

    } catch (error) {
        console.log(error);
        showToast("Could not delete workout.", true);

    } finally {
        confirmDeleteButton.disabled = false;
        confirmDeleteButton.textContent = "Delete Workout";
    }
}


/* =========================================
   WEEK DATE HELPERS
========================================= */

function getWeekRange(referenceDate) {
    const dayNumber = referenceDate.getDay();

    let daysSinceMonday;

    if (dayNumber === 0) {
        daysSinceMonday = 6;
    } else {
        daysSinceMonday = dayNumber - 1;
    }

    const monday = new Date(referenceDate);

    monday.setDate(
        referenceDate.getDate() - daysSinceMonday
    );

    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);

    sunday.setDate(
        monday.getDate() + 6
    );

    sunday.setHours(23, 59, 59, 999);

    return {
        monday: monday,
        sunday: sunday
    };
}


function getSelectedWeekRange() {
    return getWeekRange(summaryReferenceDate);
}


function getSelectedWeekWorkouts() {
    const selectedWeek =
        getSelectedWeekRange();

    return getWorkoutsInRange(
        selectedWeek.monday,
        selectedWeek.sunday
    );
}


function getPreviousWeekWorkouts() {
    const previousWeekDate =
        new Date(summaryReferenceDate);

    previousWeekDate.setDate(
        previousWeekDate.getDate() - 7
    );

    const previousWeek =
        getWeekRange(previousWeekDate);

    return getWorkoutsInRange(
        previousWeek.monday,
        previousWeek.sunday
    );
}


function getWorkoutsInRange(startDate, endDate) {
    let matchingWorkouts = [];

    for (let i = 0; i < workouts.length; i++) {
        const workoutDate =
            new Date(workouts[i].date + "T00:00:00");

        if (
            workoutDate >= startDate &&
            workoutDate <= endDate
        ) {
            matchingWorkouts.push(workouts[i]);
        }
    }

    return matchingWorkouts;
}


function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}


function createWeeklyActivityChart(weekRange, weekWorkouts) {
    let dailyActivity = [];

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const day = new Date(weekRange.monday);

        day.setDate(weekRange.monday.getDate() + dayOffset);

        const dateKey = getDateKey(day);
        let entries = 0;

        for (let i = 0; i < weekWorkouts.length; i++) {
            if (weekWorkouts[i].date === dateKey) {
                entries++;
            }
        }

        dailyActivity.push({
            dayLabel: day.toLocaleDateString("en-SG", {
                weekday: "short"
            }),
            dateLabel: day.toLocaleDateString("en-SG", {
                day: "numeric",
                month: "short"
            }),
            entries: entries
        });
    }

    let highestEntries = 1;

    for (let i = 0; i < dailyActivity.length; i++) {
        if (dailyActivity[i].entries > highestEntries) {
            highestEntries = dailyActivity[i].entries;
        }
    }

    let bars = "";

    for (let i = 0; i < dailyActivity.length; i++) {
        const activity = dailyActivity[i];
        const height =
            (activity.entries / highestEntries) * 100;

        bars += `
            <div class="activity-chart-day">
                <span class="activity-chart-value">
                    ${activity.entries}
                </span>

                <div class="activity-chart-track">
                    <div
                        class="activity-chart-bar"
                        style="height: ${height}%"
                        aria-hidden="true"
                    ></div>
                </div>

                <span class="activity-chart-label">
                    <span>${activity.dayLabel}</span>
                    <small>${activity.dateLabel}</small>
                </span>
            </div>
        `;
    }

    return `
        <div class="report-section activity-chart-section">
            <div class="report-section-heading">
                <h3>Daily activity</h3>
                <p>Workout entries logged each day.</p>
            </div>

            <div
                class="activity-chart"
                role="img"
                aria-label="Daily workout entries for the selected week"
            >
                ${bars}
            </div>
        </div>
    `;
}


/* =========================================
   WEEKLY SUMMARY
========================================= */

previousWeekButton.addEventListener(
    "click",
    showPreviousWeek
);

currentWeekButton.addEventListener(
    "click",
    showCurrentWeek
);

nextWeekButton.addEventListener(
    "click",
    showNextWeek
);

weeklyGoalButton.addEventListener(
    "click",
    openWeeklyGoalModal
);

closeWeeklyGoalButton.addEventListener(
    "click",
    closeWeeklyGoalModal
);

cancelWeeklyGoalButton.addEventListener(
    "click",
    closeWeeklyGoalModal
);

weeklyGoalForm.addEventListener(
    "submit",
    saveWeeklyGoal
);


function openWeeklyGoalModal() {
    weeklyGoalInput.value = weeklyGoal || 4;
    openModal(weeklyGoalModal);
}


function closeWeeklyGoalModal() {
    closeModal(weeklyGoalModal);
}


async function saveWeeklyGoal(event) {
    event.preventDefault();

    try {
        saveWeeklyGoalButton.disabled = true;
        saveWeeklyGoalButton.textContent = "Saving...";

        let savedGoal;

        if (demoMode) {
            savedGoal = Number(weeklyGoalInput.value);
        } else {
            const user = await window.userManager.getUser();

            const response = await fetch(
                API_URL.replace("/entries", "/settings"),
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.access_token}`
                    },
                    body: JSON.stringify({
                        weeklyGoal: Number(weeklyGoalInput.value)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save weekly goal");
            }

            savedGoal = data.weeklyGoal;
        }

        weeklyGoal = savedGoal;
        closeWeeklyGoalModal();
        renderWeeklySummary();

        showToast("Weekly goal saved successfully!");

    } catch (error) {
        console.log(error);
        showToast(error.message || "Could not save weekly goal.", true);

    } finally {
        saveWeeklyGoalButton.disabled = false;
        saveWeeklyGoalButton.textContent = "Save Goal";
    }
}


function showPreviousWeek() {
    summaryReferenceDate.setDate(
        summaryReferenceDate.getDate() - 7
    );

    renderWeeklySummary();
}


function showCurrentWeek() {
    summaryReferenceDate = new Date();

    renderWeeklySummary();
}


function showNextWeek() {
    const selectedWeek =
        getWeekRange(summaryReferenceDate);

    const currentWeek =
        getWeekRange(new Date());

    if (
        selectedWeek.monday >= currentWeek.monday
    ) {
        return;
    }

    summaryReferenceDate.setDate(
        summaryReferenceDate.getDate() + 7
    );

    renderWeeklySummary();
}


function renderWeeklySummary() {
    const selectedWeek =
        getSelectedWeekRange();

    const currentWeek =
        getWeekRange(new Date());

    const selectedWeekWorkouts =
        getSelectedWeekWorkouts();

    const previousWeekWorkouts =
        getPreviousWeekWorkouts();

    const showingCurrentWeek =
        selectedWeek.monday.getTime() ===
        currentWeek.monday.getTime();

    weeklySummaryTitle.textContent =
        showingCurrentWeek
            ? "This Week"
            : "Weekly Summary";

    const dateRangeText =
        formatDate(selectedWeek.monday) +
        " – " +
        formatDate(selectedWeek.sunday);

    weeklyDateRange.textContent = dateRangeText;
    weekNavigationDate.textContent = dateRangeText;

    nextWeekButton.disabled = showingCurrentWeek;
    currentWeekButton.disabled = showingCurrentWeek;

    const selectedWeekSessions =
        countSessions(selectedWeekWorkouts);

    const previousWeekSessions =
        countSessions(previousWeekWorkouts);

    const selectedWeekVolume =
        getStrengthVolume(selectedWeekWorkouts);

    const previousWeekVolume =
        getStrengthVolume(previousWeekWorkouts);

    const selectedWeekDistance =
        getCardioDistance(selectedWeekWorkouts);

    const previousWeekDistance =
        getCardioDistance(previousWeekWorkouts);

    let html = `
        <div class="summary-grid weekly-summary-grid">
            ${createSummaryBox(
        "Sessions",
        selectedWeekSessions
    )}

            ${createSummaryBox(
        "Entries",
        selectedWeekWorkouts.length
    )}

            ${createSummaryBox(
        "Strength volume",
        formatNumber(selectedWeekVolume) + " kg"
    )}

            ${createSummaryBox(
        "Cardio distance",
        formatNumber(selectedWeekDistance) + " km"
    )}
        </div>

        ${createWeeklyMilestonePreview(
        selectedWeekWorkouts
    )}

        ${createWeeklyGoalProgress(
        selectedWeekSessions
    )}
    `;

    html += `
        <div class="report-section">
            <div class="report-section-heading">
                <h3>Compared with previous week</h3>
                <p>
                    A quick look at your overall training load.
                </p>
            </div>

            <div class="comparison-grid">
                ${createComparisonBox(
        "Sessions",
        selectedWeekSessions,
        previousWeekSessions,
        ""
    )}

                ${createComparisonBox(
        "Strength volume",
        selectedWeekVolume,
        previousWeekVolume,
        " kg"
    )}

                ${createComparisonBox(
        "Cardio distance",
        selectedWeekDistance,
        previousWeekDistance,
        " km"
    )}
            </div>
        </div>
    `;

    html += createWeeklyActivityChart(
        selectedWeek,
        selectedWeekWorkouts
    );

    html += createWorkoutSplitSection(
        selectedWeekWorkouts,
        previousWeekWorkouts
    );

    if (selectedWeekWorkouts.length === 0) {
        html += `
            <div class="report-empty-state">
                <h3>No workouts logged for this week</h3>
                <p>
                    Use Previous or Next to browse another week.
                </p>
            </div>
        `;
    }

    weeklySummaryContent.innerHTML = html;
}

function createSummaryBox(label, value) {
    return `
        <div class="summary-box">
            <span class="summary-label">${label}</span>
            <strong>${value}</strong>
        </div>
    `;
}


function createWeeklyGoalProgress(sessionCount) {
    if (weeklyGoal === null) {
        return `
            <div class="weekly-goal-card weekly-goal-empty">
                <strong>Set a weekly workout goal</strong>
                <p>
                    Choose a target to see your progress here.
                </p>
            </div>
        `;
    }

    const progress = Math.round(
        (sessionCount / weeklyGoal) * 100
    );
    const barWidth = Math.min(progress, 100);
    const message =
        sessionCount >= weeklyGoal
            ? "Goal reached — great work!"
            : (weeklyGoal - sessionCount) + " more to reach your goal";

    return `
        <div class="weekly-goal-card">
            <div class="weekly-goal-heading">
                <div>
                    <span>Weekly workout goal</span>
                    <strong>${sessionCount} / ${weeklyGoal} sessions</strong>
                </div>

                <small>${message}</small>
            </div>

            <div
                class="weekly-goal-track"
                role="progressbar"
                aria-label="Weekly workout goal progress"
                aria-valuenow="${sessionCount}"
                aria-valuemin="0"
                aria-valuemax="${weeklyGoal}"
            >
                <div
                    class="weekly-goal-fill"
                    style="width: ${barWidth}%"
                ></div>
            </div>
        </div>
    `;
}


function createComparisonBox(
    label,
    current,
    previous,
    unit
) {
    const changeText =
        getChangeText(current, previous);

    const changeClass =
        getChangeClass(current, previous);

    return `
        <div class="comparison-box">
            <span>${label}</span>
            <strong>
                ${formatNumber(current)}${unit}
            </strong>

            <small class="change-badge ${changeClass}">
                ${changeText}
            </small>
        </div>
    `;
}


function createWeeklyMilestonePreview(
    weekWorkouts
) {
    const totalVolume =
        getStrengthVolume(weekWorkouts);

    if (totalVolume === 0) {
        return `
            <div class="weekly-milestone-preview">
                <div>
                    <span class="milestone-preview-label">
                        ✨ Weekly milestone
                    </span>

                    <strong>
                        Log a strength workout to start
                    </strong>

                    <p>
                        Your weekly fun milestone will appear here.
                    </p>
                </div>
            </div>
        `;
    }

    const milestoneData =
        getMilestoneData(totalVolume);

    const current = milestoneData.current;
    const next = milestoneData.next;

    let nextText =
        "Top milestone reached";

    let progressHtml = "";

    if (next !== null) {
        const remaining =
            next.weight - totalVolume;

        const progress =
            getMilestoneProgress(
                totalVolume,
                current.weight,
                next.weight
            );

        nextText =
            formatNumber(remaining) +
            " kg until " +
            next.name;

        progressHtml = `
            <div class="milestone-progress-track">
                <div
                    class="milestone-progress-fill"
                    style="width: ${progress}%"
                ></div>
            </div>
        `;
    }

    return `
        <div class="weekly-milestone-preview">
            <div class="milestone-preview-main">
                <span class="milestone-preview-label">
                    ✨ Weekly milestone
                </span>

                <div class="milestone-preview-title">
                    <span>${current.emoji}</span>
                    <strong>${current.name}</strong>
                </div>

                <p>
                    ${formatNumber(totalVolume)} kg moved
                    • ${nextText}
                </p>

                ${progressHtml}
            </div>

            <button
                type="button"
                class="milestone-preview-button"
                onclick="showWeeklyFunEquivalent()"
            >
                View Fun Equivalent
            </button>
        </div>
    `;
}


function createWorkoutSplitSection(
    selectedWeekWorkouts,
    previousWeekWorkouts
) {
    const workoutTypes = [
        "Push",
        "Pull",
        "Legs",
        "Cardio",
        "Other"
    ];

    let rows = "";

    for (let i = 0; i < workoutTypes.length; i++) {
        const type = workoutTypes[i];

        const currentTypeWorkouts =
            getWorkoutsByType(
                selectedWeekWorkouts,
                type
            );

        if (currentTypeWorkouts.length === 0) {
            continue;
        }

        const previousTypeWorkouts =
            getWorkoutsByType(
                previousWeekWorkouts,
                type
            );

        const sessionCount =
            countSessions(currentTypeWorkouts);

        let metricText = "";
        let currentMetric = 0;
        let previousMetric = 0;

        if (type === "Cardio") {
            currentMetric =
                getCardioDistance(
                    currentTypeWorkouts
                );

            previousMetric =
                getCardioDistance(
                    previousTypeWorkouts
                );

            metricText =
                formatNumber(currentMetric) +
                " km • " +
                formatNumber(
                    getCardioDuration(
                        currentTypeWorkouts
                    )
                ) +
                " min";

        } else {
            currentMetric =
                getStrengthVolume(
                    currentTypeWorkouts
                );

            previousMetric =
                getStrengthVolume(
                    previousTypeWorkouts
                );

            metricText =
                formatNumber(currentMetric) +
                " kg volume";
        }

        let funButton = "";

        if (type !== "Cardio") {
            funButton = `
                <button
                    type="button"
                    class="split-fun-button"
                    onclick="showSplitFunEquivalent('${type}')"
                >
                    ✨ Fun Equivalent
                </button>
            `;
        }

        rows += `
            <div class="breakdown-row">

                <div class="breakdown-info">
                    <span class="type-badge">
                        ${type}
                    </span>

                    <div>
                        <button
                            type="button"
                            class="session-count-button"
                            onclick="showSplitSessions('${type}')"
                        >
                            ${sessionCount}
                            ${sessionCount === 1 ? "session" : "sessions"}
                            →
                        </button>

                        <span>
                            ${currentTypeWorkouts.length}
                            ${currentTypeWorkouts.length === 1
                ? "entry"
                : "entries"}
                        </span>
                    </div>
                </div>

                <div class="split-stats">
                    <strong>${metricText}</strong>

                    <small
                        class="change-badge
                        ${getChangeClass(
                    currentMetric,
                    previousMetric
                )}"
                    >
                        ${getChangeText(
                    currentMetric,
                    previousMetric
                )}
                    </small>

                    ${funButton}
                </div>

            </div>
        `;
    }

    if (rows === "") {
        rows = `
            <p class="muted-text">
                No workout types to show yet.
            </p>
        `;
    }

    return `
        <div class="report-section">
            <div class="report-section-heading">
                <h3>Workout split</h3>
                <p>
                    Open a session to see the exercises you logged.
                    Strength splits also include a fun equivalent.
                </p>
            </div>

            <div class="breakdown-list">
                ${rows}
            </div>
        </div>
    `;
}


/* =========================================
   WEEKLY FUN EQUIVALENT
========================================= */

closeFunEquivalentButton.addEventListener(
    "click",
    closeWeeklyFunEquivalent
);


function showWeeklyFunEquivalent() {
    const selectedWeek =
        getSelectedWeekRange();

    const selectedWeekWorkouts =
        getSelectedWeekWorkouts();

    const totalVolume =
        getStrengthVolume(selectedWeekWorkouts);

    const totalReps =
        getTotalReps(selectedWeekWorkouts);

    if (totalVolume === 0) {
        funEquivalentContent.innerHTML = `
            <div class="report-empty-state">
                <h3>No strength volume for this week</h3>
                <p>
                    Choose another week or log a strength workout.
                </p>
            </div>
        `;

        openModal(funEquivalentModal);
        return;
    }

    const milestoneData =
        getMilestoneData(totalVolume);

    const current = milestoneData.current;
    const previous = milestoneData.previous;
    const next = milestoneData.next;

    let previousText =
        "No previous milestone";

    if (previous !== null) {
        previousText =
            previous.emoji +
            " " +
            previous.name +
            " (" +
            formatNumber(previous.weight) +
            " kg)";
    }

    let nextSection = "";

    if (next !== null) {
        const remainingWeight =
            next.weight - totalVolume;

        const progressPercent =
            getMilestoneProgress(
                totalVolume,
                current.weight,
                next.weight
            );

        nextSection = `
            <div class="milestone-next">
                <span>Next milestone</span>

                <strong>
                    ${next.emoji} ${next.name}
                </strong>

                <p>
                    ${formatNumber(remainingWeight)}
                    kg more to reach it
                </p>

                <div class="milestone-progress-track">
                    <div
                        class="milestone-progress-fill"
                        style="width: ${progressPercent}%"
                    ></div>
                </div>

                <small>
                    ${progressPercent}% of the way there
                </small>
            </div>
        `;

    } else {
        nextSection = `
            <div class="milestone-next">
                <span>Next milestone</span>
                <strong>🏆 Top milestone reached</strong>
                <p>
                    You have passed every milestone in FitTrack V1.
                </p>
            </div>
        `;
    }

    funEquivalentContent.innerHTML = `
        <div class="fun-result">
            <div class="fun-emoji">${current.emoji}</div>

            <p class="fun-intro">
                For ${formatDate(selectedWeek.monday)}
                – ${formatDate(selectedWeek.sunday)},
                your strength workouts moved
            </p>

            <strong class="fun-total">
                ${formatNumber(totalVolume)} kg
            </strong>

            <p class="fun-equivalent-text">
                Your current milestone is
                <strong>${current.name}</strong>.
            </p>
        </div>

        <div class="milestone-grid">
            <div class="milestone-card">
                <span>Previous</span>
                <strong>${previousText}</strong>
            </div>

            <div class="milestone-card milestone-current">
                <span>Current</span>

                <strong>
                    ${current.emoji} ${current.name}
                </strong>

                <small>
                    ${formatNumber(current.weight)}
                    kg milestone
                </small>
            </div>
        </div>

        ${nextSection}

        <div class="summary-grid fun-summary-grid">
            ${createSummaryBox(
        "Total reps",
        formatNumber(totalReps)
    )}

            ${createSummaryBox(
        "Training volume",
        formatNumber(totalVolume) + " kg"
    )}

            ${createSummaryBox(
        "Current milestone",
        formatNumber(current.weight) + " kg"
    )}
        </div>

        <div class="fun-explanation">
            <strong>How it is calculated</strong>

            <p>
                FitTrack calculates sets × reps × weight
                for every strength entry in the selected week,
                then adds them together.
                The reference weights are approximate
                and just for fun.
            </p>
        </div>
    `;

    openModal(funEquivalentModal);
}


function closeWeeklyFunEquivalent() {
    closeModal(funEquivalentModal);
}


/* =========================================
   FUN EQUIVALENT HELPERS
========================================= */

function getTotalReps(workoutArray) {
    let totalReps = 0;

    for (let i = 0; i < workoutArray.length; i++) {
        if (workoutArray[i].workoutType === "Cardio") {
            continue;
        }

        totalReps +=
            getEntryTotalReps(workoutArray[i]);
    }

    return totalReps;
}


function getFunMilestones() {
    return [
        {
            name: "house cat",
            weight: 5,
            emoji: "🐈"
        },
        {
            name: "golden retriever",
            weight: 30,
            emoji: "🐕"
        },
        {
            name: "giant panda",
            weight: 100,
            emoji: "🐼"
        },
        {
            name: "grand piano",
            weight: 300,
            emoji: "🎹"
        },
        {
            name: "cow",
            weight: 650,
            emoji: "🐄"
        },
        {
            name: "small car",
            weight: 1200,
            emoji: "🚗"
        },
        {
            name: "hippopotamus",
            weight: 1500,
            emoji: "🦛"
        },
        {
            name: "African elephant",
            weight: 6000,
            emoji: "🐘"
        },
        {
            name: "school bus",
            weight: 12000,
            emoji: "🚌"
        },
        {
            name: "delivery truck",
            weight: 18000,
            emoji: "🚚"
        }
    ];
}


function getMilestoneData(totalWeight) {
    const milestones =
        getFunMilestones();

    let currentIndex = 0;

    for (let i = 0; i < milestones.length; i++) {
        if (totalWeight >= milestones[i].weight) {
            currentIndex = i;
        } else {
            break;
        }
    }

    let previous = null;
    let next = null;

    if (currentIndex > 0) {
        previous =
            milestones[currentIndex - 1];
    }

    if (currentIndex < milestones.length - 1) {
        next =
            milestones[currentIndex + 1];
    }

    return {
        previous: previous,
        current: milestones[currentIndex],
        next: next
    };
}


function getMilestoneProgress(
    totalWeight,
    currentWeight,
    nextWeight
) {
    const progressRange =
        nextWeight - currentWeight;

    const progressMade =
        totalWeight - currentWeight;

    let percent =
        (progressMade / progressRange) * 100;

    percent = Math.round(percent);

    if (percent < 0) {
        percent = 0;
    }

    if (percent > 100) {
        percent = 100;
    }

    return percent;
}


/* =========================================
   WEEKLY SUMMARY CALCULATIONS
========================================= */

function countSessions(workoutArray) {
    let sessions = [];

    for (let i = 0; i < workoutArray.length; i++) {
        const sessionName =
            workoutArray[i].date +
            "-" +
            workoutArray[i].workoutType;

        if (!sessions.includes(sessionName)) {
            sessions.push(sessionName);
        }
    }

    return sessions.length;
}


function getStrengthVolume(workoutArray, type) {
    let totalVolume = 0;

    for (let i = 0; i < workoutArray.length; i++) {
        const workout = workoutArray[i];

        if (workout.workoutType === "Cardio") {
            continue;
        }

        if (
            type !== undefined &&
            workout.workoutType !== type
        ) {
            continue;
        }

        totalVolume +=
            getEntryVolume(workout);
    }

    return totalVolume;
}


function getCardioDistance(workoutArray) {
    let totalDistance = 0;

    for (let i = 0; i < workoutArray.length; i++) {
        if (workoutArray[i].workoutType === "Cardio") {
            totalDistance +=
                Number(workoutArray[i].distance || 0);
        }
    }

    return totalDistance;
}


function getCardioDuration(workoutArray) {
    let totalDuration = 0;

    for (let i = 0; i < workoutArray.length; i++) {
        if (workoutArray[i].workoutType === "Cardio") {
            totalDuration +=
                Number(workoutArray[i].duration || 0);
        }
    }

    return totalDuration;
}


function getWorkoutsByType(workoutArray, type) {
    let matchingWorkouts = [];

    for (let i = 0; i < workoutArray.length; i++) {
        if (workoutArray[i].workoutType === type) {
            matchingWorkouts.push(workoutArray[i]);
        }
    }

    return matchingWorkouts;
}


function getChangeText(current, previous) {
    if (previous === 0) {
        if (current === 0) {
            return "No change";
        }

        return "New this week";
    }

    const percentChange =
        ((current - previous) / previous) * 100;

    const roundedChange =
        Math.round(percentChange * 10) / 10;

    if (roundedChange > 0) {
        return "+" + roundedChange + "%";
    }

    if (roundedChange < 0) {
        return roundedChange + "%";
    }

    return "No change";
}


function getChangeClass(current, previous) {
    if (current > previous) {
        return "positive";
    }

    if (current < previous) {
        return "negative";
    }

    return "neutral";
}


/* =========================================
   EXERCISE PROGRESS
========================================= */

exerciseProgressButton.addEventListener(
    "click",
    openExerciseProgress
);

closeExerciseProgressButton.addEventListener(
    "click",
    closeExerciseProgress
);

exerciseProgressSelect.addEventListener(
    "change",
    renderExerciseProgress
);


function openExerciseProgress() {
    populateExerciseProgressOptions();
    renderExerciseProgress();

    openModal(exerciseProgressModal);
}


function closeExerciseProgress() {
    closeModal(exerciseProgressModal);
}


function populateExerciseProgressOptions() {
    const previousSelection =
        exerciseProgressSelect.value;

    const exerciseNames =
        getUniqueExerciseNames();

    exerciseProgressSelect.innerHTML = "";

    for (let i = 0; i < exerciseNames.length; i++) {
        const option =
            document.createElement("option");

        option.value = exerciseNames[i];
        option.textContent = exerciseNames[i];

        exerciseProgressSelect.appendChild(option);
    }

    if (
        previousSelection &&
        exerciseNames.includes(previousSelection)
    ) {
        exerciseProgressSelect.value =
            previousSelection;
    }
}


function renderExerciseProgress() {
    const selectedExercise =
        exerciseProgressSelect.value;

    if (!selectedExercise) {
        exerciseProgressContent.innerHTML = `
            <div class="report-empty-state">
                <h3>No exercise history yet</h3>
                <p>
                    Log a workout first to start tracking progress.
                </p>
            </div>
        `;

        return;
    }

    const exerciseHistory =
        getExerciseHistory(selectedExercise);

    if (exerciseHistory.length === 0) {
        return;
    }

    const latestWorkout =
        exerciseHistory[0];

    if (latestWorkout.workoutType === "Cardio") {
        renderCardioExerciseProgress(
            exerciseHistory
        );
    } else {
        renderStrengthExerciseProgress(
            exerciseHistory
        );
    }
}


function renderStrengthExerciseProgress(exerciseHistory) {
    let highestWeight = 0;
    let totalVolume = 0;
    let bestVolume = 0;

    for (let i = 0; i < exerciseHistory.length; i++) {
        const workout =
            exerciseHistory[i];

        const weight =
            Number(workout.weight || 0);

        const entryVolume =
            getEntryVolume(workout);

        if (weight > highestWeight) {
            highestWeight = weight;
        }

        if (entryVolume > bestVolume) {
            bestVolume = entryVolume;
        }

        totalVolume += entryVolume;
    }

    const latestWeight =
        Number(exerciseHistory[0].weight || 0);

    let recentChange = "First entry";
    let recentChangeClass = "neutral";

    if (exerciseHistory.length > 1) {
        const previousWeight =
            Number(exerciseHistory[1].weight || 0);

        const difference =
            latestWeight - previousWeight;

        if (difference > 0) {
            recentChange =
                "+" +
                formatNumber(difference) +
                " kg";

            recentChangeClass = "positive";

        } else if (difference < 0) {
            recentChange =
                formatNumber(difference) +
                " kg";

            recentChangeClass = "negative";

        } else {
            recentChange =
                "No weight change";
        }
    }

    const historyRows =
        createExerciseHistoryRows(
            exerciseHistory
        );

    exerciseProgressContent.innerHTML = `
        <div class="summary-grid exercise-summary-grid">
            ${createSummaryBox(
        "Personal best",
        formatNumber(highestWeight) + " kg"
    )}

            ${createSummaryBox(
        "Best entry volume",
        formatNumber(bestVolume) + " kg"
    )}

            ${createSummaryBox(
        "Total recorded volume",
        formatNumber(totalVolume) + " kg"
    )}
        </div>

        <div class="report-section">
            <div class="report-section-heading">
                <h3>Latest change</h3>
                <p>
                    Latest logged weight compared
                    with the previous entry.
                </p>
            </div>

            <div class="latest-progress-box">
                <strong>
                    ${formatNumber(latestWeight)} kg
                </strong>

                <small class="change-badge ${recentChangeClass}">
                    ${recentChange}
                </small>
            </div>
        </div>

        ${createHistorySection(historyRows)}
    `;
}


function renderCardioExerciseProgress(exerciseHistory) {
    let longestDistance = 0;
    let longestDuration = 0;
    let totalDistance = 0;

    for (let i = 0; i < exerciseHistory.length; i++) {
        const distance =
            Number(exerciseHistory[i].distance || 0);

        const duration =
            Number(exerciseHistory[i].duration || 0);

        if (distance > longestDistance) {
            longestDistance = distance;
        }

        if (duration > longestDuration) {
            longestDuration = duration;
        }

        totalDistance += distance;
    }

    const latestDistance =
        Number(exerciseHistory[0].distance || 0);

    let recentChange = "First entry";
    let recentChangeClass = "neutral";

    if (exerciseHistory.length > 1) {
        const previousDistance =
            Number(exerciseHistory[1].distance || 0);

        const difference =
            latestDistance - previousDistance;

        if (difference > 0) {
            recentChange =
                "+" +
                formatNumber(difference) +
                " km";

            recentChangeClass = "positive";

        } else if (difference < 0) {
            recentChange =
                formatNumber(difference) +
                " km";

            recentChangeClass = "negative";

        } else {
            recentChange =
                "No distance change";
        }
    }

    const historyRows =
        createExerciseHistoryRows(
            exerciseHistory
        );

    exerciseProgressContent.innerHTML = `
        <div class="summary-grid exercise-summary-grid">
            ${createSummaryBox(
        "Longest distance",
        formatNumber(longestDistance) + " km"
    )}

            ${createSummaryBox(
        "Longest session",
        formatNumber(longestDuration) + " min"
    )}

            ${createSummaryBox(
        "Total distance",
        formatNumber(totalDistance) + " km"
    )}
        </div>

        <div class="report-section">
            <div class="report-section-heading">
                <h3>Latest change</h3>
                <p>
                    Latest distance compared
                    with the previous entry.
                </p>
            </div>

            <div class="latest-progress-box">
                <strong>
                    ${formatNumber(latestDistance)} km
                </strong>

                <small class="change-badge ${recentChangeClass}">
                    ${recentChange}
                </small>
            </div>
        </div>

        ${createHistorySection(historyRows)}
    `;
}


function getUniqueExerciseNames() {
    let names = [];
    let lowercaseNames = [];

    for (let i = 0; i < workouts.length; i++) {
        const name =
            workouts[i].exercise.trim();

        const lowercaseName =
            name.toLowerCase();

        if (!lowercaseNames.includes(lowercaseName)) {
            names.push(name);
            lowercaseNames.push(lowercaseName);
        }
    }

    names.sort();

    return names;
}


function getExerciseHistory(exerciseName) {
    let history = [];

    const selectedName =
        exerciseName.toLowerCase();

    for (let i = 0; i < workouts.length; i++) {
        if (
            workouts[i].exercise.toLowerCase() ===
            selectedName
        ) {
            history.push(workouts[i]);
        }
    }

    history.sort(
        function (a, b) {
            return (
                new Date(b.date) -
                new Date(a.date)
            );
        }
    );

    return history;
}


function createExerciseHistoryRows(exerciseHistory) {
    let rows = "";

    const amountToShow =
        Math.min(
            exerciseHistory.length,
            8
        );

    for (let i = 0; i < amountToShow; i++) {
        const workout =
            exerciseHistory[i];

        let details = "";

        if (workout.workoutType === "Cardio") {
            details =
                formatNumber(workout.distance || 0) +
                " km • " +
                formatNumber(workout.duration || 0) +
                " min";

        } else {
            details =
                formatNumber(workout.weight || 0) +
                " kg • " +
                workout.sets +
                " × " +
                workout.reps;
        }

        rows += `
            <div class="history-row">
                <div>
                    <strong>
                        ${formatDateFromString(workout.date)}
                    </strong>

                    <span>
                        ${workout.workoutType}
                    </span>
                </div>

                <span>${details}</span>
            </div>
        `;
    }

    return rows;
}


function createHistorySection(historyRows) {
    return `
        <div class="report-section">
            <div class="report-section-heading">
                <h3>Recent history</h3>
                <p>Showing up to your latest 8 entries.</p>
            </div>

            <div class="history-list">
                ${historyRows}
            </div>
        </div>
    `;
}


/* =========================================
   SEARCH AND FILTER
========================================= */

searchExercise.addEventListener("input", filterWorkouts);
typeFilter.addEventListener("change", filterWorkouts);


function filterWorkouts() {
    const searchText =
        searchExercise.value
            .toLowerCase()
            .trim();

    const selectedType =
        typeFilter.value;

    let filteredWorkouts = [];

    for (let i = 0; i < workouts.length; i++) {
        const workout =
            workouts[i];

        const matchesSearch =
            workout.exercise
                .toLowerCase()
                .includes(searchText);

        const matchesType =
            selectedType === "All" ||
            workout.workoutType === selectedType;

        if (matchesSearch && matchesType) {
            filteredWorkouts.push(workout);
        }
    }

    filteredWorkouts.sort(
        function (a, b) {
            return (
                new Date(b.date) -
                new Date(a.date)
            );
        }
    );

    historyResultCount.textContent =
        "Showing " +
        filteredWorkouts.length +
        " of " +
        workouts.length +
        " entries";

    displayWorkouts(filteredWorkouts);
}


/* =========================================
   DISPLAY WORKOUT HISTORY
========================================= */

function displayWorkouts(workoutsToDisplay) {
    workoutList.innerHTML = "";

    if (workoutsToDisplay.length === 0) {
        workoutList.innerHTML = `
            <div class="empty-state">
                <h3>No workouts found</h3>
                <p>
                    Log a workout or change your search filters.
                </p>
            </div>
        `;

        return;
    }

    let lastDate = "";

    for (let i = 0; i < workoutsToDisplay.length; i++) {
        const workout =
            workoutsToDisplay[i];

        if (workout.date !== lastDate) {
            const dateHeading =
                document.createElement("div");

            dateHeading.classList.add(
                "history-date-heading"
            );

            dateHeading.textContent =
                formatDateFromString(workout.date);

            workoutList.appendChild(dateHeading);

            lastDate = workout.date;
        }

        const workoutCard =
            document.createElement("div");

        workoutCard.classList.add(
            "workout-card"
        );

        let workoutDetails = "";

        if (workout.workoutType === "Cardio") {
            workoutDetails = `
                <div class="workout-metrics">
                    <span>
                        ${formatNumber(workout.duration || 0)} min
                    </span>

                    <span>
                        ${formatNumber(workout.distance || 0)} km
                    </span>
                </div>
            `;

        } else {
            workoutDetails = `
                <div class="workout-metrics">
                    <span>${workout.sets} sets</span>
                    <span>${workout.reps} reps</span>

                    <span>
                        ${formatNumber(workout.weight || 0)} kg
                    </span>
                </div>
            `;
        }

        let notes = "";

        if (workout.notes) {
            notes = `
                <p class="workout-notes">
                    ${escapeHtml(workout.notes)}
                </p>
            `;
        }

        let personalRecordBadge = "";

        if (isPersonalRecord(workout)) {
            personalRecordBadge = `
                <span class="pr-badge">PR</span>
            `;
        }

        workoutCard.innerHTML = `
            <div class="workout-card-top">

                <div class="workout-title-row">
                    <h3>
                        ${escapeHtml(workout.exercise)}
                    </h3>

                    ${personalRecordBadge}
                </div>

                <span class="type-badge">
                    ${workout.workoutType}
                </span>

            </div>

            ${workoutDetails}
            ${notes}

            <div class="card-actions">
                <button
                    class="edit-btn"
                    onclick="editWorkout('${workout.entryId}')"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteWorkout('${workout.entryId}')"
                >
                    Delete
                </button>
            </div>
        `;

        workoutList.appendChild(workoutCard);
    }
}


function isPersonalRecord(workout) {
    const sameExercise =
        getExerciseHistory(workout.exercise);

    if (sameExercise.length === 0) {
        return false;
    }

    if (workout.workoutType === "Cardio") {
        let longestDistance = 0;

        for (let i = 0; i < sameExercise.length; i++) {
            const distance =
                Number(sameExercise[i].distance || 0);

            if (distance > longestDistance) {
                longestDistance = distance;
            }
        }

        return (
            Number(workout.distance || 0) ===
            longestDistance &&
            longestDistance > 0
        );
    }

    let highestWeight = 0;

    for (let i = 0; i < sameExercise.length; i++) {
        const weight =
            Number(sameExercise[i].weight || 0);

        if (weight > highestWeight) {
            highestWeight = weight;
        }
    }

    return (
        Number(workout.weight || 0) ===
        highestWeight &&
        highestWeight > 0
    );
}


/* =========================================
   WORKOUT SPLIT FUN EQUIVALENT
========================================= */

closeSplitFunButton.addEventListener(
    "click",
    closeSplitFunEquivalent
);


function showSplitFunEquivalent(workoutTypeName) {
    const selectedWeek =
        getSelectedWeekRange();

    const selectedWeekWorkouts =
        getSelectedWeekWorkouts();

    const splitWorkouts =
        getWorkoutsByType(
            selectedWeekWorkouts,
            workoutTypeName
        );

    const splitVolume =
        getStrengthVolume(splitWorkouts);

    const splitReps =
        getTotalReps(splitWorkouts);

    if (splitVolume === 0) {
        return;
    }

    const milestoneData =
        getMilestoneData(splitVolume);

    const equivalent =
        milestoneData.current;

    const equivalentCount =
        splitVolume / equivalent.weight;

    splitFunTitle.textContent =
        workoutTypeName + " Fun Equivalent";

    splitFunContent.innerHTML = `
        <div class="fun-result">
            <div class="fun-emoji">
                ${equivalent.emoji}
            </div>

            <p class="fun-intro">
                ${workoutTypeName} training for
                ${formatDate(selectedWeek.monday)}
                – ${formatDate(selectedWeek.sunday)}
                moved
            </p>

            <strong class="fun-total">
                ${formatNumber(splitVolume)} kg
            </strong>

            <p class="fun-equivalent-text">
                That is about
                <strong>
                    ${formatNumber(equivalentCount)} ×
                </strong>
                ${equivalent.name}.
            </p>
        </div>

        <div class="summary-grid">
            ${createSummaryBox(
        "Entries",
        splitWorkouts.length
    )}

            ${createSummaryBox(
        "Total reps",
        formatNumber(splitReps)
    )}

            ${createSummaryBox(
        "Training volume",
        formatNumber(splitVolume) + " kg"
    )}
        </div>

        <div class="fun-explanation">
            <strong>How it is calculated</strong>

            <p>
                FitTrack adds sets × reps × weight
                for every ${workoutTypeName} entry
                in the selected week.
            </p>
        </div>
    `;

    openModal(splitFunModal);
}


function closeSplitFunEquivalent() {
    closeModal(splitFunModal);
}


/* =========================================
   WORKOUT SPLIT SESSIONS
========================================= */

closeSessionButton.addEventListener(
    "click",
    closeSplitSessions
);


function showSplitSessions(workoutTypeName) {
    const selectedWeek =
        getSelectedWeekRange();

    const selectedWeekWorkouts =
        getSelectedWeekWorkouts();

    const splitWorkouts =
        getWorkoutsByType(
            selectedWeekWorkouts,
            workoutTypeName
        );

    sessionTitle.textContent =
        workoutTypeName + " Sessions";

    if (splitWorkouts.length === 0) {
        sessionContent.innerHTML = `
            <div class="report-empty-state">
                <h3>No sessions to show</h3>
                <p>
                    There are no ${workoutTypeName}
                    workouts in this week.
                </p>
            </div>
        `;

        openModal(sessionModal);
        return;
    }

    const sessionDates =
        getSessionDates(splitWorkouts);

    let html = `
        <p class="session-week-range">
            ${formatDate(selectedWeek.monday)}
            – ${formatDate(selectedWeek.sunday)}
        </p>
    `;

    for (let i = 0; i < sessionDates.length; i++) {
        const sessionDate = sessionDates[i];

        const sessionWorkouts =
            getWorkoutsOnDate(
                splitWorkouts,
                sessionDate
            );

        let sessionSummary = "";

        if (workoutTypeName === "Cardio") {
            sessionSummary =
                formatNumber(
                    getCardioDistance(
                        sessionWorkouts
                    )
                ) +
                " km • " +
                formatNumber(
                    getCardioDuration(
                        sessionWorkouts
                    )
                ) +
                " min";

        } else {
            sessionSummary =
                formatNumber(
                    getStrengthVolume(
                        sessionWorkouts
                    )
                ) +
                " kg volume";
        }

        html += `
            <div class="session-card">

                <div class="session-card-header">
                    <div>
                        <strong>
                            ${formatDateFromString(
            sessionDate
        )}
                        </strong>

                        <span>
                            ${sessionWorkouts.length}
                            ${sessionWorkouts.length === 1
                ? "exercise entry"
                : "exercise entries"}
                        </span>
                    </div>

                    <span class="session-total">
                        ${sessionSummary}
                    </span>
                </div>

                <div class="session-exercise-list">
                    ${createSessionExerciseRows(
                    sessionWorkouts
                )}
                </div>

            </div>
        `;
    }

    sessionContent.innerHTML = html;
    openModal(sessionModal);
}


function closeSplitSessions() {
    closeModal(sessionModal);
}


function getSessionDates(workoutArray) {
    let dates = [];

    for (let i = 0; i < workoutArray.length; i++) {
        const date = workoutArray[i].date;

        if (!dates.includes(date)) {
            dates.push(date);
        }
    }

    dates.sort(
        function (a, b) {
            return new Date(b) - new Date(a);
        }
    );

    return dates;
}


function getWorkoutsOnDate(
    workoutArray,
    date
) {
    let matchingWorkouts = [];

    for (let i = 0; i < workoutArray.length; i++) {
        if (workoutArray[i].date === date) {
            matchingWorkouts.push(
                workoutArray[i]
            );
        }
    }

    return matchingWorkouts;
}


function createSessionExerciseRows(
    sessionWorkouts
) {
    let rows = "";

    for (let i = 0; i < sessionWorkouts.length; i++) {
        const workout = sessionWorkouts[i];

        let details = "";

        if (workout.workoutType === "Cardio") {
            details =
                formatNumber(
                    workout.distance || 0
                ) +
                " km • " +
                formatNumber(
                    workout.duration || 0
                ) +
                " min";

        } else {
            details =
                workout.sets +
                " × " +
                workout.reps +
                " • " +
                formatNumber(
                    workout.weight || 0
                ) +
                " kg";
        }

        let notes = "";

        if (workout.notes) {
            notes = `
                <small class="session-notes">
                    ${escapeHtml(workout.notes)}
                </small>
            `;
        }

        rows += `
            <div class="session-exercise-row">
                <div>
                    <strong>
                        ${escapeHtml(
            workout.exercise
        )}
                    </strong>

                    ${notes}
                </div>

                <span>${details}</span>
            </div>
        `;
    }

    return rows;
}


/* =========================================
   MODAL HELPERS
========================================= */

function openModal(modal) {
    modal.classList.add("show");
    document.body.classList.add("modal-open");
}


function closeModal(modal) {
    modal.classList.remove("show");

    const anyModalOpen =
        document.querySelector(".modal.show");

    if (anyModalOpen === null) {
        document.body.classList.remove("modal-open");
    }
}


/* Close a popup when its dark background is clicked. */
workoutModal.addEventListener(
    "click",
    function (event) {
        if (event.target === workoutModal) {
            closeWorkoutModal();
        }
    }
);

loggedWorkoutModal.addEventListener(
    "click",
    function (event) {
        if (event.target === loggedWorkoutModal) {
            closeLoggedWorkoutSummary();
        }
    }
);

exerciseProgressModal.addEventListener(
    "click",
    function (event) {
        if (event.target === exerciseProgressModal) {
            closeExerciseProgress();
        }
    }
);

funEquivalentModal.addEventListener(
    "click",
    function (event) {
        if (event.target === funEquivalentModal) {
            closeWeeklyFunEquivalent();
        }
    }
);

splitFunModal.addEventListener(
    "click",
    function (event) {
        if (event.target === splitFunModal) {
            closeSplitFunEquivalent();
        }
    }
);

sessionModal.addEventListener(
    "click",
    function (event) {
        if (event.target === sessionModal) {
            closeSplitSessions();
        }
    }
);

deleteModal.addEventListener(
    "click",
    function (event) {
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
    }
);

editModal.addEventListener(
    "click",
    function (event) {
        if (event.target === editModal) {
            closeEditModal();
        }
    }
);

weeklyGoalModal.addEventListener(
    "click",
    function (event) {
        if (event.target === weeklyGoalModal) {
            closeWeeklyGoalModal();
        }
    }
);


/* Close the currently open popup with Escape. */
document.addEventListener(
    "keydown",
    function (event) {
        if (event.key !== "Escape") {
            return;
        }

        if (deleteModal.classList.contains("show")) {
            closeDeleteModal();
            return;
        }

        if (weeklyGoalModal.classList.contains("show")) {
            closeWeeklyGoalModal();
            return;
        }

        if (sessionModal.classList.contains("show")) {
            closeSplitSessions();
            return;
        }

        if (splitFunModal.classList.contains("show")) {
            closeSplitFunEquivalent();
            return;
        }

        if (funEquivalentModal.classList.contains("show")) {
            closeWeeklyFunEquivalent();
            return;
        }

        if (loggedWorkoutModal.classList.contains("show")) {
            closeLoggedWorkoutSummary();
            return;
        }

        if (workoutModal.classList.contains("show")) {
            closeWorkoutModal();
            return;
        }

        if (editModal.classList.contains("show")) {
            closeEditModal();
            return;
        }

        if (exerciseProgressModal.classList.contains("show")) {
            closeExerciseProgress();
        }
    }
);


/* =========================================
   DISPLAY HELPERS
========================================= */

function formatNumber(number) {
    const roundedNumber =
        Math.round(Number(number) * 10) / 10;

    return roundedNumber.toLocaleString();
}


function formatDate(date) {
    return date.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric"
        }
    );
}


function formatDateFromString(dateString) {
    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}


function escapeHtml(text) {
    const temporaryElement =
        document.createElement("div");

    temporaryElement.textContent =
        text || "";

    return temporaryElement.innerHTML;
}


/* =========================================
   TOAST MESSAGE
========================================= */

function showToast(message, isError) {
    toast.textContent = message;

    if (isError === true) {
        toast.classList.add("error");
    } else {
        toast.classList.remove("error");
    }

    toast.classList.add("show");

    setTimeout(
        function () {
            toast.classList.remove("show");
        },
        2500
    );
}


/* =========================================
   START APP
========================================= */

showWeeklySummaryView();
setDefaultDate();
updateMainFormFields();
showLoadingState();
