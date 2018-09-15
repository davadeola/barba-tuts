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

});


var ShrinkTransition = Barba.BaseTransition.extend({
  start: function(){
    this.newContainerLoading.then(this.shrinkImage.bind(this));
  },

  shrinkImage: function(){
    var _this=this;

    this.oldContainer.style.zIndex = '10';
    this.newContainer.style.visibility = 'visible';

    var href = Barba.HistoryManager.prevStatus().url.split('/').pop(); //returns the last page visited
    var destThumb = this.newContainer.querySelector('a[href="'+href+'"]'); //returns the a element with the link defined above
    var destThumbPosition= destThumb.getBoundingClientRect();//gets the size and position of the thumb;
    var fullImage= this.oldContainer.querySelector('.full');//returns the div with the class full and its children

    TweenLite.to(this.oldContainer.querySelector('.back'), 0.2, {opacity:0});//changes the opacity of the link in the old container to zero

    TweenLite.to(fullImage, 0.3,{
      top:destThumbPosition.top,
      height:destThumbPosition.clientHeight,
      onComplete: function(){
        _this.done();
      }
    });
  }
})

Barba.Pjax.getTransition = function(){
  return ExpandTransition;
}
});
