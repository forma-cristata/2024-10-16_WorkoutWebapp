import {SetRepExercise, TimerExercise} from "./Exercise.mjs";
import * as i from "./index.mjs";
import {DISPLAY_BASE_FORM} from "./index.mjs";

export {
    displayParametersForStartedWorkout,
    openStartWorkoutForm,
    eraseExistingWorkouts,
    getData,
    onWorkoutSubmit,
    displayAllWorkouts,
    all_workouts,
    saveEdits,
    addOrEditWorkout,
    displayChosenSelections,
    deleteWorkout,
    createSets,
    createCountdown,
    deleteSets,
};

const BASE_PAGE = document.getElementById("base-form");
const WORKOUT_FORM = document.getElementById("wo-form");
const START_WO_FORM = document.getElementById("start-wo");


const WORKOUT_BARRIER_DIV = document.getElementById("start-wo-barrier");
const WORKOUT_STARTED_DIV = document.getElementById("workout-officially-started");



const SET_REP_BUTTON = document.getElementById("set-rep-choice-btn");
const SET_REP_PARAMS_FIELD = document.getElementById("set-rep-parameters");

const TIMER_BUTTON = document.getElementById("timer-choice-btn");
const TIMER_PARAMS_FIELD = document.getElementById("timer-parameters");

const PAUSE_TIMER_BUTTON = document.getElementById("pause-timer");
const PLAY_TIMER_BUTTON = document.getElementById("play-timer");




/**
 * A variable that allows all the functions here to interact with the memory file easily
 * @type {*[]}
 */
let all_workouts = [];

let completed = [];



/**
 * newEx MUST BE GLOBAL!
 * Otherwise, it lacks modularity and readability.
 * Passing this variable between all the functions became ridiculously difficult to follow.
 * Additionally, globalization of newEx allows it to take on new forms spontaneously...
 * ... as the user interacts with the form.
 */
let newEx;


/**
 * Shows all saved workouts, accessed via global "all_workouts", NOT MEMORY
 */
function displayAllWorkouts() {
    for (let i = 0; i < all_workouts.length; i++) {
        let workoutRow = document.createElement("tr");

        document.querySelector("#base-tbl tbody").appendChild(workoutRow);

        let workoutId = document.createElement("td",);
        workoutId.textContent = `${i}`;
        workoutRow.appendChild(workoutId);
        let workoutType = document.createElement("td");

        let workoutImage = document.createElement("img");
        workoutImage.height = 20;
        workoutImage.width = 20;


        let workoutParameters = document.createElement('td');
        if (all_workouts[i].type === "timer") {
            workoutImage.src = "../images/timer.png";
            workoutImage.alt = "timer-image";
            workoutParameters.innerHTML = `<i>${all_workouts[i].hours}<small>:${all_workouts[i].minutes > 10 ? all_workouts[i].minutes : "0" + all_workouts[i].minutes}</small></i>`;
            workoutImage.height = 40;
            workoutImage.width = 40;
        } else {
            workoutImage.src = "../images/dumbbell.png";
            workoutImage.alt = "dumbbell-image";
            workoutImage.height = 40;
            workoutImage.width = 40;
            workoutParameters.innerHTML = `<sup>${all_workouts[i].sets} sets</sup> / <sub>${all_workouts[i].reps} reps</sub>`;
        }
        workoutType.appendChild(workoutImage);
        workoutRow.appendChild(workoutType);

        let workoutName = document.createElement('td');
        workoutName.textContent = `${all_workouts[i].name}`;
        workoutRow.appendChild(workoutName);
        workoutRow.appendChild(workoutParameters);

        let deleteButton = document.createElement('button');
        deleteButton.className = "delete-wo-btn btn";
        deleteButton.type = "button";
        deleteButton.textContent = "X"
        deleteButton.style.float = "right";

        let workoutDelete = document.createElement("td");
        workoutDelete.appendChild(deleteButton);
        workoutRow.appendChild(workoutDelete);
    }
    let allTrs = document.querySelectorAll('tbody tr');
    for(let f of completed)
    {
        let row = allTrs[f]
        let datas = row.querySelectorAll('td');
        for(let d = 0; d < datas.length; d++)
        {
            d.classList.add(" completed");
        }
    }
}


/**
 * Sets all_workouts to an empty array, clearing it
 * Gets saved data as an array of strings, each grouping of four correlating to a workout.
 * Depending on the type, these workouts are initialized accordingly to their respective classes.
 */
