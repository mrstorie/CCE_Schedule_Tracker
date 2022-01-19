class ProgressBar {
    constructor(startTime, goalTime, barId, statusId){
        this.startTime = startTime;
        this.goalTime = goalTime;
        this.bar = document.getElementById(barId);
        this.timeLeftStatus = document.getElementById(statusId);
    }

    setStartTime(startTime){
        this.startTime = startTime;
    }

    setEndTime(endTime){
        this.endTime = endTime;
    }

    startMoving(){
        const fps = 1000 / 30;
        this.interval = setInterval(ProgressBar.updateBar, fps, this);
    }

    endOfInterval(){
        clearInterval(this.interval);
    }

    static updateTimeLeft(bar, millisLeft){
        if(bar.timeLeftStatus == null){
            return;
        }

        var secondsLeft = Math.floor(millisLeft / 1000);
        if(secondsLeft < 60){
            bar.timeLeftStatus.innerHTML = secondsLeft + " seconds";
            return;
        }

        // Less than an hour
        var minutesLeft = Math.floor(secondsLeft / 60);
        if(minutesLeft < 60){
            bar.timeLeftStatus.innerHTML = minutesLeft + " minutes";
            return;
        }

        var hoursLeft = Math.floor(minutesLeft/60);
        var leftOverMinutes = minutesLeft - hoursLeft * 60;
        bar.timeLeftStatus.innerHTML = hoursLeft + " hours and " + leftOverMinutes + " minutes";
    }

    // Convert the dates into miliseconds, then get a percentage completion
    static updateBar(bar) {
        var start = bar.startTime.getTime();
        var end = bar.goalTime.getTime();
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

// Show the bar moving over a one minute period
function testBar(){
    const oneMinute = 1000 * 60;
    var bar = new ProgressBar(new Date(), new Date(Date.now() + oneMinute * 2), "bar", "time_left_status");
    bar.startMoving();
}
