import * as m from "./modules.mjs";
import {all_workouts} from "./modules.mjs";
export {DISPLAY_BASE_FORM, forceReload, setDynamicListeners};

const WORKOUT_FORM = document.getElementById("wo-form");
const START_WO_FORM = document.getElementById("start-wo");
const BASE_PAGE = document.getElementById("base-form");

const EDIT_WORKOUT_BUTTON = document.getElementsByClassName("edit-wo-btn")[0]; // TODO all these buttons need to react the same but fill in depending on where they are clicked
const NEW_WORKOUT_BUTTON = document.getElementById("new-wo-btn");
const DELETE_WORKOUT_BUTTONS = document.getElementsByClassName("delete-wo-btn");
const CONFIRM_START_BUTTON = document.getElementById("start-wo-btn");
const INTERRUPT_WO_BUTTON = document.getElementById("stop-started-wo");
const CLOSE_START_WO = document.getElementById("close-pop-up");
const CLOSE_EDITS_BUTTON = document.getElementById("cancel-edits-or-add");

const DISPLAY_BASE_FORM = () =>
{
    WORKOUT_FORM.style.display = "none";
    START_WO_FORM.style.display = "none";
    BASE_PAGE.style.display = "block";
    BASE_PAGE.style.opacity = "1";
}

let x;

window.localStorage.setItem("0", "timer Running 1 12");
window.localStorage.setItem("1", "set/rep Dips 4 10");

document.addEventListener("DOMContentLoaded", () => {
    m.getData();
    m.displayAllWorkouts();
    DISPLAY_BASE_FORM();
    setDynamicListeners();

    NEW_WORKOUT_BUTTON.addEventListener('click', () => {
        x = -1;
        m.addOrEditWorkout(-1);
        forceReload();
    });

    WORKOUT_FORM.addEventListener('submit', (e) => {
        e.preventDefault();
        m.onWorkoutSubmit();
        m.saveEdits(x);
        forceReload();
    });

    CLOSE_EDITS_BUTTON.addEventListener('click', (e) =>
    {
        e.preventDefault();
        DISPLAY_BASE_FORM();
        forceReload();
    });

    INTERRUPT_WO_BUTTON.addEventListener('click', () =>
    {
        if(all_workouts[x].type === "timer")
        {
            let highestTimeoutId = setTimeout(";");
            for (let i = 0 ; i < highestTimeoutId ; i++) {
                clearTimeout(i);
            }
            document.querySelector("#timer-display").remove();
        }
        else
        {
            m.deleteSets();
        }
        DISPLAY_BASE_FORM();
        forceReload();
    });
});

/**
 * Resets the list of exercises to stay current
 */
function forceReload()
{
    m.eraseExistingWorkouts();
    m.getData();
    m.displayAllWorkouts();
    setDynamicListeners();
}



/**
 * Adds listeners for every dynamic element in the form upon force reload or change
 * ---
 * called_by: forceReload
 */
function setDynamicListeners()
{
    EDIT_WORKOUT_BUTTON.addEventListener('click', () => {
        m.addOrEditWorkout(x);
        m.eraseExistingWorkouts();
        m.getData();
        m.displayAllWorkouts();
        setDynamicListeners();

    });

    for (let i = 0; i < DELETE_WORKOUT_BUTTONS.length; i++) {
        DELETE_WORKOUT_BUTTONS[i].addEventListener('click', () => {
            // x saves the index of the workout for reference when editing.
            x = i;
            m.deleteWorkout(x);
            m.eraseExistingWorkouts();
            m.getData();
            m.displayAllWorkouts();
            setDynamicListeners();
        });
    }


    let tableRows = document.querySelectorAll("#base-tbl tbody tr");

    for (let i = 0; i < tableRows.length; i++)
    {
        let tableDataPerRow = tableRows[i].querySelectorAll('td');
        for(let j = 0; j < (tableDataPerRow.length-1); j++)
        {
            tableDataPerRow[j].addEventListener('click', () => {
                x = i;

                m.openStartWorkoutForm();
                m.displayParametersForStartedWorkout(x);
                document.getElementById("workout-officially-started").style.display = "none";

            });
        }
    }

    CONFIRM_START_BUTTON.addEventListener('click', async (e) => {

        document.getElementById("start-wo-barrier").style.display = "none";
        document.getElementById("workout-officially-started").style.display = "inline-block";
        if (m.all_workouts[x].type === "timer") {
            let clickTime = Date.now();
            await m.createCountdown(x, clickTime);
        } else {
            m.createSets(x);
        }
    });

    CLOSE_START_WO.addEventListener('click', (e) =>
    {
        e.preventDefault();
        DISPLAY_BASE_FORM();
    });
}


