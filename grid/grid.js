document.addEventListener("DOMContentLoaded", function(){
  //check while the document is loading to the below
  var lastClickedElement;//declare a variable called lastClickedElement
  Barba.Pjax.init();//Start Barba
  Barba.Prefetch.init();//Initialize Barba.Prefetch
});

Barba.Dispatcher.on('linkClicked', function(el){
  //Creates an event that checks for the specific link clicked
  lastClickedElement=el; // sets lastClickedElement to that link;

})
