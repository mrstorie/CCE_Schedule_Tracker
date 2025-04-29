var cancelProgress = "norm";
let persistentBack = localStorage.getItem("persistentBack");
if (!persistentBack) {
    localStorage.setItem("persistentBack", "false");
}

class ProgressBar {
    constructor(bar, statusText, container, title, schedule) {
        this.bar = bar;
        this.container = container;
        this.timeLeftStatus = statusText;
        this.title = title;
        this.schedule = schedule;
    }

    getSchedule() {
        return this.schedule;
    }

    setSchedule(schedule) {
        this.schedule = schedule;
    }

    startMoving() {
        const fps = 1000 / 30;
        this.interval = setInterval(ProgressBar.updateBar, fps, this);
    }

    endOfInterval() {
        document.getElementById("end").style.display = "block";
        this.container.style.display = "none";
        this.title.style.display = "none";
        clearInterval(this.interval);
        this.schedule.nextPeriod();
        this.startMoving();
    }

    // Fill in the text with the time left
    static updateTimeLeft(bar, millisLeft) {
        if (bar.timeLeftStatus == null) {
            return;
        }
        bar.timeLeftStatus.innerHTML = "";

        // Extra 1000 make it not go into -1 seconds
        var secondsLeft = Math.floor((millisLeft + 1000) / 1000);
        var minutesLeft = Math.floor(secondsLeft / 60);
        var hoursLeft = Math.floor(minutesLeft / 60);

        // Only seconds left, no need to print the others
        if (secondsLeft < 60) {
            bar.timeLeftStatus.innerHTML = secondsLeft + " second";
            if (secondsLeft != 1) {
                bar.timeLeftStatus.innerHTML += "s";
            }

            return;
        }

        // Hour
        if (minutesLeft > 59) {
            bar.timeLeftStatus.innerHTML = hoursLeft + " hour";
            if (hoursLeft != 1) {
                bar.timeLeftStatus.innerHTML += "s";
            }
            minutesLeft = minutesLeft - hoursLeft * 60;
        }

        // Always place minutes regardless of hour, unless 0
        if (minutesLeft > 0) {
            bar.timeLeftStatus.innerHTML += " " + minutesLeft + " minute";
            if (minutesLeft != 1) {
                bar.timeLeftStatus.innerHTML += "s";
            }
        }
    }

    // Convert the dates into miliseconds, then get a percentage completion
    static updateBar(bar) {
        var start = bar.schedule.getCurrentStart().getTime();
        var end = bar.schedule.getCurrentEnd().getTime();
        var length = end - start;
        var elapsed = Date.now() - start;
        var endFullTime = bar.schedule.getFullEnd().getTime();

        //Ending Add
        if (Date.now() >= endFullTime) {
            document.getElementById("end").style.display = "block";
            console.log("end of interval");
            console.log(endFullTime);
            console.log(Date.now());
        }

        // Nothing to do right now: make blank
        if (Date.now() < start) {
            bar.container.style.display = "none";
            bar.title.style.display = "none";
            return;
        }
        bar.container.style.display = "block";
        bar.title.style.display = "block";
        document.getElementById("end").style.display = "none";

        bar.title.innerHTML = bar.schedule.getCurrentName();

        if (cancelProgress == "norm") {
            ProgressBar.updateTimeLeft(bar, end - Date.now());
        }

        bar.bar.style.width = (elapsed / length) * 100 + "%";

        if (elapsed / length >= 1) {
            bar.bar.style.width = "100%";
            bar.endOfInterval();
        }
    }
}

// csv: startTime;Name;endTime,<next entry> (24-hour time)
// ex: 7:34;Period 1;8:28
class Schedule {
    constructor(str) {
        this.periods = str.split(",");
        this.pIndex = 0;
        this.updateTimes();
    }

    updateTimes() {
        var parts = this.periods[this.pIndex].split(";");
        var start = parts[0].split(":");
        var end = parts[2].split(":");
        var endPart = this.periods[this.periods.length - 1].split(";");
        var endTimePart = endPart[2].split(":");

        this.name = parts[1];

        var now = new Date();
        this.startTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            start[0],
            start[1],
        );
        this.endTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            end[0],
            end[1],
        );
        this.endTimeFull = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            endTimePart[0],
            endTimePart[1],
        );
    }

    getCurrentStart() {
        return this.startTime;
    }

    getCurrentEnd() {
        return this.endTime;
    }

    getCurrentName() {
        return this.name;
    }

    getFullEnd() {
        return this.endTimeFull;
    }

    nextPeriod() {
        this.pIndex++;
        this.updateTimes();
    }
}

