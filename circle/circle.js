document.addEventListener("DOMContentLoaded", function() {
  if (!('webkitClipPath' in document.body.style)) {
    alert('Sorry webkitClipPath is not supported. Switch to Chrome/Safari');
  } //checks if the browser supports webkitClipPath

  Barba.Pjax.init(); //starts the barba event as well as the Barba.Prefetch event
  Barba.Prefetch.init();

  var isAnimating = false;

  document.addEventListener('mouseover', function(e) {
    tweenMaskTo(e.target, 100);
  });

  document.addEventListener('mouseout', function(e) {
    tweenMaskTo(e.target, 40);
  })

  var tweenMaskTo = function(el, radius) {
    if (isAnimating || !el.classList.contains('nav'))
      return;

    //if isAnimating or the element does not have a class with nav ignore the code below

    var xCoord = el.classList.contains('next')
      ? '97'
      : '3';
    //if the element has a class of nex the x-coordinate will be 97 else 3
    TweenLite.to(el, 0.3, {
      webkitClipPath: 'circle(' + radius + 'px at ' + xCoord + '% 50%)'
    });
    //uses TweenLite to change the size of the cirle(link)
  };

  var CoverMaskTransition = Barba.BaseTransition.extend({
    start: function() {
      isAnimating = true;

      Promise.all([this.newContainerLoading, this.scrollTop()]).then(this.display.bind(this));
      //Wait till the newContainer has finished loading and the new page has scrolled to the top then show it.
    },

    scrollTop: function() {
      var deferred = Barba.Utils.deferred(); // forces all the code to be executed before progress
      var obj = {
        y: window.pageYOffset
      } //gets the scroll distance

      TweenLite.to(obj, 0.4, {
        y: 0,
        onUpdate: function() {
          if (obj.y === 0) {
            deferred.resolve();
          }
          window.scroll(0, obj.y) //window.scroll(xcoord, y-coord);
        },
        onComplete: function() {
          deferred.resolve();
        }
      });
      return deferred.promise;
    },

    getNewPageFile: function() {
      return Barba.HistoryManager.currentStatus().url.split('/').pop();
    }, //gets the current page

    getLinkByHref: function(href) {
      return document.querySelector('a[href="' + href + '"]');
    },

    display: function() {
      var _this = this;
      //created a timeline with TimeLineMax
      var tl = new TimelineMax({
        onComplete: function() {
          _this.newContainer.style.position = 'static';
          _this.done();
          isAnimating = false;
        }
      });
      var wWidth = window.innerWidth;
      var oldText = this.oldContainer.querySelector('.text');
      var newText = this.newContainer.querySelector('.text');
      var newLinkPrev = this.newContainer.querySelector('.nav.prev');
      var newLinkNext = this.newContainer.querySelector('.nav.next');

      var linkElement = this.getLinkByHref(this.getNewPageFile());
      var xCoord = linkElement.classList.contains('next') ? '97' : '3';

      TweenLite.set(linkElement, {zIndex: 100});
      TweenLite.set(this.newContainer, {
        position: 'fixed',
        visibility: 'visible',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0,
        zIndex: 200
      });

      TweenLite.set(newText, {opacity: 0});
      TweenLite.set(newLinkPrev, {webkitClipPath: 'cicle(0px at 3% 50%)'});

      TweenLite.set(newLinkNext, {webkitClipPath: 'circle(0px at 97% 50% )'});

      tl.add('start');
      tl.to(oldText, 0.3, {opacity: 0}, 'start');
      tl.to(linkElement, 1, { webkitClipPath: 'circle(' + wWidth + 'px at ' + xCoord + '% 50%)'}, 'start');
      tl.to(this.newContainer, 0.3, {opacity: 1});
      tl.to(newText, 0.3, {opacity: 1});

      tl.add('nextLinks');
      tl.to(newLinkPrev, 0.2, {webkitClipPath: 'cirlce(40px at 3% 50%)'
      }, 'nextLinks');
      tl.to(newLinkNext, 0.2, {webkitClipPath: 'cirlce(40px at 97% 50%)'
      }, 'nextLinks');
    }
  });

  Barba.Pjax.getTransition = function() {
    return CoverMaskTransition;
  }
})