function getData() {
    // Organization of the string is space separated in these orders, depending on type.
    //  type name sets reps
    //  type name hours minutes

    // Sets all_workouts to an empty array, clearing it
    all_workouts = [];

    for(let i = 0; i < window.localStorage.length; i++)
    {
        let item = window.localStorage.getItem(`${i}`).split(' ');
        if(item[0] === "set/rep")
        {
            all_workouts.push(new SetRepExercise(item[1], item[0], parseInt(item[2]), parseInt(item[3])));
        }
        else
        {
            all_workouts.push(new TimerExercise(item[1], item[0], parseInt(item[2]), parseInt(item[3])));
        }
    }
}



/**
 * THIS METHOD MUST BE CHAINED, DO NOT TRY TO CHANGE THIS CHAINING
 *
 * Adds event listeners for changes in workout type;
 * Adds event listeners for all parameters available;
 * Hides the base page, displays the workout editing form
 * If the user is ADDING a workout, hides parameters until a type is selected
 * If the user is EDITING a workout, displays the given selections prefilled
 * If the user is EDITING a workout, initializes newEx as a type of workout accordingly
 * @param i
 */
function addOrEditWorkout(i) {
    // Changing the type listeners
    SET_REP_BUTTON.addEventListener('click', (e) => {
        e.preventDefault();

        if (i === -1) {
            newEx = new SetRepExercise("", "set/rep", 0, 0);
        } else {
            newEx = new SetRepExercise(all_workouts[i].name, all_workouts[i].type, 0, 0);
        }
        newEx.type = "set/rep"
        SET_REP_BUTTON.selected = "true";
        TIMER_BUTTON.selected = "false";
        TIMER_BUTTON.style.backgroundColor = "inherit";
        TIMER_BUTTON.style.opacity = "0.2";
        SET_REP_BUTTON.style.opacity = "1";

        displayChosenSelections(newEx);
    });

    TIMER_BUTTON.addEventListener('click', (e) => {
        e.preventDefault();

        if (i === -1) {
            newEx = new TimerExercise("", "timer", 0, 0);

        } else {
            newEx = new TimerExercise(all_workouts[i].name, all_workouts[i].type, 0, 0);
        }
        newEx.type = "timer"

        TIMER_BUTTON.selected = "true";
        SET_REP_BUTTON.selected = "false";
        SET_REP_BUTTON.style.backgroundColor = "inherit";
        SET_REP_BUTTON.style.opacity = "0.2";
        TIMER_BUTTON.style.opacity = "1";

        displayChosenSelections(newEx);
    });

    // Changing anything else listeners
    document.getElementById("set-rep-set-input")
        .addEventListener('change', () => {
            console.log(newEx)
            console.log(document.getElementById('set-rep-set-input').valueAsNumber);
            newEx.sets = document.getElementById('set-rep-set-input').valueAsNumber;
        });
    document.getElementById("set-rep-rep-input")
        .addEventListener('change', () => {
            newEx.reps = document.getElementById('set-rep-rep-input').valueAsNumber;
        });
    document.getElementById("timer-hour-input")
        .addEventListener('change', () => {
            newEx.hours = document.getElementById('timer-hour-input').valueAsNumber;
        });
    document.getElementById("timer-minute-input")
        .addEventListener('change', () => {
            newEx.minutes = document.getElementById('timer-minute-input').valueAsNumber;
        });
    document.getElementById("wo-name-input")
        .addEventListener('change', () => {
            newEx.name = document.getElementById('wo-name-input').value;
        });

    // Hide base page, display workout editing form
    BASE_PAGE.style.opacity = "0.5";
    START_WO_FORM.style.display = "none";
    WORKOUT_FORM.style.display = "inline-block";

    // Hide parameters until a type is selected if adding a workout
    let restOfForm = WORKOUT_FORM.getElementsByClassName("invisible-at-first");
    for (let x = 0; x < restOfForm.length && i === -1; x++) {
        restOfForm[x].style.display = "none";
    }

    // Show the given selections if editing the form.
    // Initialize the exercise being edited as a global variable to AVOID EXCESSIVE PASSING
    if (i !== -1) {
        displayChosenSelections(all_workouts[i]);
        if (all_workouts[i].type === 'timer') {
            newEx = new TimerExercise(all_workouts[i].name, "timer", all_workouts[i].hours, all_workouts[i].minutes);
        } else {
            newEx = new SetRepExercise(all_workouts[i].name, "set/rep", all_workouts[i].sets, all_workouts[i].reps);
        }
    }
}