// Show the bar moving over a one minute period
function startBar(schedule) {
    const oneMinute = 1000 * 60;

    var progress = document.getElementsByClassName("progress_container");
    var titles = document.getElementsByClassName("period");
    var topBar = new ProgressBar(
        progress[0].firstElementChild,
        progress[0].lastElementChild,
        progress[0],
        titles[0],
        schedule[0],
    );
    topBar.startMoving();
    var bottomBar = new ProgressBar(
        progress[1].firstElementChild,
        progress[1].lastElementChild,
        progress[1],
        titles[1],
        schedule[1],
    );
    bottomBar.startMoving();
}

function changeDate() {
    let todayDate = new Date().toLocaleDateString("en-BG", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    document.getElementById("date").textContent = todayDate;
}

window.addEventListener("DOMContentLoaded", changeDate);
setInterval(changeDate, 60000);

function dateSchedule() {
    var now = new Date();
    var weekDay = now.getDay();
    var schedule = [null, null];

    switch (weekDay) {
        case 1: //Monday
           schedule[0] = new Schedule(
               "7:00;Good Morning!;8:30,8:30;Teacher Office Hours;8:45,8:45;Period 1;9:19,9:19;Passing Period;9:24,9:24;Period 2;10:58,10:58;A Lunch;11:32,11:32;Passing Period;11:37,11:37;Period 3;13:11,13:11;Passing Period;13:16,13:16;Period 4;14:50",
           );
           break;


       case 2: //Tuesday
            schedule[0] = new Schedule(
                "7:00;Good Morning!;6th Grade;8:45,8:45;5th Grade;9:30,9:30;4th Grade;10:20,10:20;3rd Grade;11:05,11:05;Lunch;11:50,11:50;Plan;12:30,12:30;Kindie;13:15,13:15;1st Grade;14:00,14:00;2nd Grade;15:25",
            );
            schedule[1] = new Schedule(
               "10:56;Passing Period;11:01,11:01;Period 6;12:35,12:35;B Lunch;13:11",
           );
            break;

       // case 2://Tuesday (delayed)
        //	schedule[0] = new Schedule("7:00;Good Morning!;9:00,9:00;Eagle Time;9:30,9:30;Passing Period;9:35,9:35;Period 5;11:05,11:05;A Lunch;11:40,11:40;Passing Period;11:45,11:45;Period 6;13:15,13:15;Passing Period;13:20,13:20;Period 7;14:50");
      //  	schedule[1] = new Schedule("11:05;Passing Period;11:10,11:10;Period 6;12:40,12:40;B Lunch;13:15");
    //   break;

       case 3: //Wednesday
            schedule[0] = new Schedule(
               "7:00;Good Morning!;7:30,7:30;Teacher Office Hours;7:45,7:45;Period 1;9:19,9:19;Passing Period;9:24,9:24;Period 2;10:58,10:58;A Lunch;11:32,11:32;Passing Period;11:37,11:37;Period 3;13:11,13:11;Passing Period;13:16,13:16;Period 4;14:50",
            );
            schedule[1] = new Schedule(
               "10:58;Passing Period;11:03,11:03;Period 3;12:37,12:37;B Lunch;13:11",
           );
           break;

//         case 3://Wednesday (delayed)
   //     	schedule[0] = new Schedule("9:00;Good Morning!;9:15,9:15;Period 1;10:25,10:25;Passing Period;10:30,10:30;Period 2;11:40,11:40;A Lunch;12:20,12:20;Passing Period;12:25,12:25;Period 3;13:35,13:35;Passing Period;13:40,13:40;1st grade;14:50");
 //       	schedule[1] = new Schedule("11:40;Passing Period;11:45,11:45;Period 3;12:55,12:55;B Lunch;13:35");
  //      	break;

        case 4: //Thursday
            schedule[0] = new Schedule(
                "7:00;Good Morning!;7:30,7:30;Teacher PLC;8:05,8:05;Period 5;9:39,9:39;Homeroom;9:49,9:49;Eagle Time;10:56,10:56;A Lunch;11:32,11:32;Passing Period;11:37,11:37;Period 6;13:11,13:11;Passing Period;13:16,13:16;Kindie;14:50",
            );
            schedule[1] = new Schedule(
                "10:56;Passing Period;11:01,11:01;Period 6;12:35,12:35;B Lunch;13:11",
            );
            	// (DELAY) schedule[0] = new Schedule("7:00;Good Morning!;9:00,9:00;Eagle Time;9:30,9:30;Passing Period;9:35,9:35;Period 5;11:05,11:05;A Lunch;11:40,11:40;Passing Period;11:45,11:45;Period 6;13:15,13:15;Passing Period;13:20,13:20;Period 7;14:50");
             	// (DELAY) schedule[1] = new Schedule("11:05;Passing Period;11:10,11:10;Period 6;12:40,12:40;B Lunch;13:15");
            break;

        case 5: //Friday
         
            schedule[0] = new Schedule(
              "7:00;Happy Friday!;7:30,7:30;Teacher Office Hours;7:45,7:45;Period 1;8:36,8:36;Passing Period;8:41,8:41;Period 2;9:32,9:32;Passing Period;9:37,9:37;Period 3;10:28,10:28;Passing Period;10:33,10:33;Period 4;11:24,11:24;A Lunch;12:02,12:02;Passing Period;12:07,12:07;Period 5;12:58,12:58;Passing Period;13:03,13:03;Period 6;13:54, 13:54;Passing Period;13:59,13:59;Period 7;14:50",
    
            );
          schedule[1] = new Schedule(
                "11:24;Passing Period;11:29,11:29;Period 5;12:20,12:20;B Lunch;12:58",
            );

          
            break;

                        
    }

    startBar(schedule);
}

function getSchedules() {
    var request = new XMLHttpRequest();
    var now = new Date();
    var weekDay = now.getDay();

    //Grab latest schedule
    const hostname = window.location.hostname;
    request.open("GET", "api/schedules.json");
    request.send();

    request.onload = function () {
        if (request.status === 404) {
            dateSchedule();
            return;
        }

        var obj = JSON.parse(request.responseText);
        var index = -1;

        //Special day
        var dateStr =
            now.getMonth() + 1 + "/" + now.getDate() + "/" + now.getFullYear();
        for (var i = 0; i < obj.schedules.length; i++) {
            if (obj.schedules[i].date == dateStr) {
                index = i;
                break;
            }
        }

        if (index == -1) {
            dateSchedule();
            return;
        }

        var schedule = [];
        schedule[0] = new Schedule(obj.schedules[index].times[0]);
        schedule[1] = new Schedule(obj.schedules[index].times[1]);
        startBar(schedule);
    };

    //Fallback schedules
    request.onerror = function () {
        dateSchedule();
    };
}

function reloadPage(hour) {
    const hours24 = 1000 * 60 * 60 * 24;
    var date = new Date(Date.now() + hours24);
    date.setHours(hour);
    time = date.getTime() - Date.now();

    setTimeout(function () {
        location.reload();
    }, time);
}

window.addEventListener("DOMContentLoaded", getSchedules);
setInterval(getSchedules, 1000 * 60 * 60 * 24);
reloadPage(6);
reloadPage(7);
reloadPage(14);

const devLink =
    "https://script.google.com/macros/s/AKfycbwXkuEQVGKb4jCzP_fyWszaHTQ5cu3GQ1t_t8oOnZxthUvOA46gDeL7i5JqO2zKQ1dOFA/exec";
const alphabet = "abcdefghijkmnoprstuvwxyz";
const randomLetters = alphabet
    .split("")
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
    .join("");

let idSetStatus = localStorage.getItem("idSetStatus");
if (!idSetStatus) {
    localStorage.setItem("idSetStatus", "false");
}

let ignoreState = localStorage.getItem("ignoreState");
if (!ignoreState) {
    localStorage.setItem("ignoreState", "false");
}

let deviceId = localStorage.getItem("deviceId");
if (!deviceId) {
    deviceId = randomLetters;
    localStorage.setItem("deviceId", deviceId);
}

document.addEventListener("DOMContentLoaded", function() {
    let persistentBack = localStorage.getItem("persistentBack");
    if (persistentBack) {
        document.body.style.background = persistentBack;
    }
});

function testSystem(req) {
    if (req == deviceId) {
        document.body.style.background = "green";
    } else {
        document.body.style.background = "red";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("qrcode")) {
        document.getElementById("qrcode").addEventListener("click", () => {
            window.open("https://austinkden.github.io/ww25", "_blank");
        })
    }
})

// padding: top/bottom 16, left/right 28
