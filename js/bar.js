class ProgressBar {
    constructor(bar, statusText, schedule){
        this.bar = bar;
        this.timeLeftStatus = statusText;
        this.schedule = schedule;
    }

    getSchedule(){
        return this.schedule;
    }

    setSchedule(schedule){
        this.schedule = schedule;
    }

    startMoving(){
        const fps = 1000 / 30;
        this.interval = setInterval(ProgressBar.updateBar, fps, this);
    }

    endOfInterval(){
        clearInterval(this.interval);
        this.schedule.nextPeriod();
        this.startMoving();
    }

    // Fill in the text with the time left
    static updateTimeLeft(bar, millisLeft){
        if(bar.timeLeftStatus == null){
            return;
        }
        bar.timeLeftStatus.innerHTML = "";

        // Extra 1000 make it not go into -1 seconds
        var secondsLeft = Math.floor((millisLeft + 1000) / 1000);
        var minutesLeft = Math.floor(secondsLeft / 60);
        var hoursLeft = Math.floor(minutesLeft/60);

        // Only seconds left, no need to print the others
        if(secondsLeft < 60){
            bar.timeLeftStatus.innerHTML = secondsLeft + " second";
            if(secondsLeft != 1){
                bar.timeLeftStatus.innerHTML += "s"
            }

            return;
        }

        // Hour
        if(minutesLeft > 59){
            bar.timeLeftStatus.innerHTML = hoursLeft + " hour";
            if(hoursLeft != 1){
                bar.timeLeftStatus.innerHTML += "s";
            }
            minutesLeft = minutesLeft - hoursLeft * 60;
        }

        // Always place minutes regardless of hour, unless 0
        if(minutesLeft > 0){
            bar.timeLeftStatus.innerHTML += " " + minutesLeft + " minute";
            if(minutesLeft != 1){
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

        ProgressBar.updateTimeLeft(bar, end - Date.now());
        bar.bar.style.width = (elapsed/length * 100) + "%"; 

        if(elapsed/length >= 1){
            bar.bar.style.width = "100%"; 
            bar.endOfInterval();
        }
    }
}

// csv: startTime;Name;endTime,<next entry> (24-hour time)
// ex: 7:34;Period 1;8:28
class Schedule {
    constructor(str){
        this.periods = str.split(",");
        this.pIndex = 0;
        this.updateTimes();
    }

    updateTimes(){
        var parts = this.periods[this.pIndex].split(";");
        var start = parts[0].split(":");
        var end = parts[2].split(":");

        var now = new Date();
        this.startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), start[0], start[1]);
        this.endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), end[0], end[1]);
    }

    getCurrentStart(){
        return this.startTime;
    }

    getCurrentEnd(){
        return this.endTime;
    }

    getCurrentName(){
        return this.name;
    }

    nextPeriod(){
        this.pIndex++;
        this.updateTimes();
    }
}

// Show the bar moving over a one minute period
function testBar(){
    const oneMinute = 1000 * 60;

    //var schedule = new Schedule(new Date(), new Date(Date.now() + oneMinute));
    var schedule = new Schedule("13:35;Period 6;13:39,13:39;Period 7;15:00");
    var progress = document.getElementsByClassName("progress_container");
    var bar = new ProgressBar(progress[0].firstElementChild, progress[0].lastElementChild, schedule);
    bar.startMoving();
}

function changeDate(){
    let todayDate = new Date().toDateString('en-BG');

    document.getElementById('date').textContent = todayDate;
}

document.addEventListener("DOMContentLoaded", changeDate);