/**
 * Shows the chosen parameters of the given workout chosen to edit
 * @param exercise
 */
function displayChosenSelections(exercise) {
    // Show chosen parameters of given type of workout chosen to edit
    for (let i = 0; i < ((document.getElementsByClassName("invisible-at-first")).length); i++) {
        document.getElementsByClassName("invisible-at-first")[i].style.display = "block"
    }
    document.getElementById("wo-name-input").value = exercise.name;
    if (exercise.type === "timer") {
        SET_REP_BUTTON.style.opacity = "0.2";
        displayTimerParams(exercise);
    } else {
        TIMER_BUTTON.style.opacity = "0.2"
        displaySetRepParams(exercise);
    }

}


/**
 * NEEDS TO BE CHAINED
 * Show the timer parameters, hide the set/rep parameters
 * @param exercise
 */
function displayTimerParams(exercise) {
    TIMER_PARAMS_FIELD.style.display = "inline-block";
    SET_REP_PARAMS_FIELD.style.display = "none";

    TIMER_PARAMS_FIELD.querySelector("#timer-hour-input").value = exercise.hours;
    TIMER_PARAMS_FIELD.querySelector("#timer-minute-input").value = exercise.minutes;
}


/**
 * NEEDS TO BE CHAINED
 * Show the set/rep parameters, hide the timer parameters
 * @param exercise
 */
function displaySetRepParams(exercise) {
    SET_REP_PARAMS_FIELD.style.display = "inline-block";
    TIMER_PARAMS_FIELD.style.display = "none";

    SET_REP_PARAMS_FIELD.querySelector("#set-rep-set-input").value = exercise.sets;
    SET_REP_PARAMS_FIELD.querySelector("#set-rep-rep-input").value = exercise.reps;
}


/**
 * General type selection styling
 * Gets the workout name, type, and respective parameters from the elements in the form...
 * ... and adds them to the newEx variable.
 */
function onWorkoutSubmit() {
    SET_REP_BUTTON.style.opacity = "1";
    TIMER_BUTTON.style.opacity = "1";

    newEx.name = document.getElementById("wo-name-input").value;

    if (newEx.type === "timer") {
        newEx.hours = document.getElementById("timer-hour-input").valueAsNumber;
        newEx.minutes = document.getElementById("timer-minute-input").valueAsNumber;
        //alert("Hours: " + newEx.hours);
        //alert("Minutes: " + newEx.minutes);
    } else {
        newEx.sets = document.getElementById("set-rep-set-input").valueAsNumber;
        newEx.reps = document.getElementById("set-rep-rep-input").valueAsNumber;
        //alert("Sets: " + newEx.sets);
        //alert("Reps: " + newEx.reps);

    }
}


/**
 * Saves the current state of newEx when appropriate to both memory and the global array
 * @param i
 */
function saveEdits(i) {
    // Shows the base page again, hides the workout add/edit form
    DISPLAY_BASE_FORM();

    // If adding a workout, append to the all_workouts array
    if (i === -1) {
        all_workouts.push(newEx);
        if(newEx.type === "timer")
        {
            window.localStorage.setItem(`${window.localStorage.length}`, `${newEx.type} ${newEx.name} ${newEx.hours} ${newEx.minutes}`);
        }
        else
        {
            window.localStorage.setItem(`${window.localStorage.length}`, `${newEx.type} ${newEx.name} ${newEx.sets} ${newEx.reps}`);
        }
    }

    // If editing a workout, redeclare the corresponding element with newEx's parameters
    else {
        if (newEx.type === "timer") {
            all_workouts[i] = new TimerExercise(newEx.name, newEx.type, newEx.hours, newEx.minutes);
            window.localStorage.setItem(`${i}`, `${newEx.type} ${newEx.name} ${newEx.hours} ${newEx.minutes}`)
        } else {
            all_workouts[i] = new SetRepExercise(newEx.name, newEx.type, newEx.sets, newEx.reps);
            window.localStorage.setItem(`${i}`, `${newEx.type} ${newEx.name} ${newEx.sets} ${newEx.reps}`)
        }
    }
}


/**
 * Erases the existing workouts in the base form.
 */
function eraseExistingWorkouts() {
    // Get all the workouts currently in the base form and erase them.
    let oldWorkoutDisplay = document.querySelectorAll("#base-tbl tbody tr");
    for (let j = 0; j < oldWorkoutDisplay.length; j++) {
        oldWorkoutDisplay[j].remove();
    }
}



