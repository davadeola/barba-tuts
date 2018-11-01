document.addEventListener("DOMContentLoaded", function(){
  if (!('webkitClipPath' in document.body.style)) {
    alert('Sorry webkitClipPath is not supported. Switch to Chrome/Safari');
  }//checks if the browser supports webkitClipPath

Barba.Pjax.init();//starts the barba event as well as the Barba.Prefetch event
Barba.Prefetch.init();

var isAnimating= false;

document.addEventListener('mouseover', function(e){
  tweenMaskTo(e.target,100);
});

document.addEventListener('mouseout', function(e){
  tweenMaskTo(e.target, 40);
})

var tweenMaskTo = function(el, radius){
  if(isAnimating || !el.classList.contains('nav'))
    return;
//if isAnimating or the element does not have a class with nav ignore the code below

  var xCoord = el.classList.contains('next')? '97':'3';
  //if the element has a class of nex the x-coordinate will be 97 else 3
  TweenLite.to(el, 0.3, {webkitClipPath: 'circle('+radius+'px at '+xCoord+'% 50%)'});
  //uses TweenLite to change the size of the cirle(link)
};



})
