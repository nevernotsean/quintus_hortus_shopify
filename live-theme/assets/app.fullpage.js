var fullpage = {
  container: [],
  options: {},
  init: function() {
    fullpage.container = $("#fullpage");

    if ( $('body').attr('id') === 'le-concept' ) {
      fullpage.options = {
        afterLoad: function (anchorLink, index) {
          // console.log('afterLoad')
        },
        onLeave: function (index, nextIndex, direction) {
          // console.log('onLeave')
        },
        onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){
          console.log('onSlideLeave',anchorLink, index, slideIndex, direction, nextSlideIndex);
        },
        afterSlideLoad: function( anchorLink, index, slideAnchor, slideIndex ){
          console.log('afterSlideLoad',anchorLink, index, slideAnchor, slideIndex)

        }
      }
    }

    fullpage.container.fullpage(fullpage.options);
  }
};

fullpage.init();
