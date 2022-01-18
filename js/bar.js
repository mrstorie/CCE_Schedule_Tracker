function move(){
    var bar = document.getElementById("bar");
    updateBar(bar, 0);
}

// Progress is a decimal between 0 and 1
function updateBar(bar, progress) {
    if(progress > 1){
        return;
    }

    bar.style.width = (progress * 100) + "%"; 
    setTimeout(updateBar, 50, bar, progress + 0.01);
}