/**
 * Hides the base page, displays the start workout form
 */
function openStartWorkoutForm() {
    BASE_PAGE.style.opacity = "0.5";
    WORKOUT_FORM.style.display = "none";
    START_WO_FORM.style.display = "inline-block";
    //
    WORKOUT_BARRIER_DIV.style.display = "inline-block";
    WORKOUT_STARTED_DIV.style.display = "none";

}


/**
 * Displays the workout's name and parameters upon start
 * @param i
 */
function displayParametersForStartedWorkout(i) {
    const workoutNameElement = document.querySelector("#start-wo-barrier h2");
    const confirmStartWorkoutNameElement = document.getElementById("confirmed-start-wo-name");
    const workoutParamElement = document.querySelectorAll("#start-wo-barrier h2")[1];
    const workoutTypeDiv = document.getElementById("start-wo-type-picture");
    // Set workout name display
    let name = all_workouts[i].name;
    workoutNameElement.textContent = `${name}`;
    confirmStartWorkoutNameElement.textContent = `${name}`;

    // Set workout parameter display
    let type = all_workouts[i].type;
    let sets, reps, hours, minutes;
    switch (type) {
        case "timer":
            hours = all_workouts[i].hours;
            minutes = all_workouts[i].minutes;
            workoutParamElement.textContent = `${hours>10?hours:"0"+hours}:${minutes > 10 ? minutes : "0" + minutes}:00:00`;

            workoutTypeDiv.children[1].style.visibility = "visible";
            workoutTypeDiv.children[1].src = "../images/timer.png";

            break;
        case "set/rep":
            sets = all_workouts[i].sets;
            reps = all_workouts[i].reps;
            workoutParamElement.textContent = `${sets} sets / ${reps} reps`;

            workoutTypeDiv.children[1].style.visibility = "visible";
            workoutTypeDiv.children[1].src = "../images/dumbbell.png";

            break;
        default:
            break;
    }

}


/**
 * Deletes a workout from local storage by assigning over its key.
 * @param i
 */
function deleteWorkout(i)
{
    let l = window.localStorage.length;
    for(i; i < l; i++)
    {
        if(i+1 !== l)
        {
            let moveElementIndex = i+1;
            window.localStorage.setItem(`${i}`, `${window.localStorage.getItem(`${moveElementIndex}`)}`);
        }
    }
    window.localStorage.removeItem(`${l-1}`);
}
let checker;

/**
 * Stops checking for completion of the workout.
 */
function deleteSets()
{
    clearInterval(checker);
}
/**
 * Starts checking for workout completion and other functionality
 */
function createSets(i)
{
    const setCrossOuts = document.querySelectorAll("ul li");
    for(let b = 0; b < setCrossOuts.length; b++)
    {
        setCrossOuts[b].remove();
    }
    let sets = all_workouts[i].sets;
    let counter = 0;
    for(let m = 0; m < sets; m++)
    {
        let el = document.createElement('li');
        el.textContent = `Set ${m+1}`
        el.className = "confirmed-start-set-rep-progress-elements-NC";
        document.querySelector('#confirmed-start-wo-set-rep ul').appendChild(el);
    }
    async function checkProgress(id) {
        if (counter === sets) {
            deleteSets();
            //START_WO_FORM.style.display = "none";
            completed.push(i);
            //DISPLAY_BASE_FORM();
            await exerciseComplete(i);
            clearInterval(checker);
        }
    }
    checker = setInterval(checkProgress, 1000);
    let setElements = document.querySelectorAll('#confirmed-start-wo-set-rep ul li');
    for(let n = 0; n < setElements.length; n++)
    {
        setElements[n].addEventListener('click', () =>
        {
            if(setElements[n].className === 'confirmed-start-set-rep-progress-elements-C')
            {
                setElements[n].className = 'confirmed-start-set-rep-progress-elements-NC';
                counter --;
            }
            else if(setElements[n].className === 'confirmed-start-set-rep-progress-elements-NC')
            {
                setElements[n].className = 'confirmed-start-set-rep-progress-elements-C';
                counter ++;
            }
        });
    }
}


/**
 * Timer functionality from start workout
 */
