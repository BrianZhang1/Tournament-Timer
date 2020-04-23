(function() { // Enclosing everything so that if this is used as code for another program, then global variables wont affect other code.

initialize();

function initialize() {
// Initializing variables needed for the timer

FULL_DASH_ARRAY = 283;
WARNING_THRESHOLD = 20;
ALERT_THRESHOLD = 5;

// Colours for the timer (depending on time)
COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};
TIME_LIMIT = 300;
timePassed = 0;
timeLeft = TIME_LIMIT;
timerInterval = null;
remainingPathColor = COLOR_CODES.info.color;
setCircle();


// Initializing variables
loop = false;
goToNextStep = false;
goToPreviousStep = false;
stage = "Present Proposal";
sound = false;
document.getElementById('beepSound').volume = 0.5;
brightnessMode = false; // False for dark mode and true for light
// All the click listeners are initialized here
document.getElementById("brightnessIcon").addEventListener("click", toggleBrightness);
document.getElementById("brightnessIconBackground").addEventListener("click", toggleBrightness);
document.getElementById("soundIconBackground").addEventListener("click", toggleSound);
document.getElementById("soundIcon").addEventListener("click", toggleSound);
document.getElementById("customTimeInputButton").addEventListener("click", setCustomTime);
document.getElementById("showInputBox").addEventListener("click", showInputBox);
document.getElementById("stagePrevious").addEventListener("click", previousStep);
document.getElementById("stageNext").addEventListener("click", nextStep);
document.getElementById("togglePause").addEventListener("click", startTimer);
document.getElementById("resetSelect").addEventListener("click", function() {reset("Select")});
document.getElementById("resetTimer").addEventListener("click", function() {reset("Timer")});
document.getElementById("resetStage").addEventListener("click", function() {reset("Stage")});
document.getElementById("resetBack").addEventListener("click", function() {reset("Back")});
reset("Reset");
}

// Starts timer (duh)
function startTimer() {
    // Changes start button to pause button
    document.getElementById("togglePause").className = "pauseButton";
    document.getElementById("togglePause").removeEventListener("click", startTimer)
    document.getElementById("togglePause").addEventListener("click", pause)

    // Sets interval and function for timer
    timerInterval = setInterval(calculateTime, 1000);

    // loop variable represents whether the interval is going or not
    loop = true;
}

// Calculates time
function calculateTime() {
    console.log(timeLeft);
    timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    var rawMinutesLeft = Math.floor(timeLeft / 60);
    var minutesLeft = Math.abs(rawMinutesLeft)
    var rawSecondsLeft = timeLeft % 60;
    var secondsLeft = Math.abs(rawSecondsLeft)
    if (minutesLeft == 0 && secondsLeft == 0) {
        overtimeState = true;
    }
    if (secondsLeft < 10) {
        zeroSeconds = "0";
    }
    else if (secondsLeft > 9) {
        zeroSeconds = "";
    }
    if (minutesLeft < 10) {
        zeroMinutes = "0";
    }
    else if (minutesLeft > 9) {
        zeroMinutes = "";
    }
    if (!overtimeState) {setCircleDasharray();}
    setRemainingPathColour(timeLeft);
    if (minutesLeft == 0 && secondsLeft == 0) {
        setCircleDasharrayOvertime();
    }
    // Checks if in overtime, and acts differently depending on the state if overtime
    if (overtimeState) {
        if (timeLeft == -1) {
            document.getElementById("overtimeId").style.visibility = "visible";
            overtimeVisible = true;
            if (sound) {
                document.getElementById('beepSound').play();
            }

        }
        // Flashes the over time text to be annoying
        if (overtimeVisible && !(timeLeft == -1)) {
            document.getElementById("overtimeId").style.visibility = "hidden";
            overtimeVisible = false;
        }
        else if (!overtimeVisible) {
            document.getElementById("overtimeId").style.visibility = "visible";
            overtimeVisible = true;
        }
        setRemainingPathColour(timeLeft);
    }
    // Changes display values
    showTime();
}

// Display the time
function showTime() {
    if (!overtimeState) {var minutesLeft = Math.abs(Math.floor(timeLeft/60));}
    if (overtimeState) {var minutesLeft = Math.abs(Math.ceil(timeLeft/60));}
    var secondsLeft = Math.abs(timeLeft % 60);
    var timeShown = zeroMinutes + minutesLeft + ":" + zeroSeconds + secondsLeft;
    document.getElementById("base-timer-label").innerHTML = timeShown;
}

// Pauses timer
function pause() {
    stopTimer();
    // Changes the button to Start
    document.getElementById("togglePause").className = "startButton";
    document.getElementById("togglePause").removeEventListener("click", pause)
    document.getElementById("togglePause").addEventListener("click", startTimer)
    if (overtimeState) {
        document.getElementById("overtimeId").style.visibility = "visible";
        overtimeVisible = true;
    }

}

// General Reset Functions
function reset(mode) {
    switch (mode) {

        // If it is clicked for the first time, goes into select mode and gives options
        case "Select":
            document.getElementById("resetSelect").style.visibility = "hidden";
            document.getElementById("resetTimer").style.visibility = "visible";
            document.getElementById("resetStage").style.visibility = "visible";
            document.getElementById("resetBack").style.visibility = "visible";

            break;

        // If you select reset Timer, resets everything within the timer
        case "Timer":
            stage = "Present Proposal";
            stopTimer();
            reset("Reset");

            document.getElementById("resetSelect").style.visibility = "visible";
            document.getElementById("resetTimer").style.visibility = "hidden";
            document.getElementById("resetStage").style.visibility = "hidden";
            document.getElementById("resetBack").style.visibility = "hidden";

            break;

        // If you select Stage, resets everything within the stage
        case "Stage":
            stopTimer();
            reset("Reset");

            document.getElementById("resetSelect").style.visibility = "visible";
            document.getElementById("resetTimer").style.visibility = "hidden";
            document.getElementById("resetStage").style.visibility = "hidden";
            document.getElementById("resetBack").style.visibility = "hidden";

            break;

        // If you press the red button, it goes back without resetting anything
        case "Back":
            document.getElementById("resetSelect").style.visibility = "visible";
            document.getElementById("resetTimer").style.visibility = "hidden";   
            document.getElementById("resetStage").style.visibility = "hidden";
            document.getElementById("resetBack").style.visibility = "hidden";

            break;

        // Resets everything
        case "Reset":
            setCircle();
            timePassed = 0;
            timerInterval = null;
            remainingPathColor = COLOR_CODES.info.color;
            overtimeState = false;
            overtimeVisible = false;
            customTime = 0;

            // Initializing times
            rawMinutes = 0;
            rawSeconds = 0;

            // zeroSeconds and zeroMinutes represent the 0 when the seconds are below two digit, so it shows 6:09 instead of 6:9
            zeroSeconds = "0";
            zeroMinutes = "0";

            // Setting the initial time according to the stage
            switch (stage) {
                case "Present Proposal":
                    TIME_LIMIT = (5*60);
                    break;
                case "Q&A":
                    TIME_LIMIT = (8*60);
                    break;
                case "Conclusion":
                    TIME_LIMIT = (2*60);
                    break;
                case "Judge Questions":
                    TIME_LIMIT = (10*60);
                    zeroMinutes = "";
                    break;
                case 'Custom':
                    if (Math.floor(TIME_LIMIT/60) > 9) {
                        zeroMinutes = '';
                    }
                    if (TIME_LIMIT % 60 > 9) {
                        zeroSeconds = '';
                    }
                    break;
                default:
                    break;
            }

            // Changes time left and displays time
            timeLeft = TIME_LIMIT;
            showTime();

            // Rewrites a ton of front-end display code (text and images)
            document.getElementById("togglePause").className = "startButton";
            document.getElementById("togglePause").removeEventListener("click", pause)
            document.getElementById("togglePause").addEventListener("click", startTimer)
            document.getElementById("overtimeId").style.visibility = "hidden";
            document.getElementById("stageText").innerHTML = stage;
            setCircleDasharray();
            setRemainingPathColour(timeLeft);
            break;

        default:
            break;
            
    }
}

// Goes to next stage depending on current stage
function nextStep() {
    switch (stage) {
        case "Present Proposal":
            stage = "Q&A";
            break;
        case "Q&A":
            stage = "Conclusion";
            break;
        case "Conclusion":
            stage = "Judge Questions";
            break;
        case "Judge Questions":
            break;
        case 'Custom':
            stage = oldStage;
            break;
        default:
            break;
    }
    stopTimer();
    reset("Reset");
}

// Goes to previous stage depending on the current stage
function previousStep() {
    switch (stage) {
        case "Present Proposal":
            break;
        case "Q&A":
            stage = "Present Proposal";
            break;
        case "Conclusion":
            stage = "Q&A";
            break;
        case "Judge Questions":
            stage = "Conclusion";
            break;
        case 'Custom':
            stage = oldStage;
            break;
        default:
            stage = "default"
            break;
    }
    stopTimer();
    reset("Reset");
}

// Stops timer
function stopTimer() {
    if (loop) {
      clearInterval(timerInterval);
      loop = false;
    }
  }
  
// Sets the circle colour according to the time left
function setRemainingPathColour(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (!overtimeState) {
        if (timeLeft <= alert.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
        } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
        }
    } 
    else if (overtimeState) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add("grey");
    }
}

