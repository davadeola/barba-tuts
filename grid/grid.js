document.addEventListener("DOMContentLoaded", function(){
  //check while the document is loading to the below
  var lastClickedElement;//declare a variable called lastClickedElement
  Barba.Pjax.init();//Start Barba
  Barba.Prefetch.init();//Initialize Barba.Prefetch

Barba.Dispatcher.on('linkClicked', function(el){
  //Creates an event that checks for the specific link clicked
  lastClickedElement=el; // sets lastClickedElement to that link;
})

var ExpandTransition=Barba.BaseTransition.extend({
  start: function(){
    this.originalThumb = lastClickedElement;

    Promise
    .all([this.newContainerLoading, this.enlargeThumb()])
    .then(this.showPage.bind(this));
    //waits till the new container has loaded and the new element has beeb enlarged
    //afterwards the newPage is shown
  },

  //define the enlarge function
  enlargeThumb: function(){
    var deferred = Barba.Utils.deferred(); //Creates a new promise that will ensure is below anything else is done
    var thumbPosition= this.originalThumb.getBoundingClientRect(); //gets size and position of the old container relative to the viewport

    this.cloneThumb = this.originalThumb.cloneNode(true);//clones the lastClickedElement and its children
    this.cloneThumb.style.position='absolute';
    this.cloneThumb.style.top=thumbPosition.top + 'px';

    this.oldContainer.appendChild(this.cloneThumb);//appends this lastClickedElement to the body

    //Now we animate it to the full size
    TweenLite.to(this.cloneThumb, 0.3, {
      top: 0,
      height: window.innerHeight,
      onComplete: function(){
        deferred.resolve();
      }//once the animation is complete resolve the deferred
    });
     return deferred.promise;
  },

  showPage: function(){
    this.newContainer.style.visibility = 'visible';
    this.done(); //After enlargeThumb is done set the new container visibility to zero
  }

})



Barba.Pjax.getTransition = function(){
  return ExpandTransition;
}
});