async function createCountdown(i, clickTime) {

    document.getElementById('pause-timer').style.opacity="1";
    document.getElementById("play-timer").style.opacity="1";

    let firstNow = Date.now();
    let pauseTime;
    let interval;
    let interval2;

    function pausingTimer()
    {

        clearInterval(interval);
        clickTime = Date.now();



    }
    function playingTimer()
    {
        interval = setInterval(timer, 1);
    }



    async function timer() {

        PAUSE_TIMER_BUTTON.addEventListener('click', pausingTimer);
        PLAY_TIMER_BUTTON.addEventListener('click', playingTimer);

        let ms = 1000 * (all_workouts[i].hours * 3600 + all_workouts[i].minutes * 60) - (Date.now() - clickTime);
        if (ms <= 10) {
            document.getElementById('pause-timer').style.opacity="0";
            clearInterval(interval);
            clearInterval(interval2);
            START_WO_FORM.style.opacity = "0";
            DISPLAY_BASE_FORM();
            document.querySelector("#timer-display").remove();
            completed.push(i);
            await exerciseComplete(i);
        }
        if(Date.now() - clickTime < 100)
        {
            ms = 1000 * (all_workouts[i].hours * 3600 + all_workouts[i].minutes * 60) - (firstNow - clickTime);
            pauseTime = Date.now();
        }

        else
        {
            ms = 1000 * (all_workouts[i].hours * 3600 + all_workouts[i].minutes * 60) - (Date.now() - pauseTime);
        }

        const setCrossOuts = document.querySelectorAll("ul li");
        for (let b = 0; b < setCrossOuts.length; b++) {
            setCrossOuts[b].remove();
        }


        let newElement = document.createElement("h2");
        newElement.id = "timer-display";
        document.getElementById("confirmed-start-wo-timer").appendChild(newElement);


        let seconds = Math.floor((ms / 1000) % 60);
        let minutes = Math.floor((ms / (1000 * 60)) % 60);
        let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        let milliseconds = Math.floor((ms - (1000 * seconds) - (60000 * minutes) - (3600000 * hours)) / 10);

        hours = `${(hours < 10 ? '0' : '')}${hours}`;
        minutes = `${(minutes < 10 ? '0' : '')}${minutes}`;
        seconds = `${(seconds < 10 ? '0' : '')}${seconds}`;
        milliseconds = `${(milliseconds < 10 ? '0' : '')}${milliseconds}`;

        document.getElementById("timer-display")
            .innerText = `${hours}:${minutes}:${seconds}:${milliseconds}`;

    }

    interval = setInterval(timer, 1);

}


/**
 * Show the user they have completed the workout
 */
async function exerciseComplete(i) {

    let row = document.querySelectorAll("#base-tbl tbody tr")[i];
    let column = row.querySelectorAll("td");
    DISPLAY_BASE_FORM();

    for (let v = 0; v < column.length; v++) {
        column[v].className = ("completed");
    }

    column[4].querySelector('button').textContent = "✔️";
    column[4].querySelector('button').setAttribute("disabled", true);
    document.getElementById("content-changing").textContent = "false";
    await new Promise(r => setTimeout(r, 3000));
    await cooldownTimer(Date.now());
}


/**
 * Auto displays following a workout completion
 * @param clickTime
 * @returns {Promise<void>}
 */
async function cooldownTimer(clickTime) {

    document.getElementById('cooldown-timer').style.opacity="1";

    let firstNow = Date.now();
    let tryingToPause;
    async function timer() {

        let ms = (60000) - (Date.now() - clickTime);
        if (ms <= 10) {
            document.getElementById('cooldown-timer').style.opacity = "0";
            DISPLAY_BASE_FORM();
            clearInterval(interval);

        }
        if(Date.now() - clickTime < 1000)
        {
            ms = 60000 - (firstNow - clickTime);
            tryingToPause = Date.now();
        }
        else
        {
            ms = 60000 - (Date.now() - tryingToPause);
        }
        let seconds = Math.floor((ms / 1000) % 60);
        let minutes = Math.floor((ms / (1000 * 60)) % 60);
        let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        let milliseconds = Math.floor((ms - (1000 * seconds) - (60000 * minutes) - (3600000 * hours)) / 10);

        hours = `${(hours < 10 ? '0' : '')}${hours}`;
        minutes = `${(minutes < 10 ? '0' : '')}${minutes}`;
        seconds = `${(seconds < 10 ? '0' : '')}${seconds}`;
        milliseconds = `${(milliseconds < 10 ? '0' : '')}${milliseconds}`;

        document.getElementById("cooldown-timer-text")
            .innerText = `${hours}:${minutes}:${seconds}:${milliseconds}`;
    }
    let interval = setInterval(timer, 1);
}