// Calculates the remaining time as a fraction
function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

// Sets the outer circle dasharray in the timer
function setCircleDasharray() {
    const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;

    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
}

// Sets the outer circle dasharray in the timer in overtime
function setCircleDasharrayOvertime() {
    const circleDasharray = '0 283';
    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
}

// Makes changes to the soundIcon (top right) on click
function toggleSound() {
    var soundIcon = document.getElementById('soundIcon');
    if (!sound) {
        soundIcon.src = 'photos/soundIcon.png';
        soundIcon.title = 'Creates a beep when the timer finishes - On';
        sound = true;
    }
    else if (sound) {
        soundIcon.src = 'photos/muteIcon.png';
        soundIcon.title = 'Creates a beep when the timer finishes - Off';
        sound = false;
    }
}

// Makes the Custom Time input box appear if it's hidden and vice versa - toggles the visibility
function showInputBox() {
    var inputBox = document.getElementById('customTimeInput');
    var inputButton = document.getElementById('customTimeInputButton');
    var inputText = document.getElementById('customTimeInputText');
    var inputVisibility = window.getComputedStyle(document.getElementById('customTimeInput')).visibility;
    if (inputVisibility == 'visible') {
        inputBox.style.visibility = 'hidden';
        inputButton.style.visibility = 'hidden';
        inputText.style.visibility = 'hidden';
    }
    else if (inputVisibility == 'hidden') {
        inputBox.style.visibility = 'visible';
        inputButton.style.visibility = 'visible';
        inputText.style.visibility = 'visible';
        inputBox.focus();
    }
}


