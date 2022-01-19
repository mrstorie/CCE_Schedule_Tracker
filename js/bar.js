class ProgressBar {
    constructor(startTime, goalTime, barId){
        this.startTime = startTime;
        this.goalTime = goalTime;
        this.bar = document.getElementById(barId);
    }

    setStartTime(startTime){
        this.startTime = startTime;
    }

    startMoving(){
        const fps = 1000 / 30;
        this.interval = setInterval(ProgressBar.updateBar, fps, this);
    }

    endOfInterval(){
        clearInterval(this.interval);
    }

    // Convert the dates into miliseconds, then get a percentage completion
    static updateBar(bar) {
        var start = bar.startTime.getTime();
        var end = bar.goalTime.getTime();
        var length = end - start;
        var elapsed = Date.now() - start;

        bar.bar.style.width = (elapsed/length * 100) + "%"; 

        if(elapsed/length >= 1){
            bar.endOfInterval();
        }
    }
}

// Show the bar moving over a one minute period
function testBar(){
    const oneMinute = 1000 * 60;
    var bar = new ProgressBar(new Date(), new Date(Date.now() + oneMinute), "bar");
    bar.startMoving();
}
