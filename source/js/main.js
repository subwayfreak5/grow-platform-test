console.log('Demo JS confirmed!');

startPercentageAnimations(); //call this function when section appears in window

function startPercentageAnimations(){
    var animationDuration = 1000, //one second
        increments = animationDuration * 60/1000, //assume 60 frames per second
      percentageAnimations = document.querySelectorAll(".data-num-svg"),
        percentageElementObjects = [];

    for (var i=0; i<percentageAnimations.length; i++){
        var percentageElement = percentageAnimations[i];
        //set stroke-dashoffset to zero (548)
        percentageElement.querySelector("circle.svg-stroke").setAttribute("stroke-dashoffset", 548);
        //populate percentageElementObjects array with data objects
        percentageElementObjects.push(getPercentageAnimationObject(percentageElement, animationDuration, increments));
    }
    //start animating
    handlePercentageAnimation(percentageElementObjects, animationDuration/increments);
}


function getPercentageAnimationObject(percentageElement, animationDuration, increments){
    //returns an object containing data; this object will be usable outside this function scope
    var targetPercentage = parseFloat(percentageElement.querySelector(".svg-data-item span").textContent, 10),
        targetStroke = 548 - targetPercentage/100 * 548;
    return {
      svgCircle: percentageElement.querySelector("circle.svg-stroke"),
        targetPercentage: targetPercentage,
        targetStroke: targetStroke,
        increment: (548 - targetStroke)/increments,
        animationComplete: false
    };
}


function handlePercentageAnimation(percentageElementObjects, timing){
    //percentageElementObjects is an array of data objects
    var interval = setInterval(function(){
            for (var i=0; i<percentageElementObjects.length; i++){
                var result = animatePercentage(percentageElementObjects[i]); //result will be true or false, capturing the return value of the animatePercentage() function
                percentageElementObjects[i].animationComplete = result;
            }
          if (percentageElementObjects.filter(function(obj){
              return !obj.animationComplete;
            }).length === 0){
                clearInterval(interval);
            }
        }, timing);
}


function animatePercentage(percentageDataObject){
    var dashoffset = parseFloat(percentageDataObject.svgCircle.getAttribute("stroke-dashoffset"), 10) - percentageDataObject.increment;
    if (dashoffset <= percentageDataObject.targetStroke){
        percentageDataObject.svgCircle.setAttribute("stroke-dashoffset", percentageDataObject.targetStroke);
        return true;
    } else {
       percentageDataObject.svgCircle.setAttribute("stroke-dashoffset", dashoffset);
        return false;
    }
}