// Sets a Custom Time
function setCustomTime() {
    stopTimer();
    var rawInput = document.getElementById('customTimeInput').value;
    var inputValue = Math.round(rawInput.replace(/\s/g, ''));
    document.getElementById('customTimeInput').style.visibility = 'hidden';
    document.getElementById('customTimeInputButton').style.visibility = 'hidden';
    if (stage != 'Custom') {
        oldStage = stage;
    }
    stage = 'Custom';
    if (inputValue != '') {
        TIME_LIMIT = inputValue;
    }
    else if (inputValue == '') {
        return;
    }
    document.getElementById('customTimeInput').value = '';
    reset("Reset");
    
}

// Toggles light and dark mode
function toggleBrightness() {
    if (brightnessMode == false) {
        // Changing a ton of colours
        document.body.style.backgroundColor = "lightGrey";
        document.getElementById('title').style.color = 'black';
        document.getElementById('tag').style.color = 'black';
        document.getElementById('base-timer-label').style.color = 'black';
        document.getElementById('brightnessIcon').src = 'photos/lightBulbOn.png';
        document.getElementById('brightnessIcon').title = "Changes the screen to dark mode";

        brightnessMode = true;
    }
    else if (brightnessMode == true) {
        // Changing a ton of colours
        document.body.style.backgroundColor = "black";
        document.getElementById('title').style.color = 'white';
        document.getElementById('tag').style.color = 'white';
        document.getElementById('base-timer-label').style.color = 'white';
        document.getElementById('brightnessIcon').src = 'photos/lightBulbOff.png';
        document.getElementById('brightnessIcon').title = "Changes the screen to light mode";
        

        brightnessMode = false;
    }
}

// Resets the colours and attributes of the circle timer
function setCircle() {
    document.getElementById("app").innerHTML = `
    <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
            "
        ></path>
        </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">${"5:00"}</span>
    </div>
    `;
}

}())