var fullpage = {
  container: [],
  options: {},
  init: function() {
    fullpage.container = $('#fullpage');

    if ($('body').attr('id') === 'le-concept') {
      if (fullpage.container.length) {
        fullpage.verticalView.init();
      }
    } else if ($('body').attr('id') === 'fabrication-francaise') {
      if (fullpage.container.length) {
        fullpage.verticalView.init();
        fullpage.handleVideo.init();
      }
    } else if ($('body').attr('id') === 'contactez-nous') {
      if (fullpage.container.length) {
        fullpage.verticalView.init();
        fullpage.contactView.init();
      }
    } else if ($('body.template-product').length) {
      fullpage.productView.init($('#product-form-container'));
    } else if ($('body.template-article').length) {
      fullpage.blogView.init();
    } else {
      if (fullpage.container.length) {
        fullpage.container.fullpage(fullpage.options);
      }
    }
  },
  verticalView: {
    navigation: [],
    progressBar: [],
    init: function() {
      fullpage.options = {
        navigation: true,
        afterLoad: this.handleAfterLoad,
        onLeave: this.handleOnLeave,
        afterRender: this.handleRender,
        easing: 'easeInOutExpo',
        scrollingSpeed: 1200,
        responsiveHeight: 700,
        responsiveWidth: 900
      };
      if ($('.ms-left, .ms-right').length) {
        fullpage.container.multiscroll({
          navigation: true,
          afterLoad: this.handleAfterLoad,
          onLeave: this.handleOnLeave,
          afterRender: this.handleRender,
          easing: 'easeInOutExpo',
          scrollingSpeed: 1200,
          responsiveHeight: 700,
          responsiveWidth: 900,
          responsiveExpand: true,
          responsiveExpandKey: 'cXVpbnR1cy1ob3J0dXMubXlzaG9waWZ5LmNvbV83OW5jbVZ6Y0c5dWMybDJaVVY0Y0dGdVpBPT1NM08=',
        });
      } else {
        fullpage.container.fullpage(fullpage.options);
      }
    },
    eventHandlers: function() {
      $(window).on('resize', function() {
        fullpage.verticalView.updateProgressBar($('.section.active').index());
      });
      $('a.nextSection').click(function() {
        if ($.fn.multiscroll) {
          $.fn.multiscroll.moveSectionDown();
        } else {
          $.fn.fullpage.moveSectionDown();
        }
      });
      $('a.topSection').click(function() {
        $.fn.multiscroll.moveTo(1);
      });
    },
    handleRender: function() {
      var context = fullpage.verticalView;
      $('#fullpage').addClass('fullpage-wrapper');
      if ($('.ms-left, .ms-right').length) {
        $('#MainContent').prepend('<div class="progressbar"></div>');
      }
      context.progressBar = $('.progressbar');
      context.navigation = $('#fp-nav,  #multiscroll-nav');
      context.updateNav(1);
      context.eventHandlers();
    },
    handleOnLeave: function(anchorLink, index) {
      var context = fullpage.verticalView;
      if (context.progressBar.length && context.navigation.length) {
        context.updateNav(index);
      }
    },
    handleAfterLoad: function(anchorLink, index) {},
    updateNav: function(activeIndex) {
      this.updateProgressBar(activeIndex);
      this.updateActiveNav(activeIndex);
      this.updateNavColor(activeIndex);
    },
    updateProgressBar: function(activeIndex) {
      // var indexZero = activeIndex - 1;
      // var currentDot = fullpage.verticalView.navigation.find(
      //   'ul li:eq(' + indexZero + ')'
      // )[0];
      // var topDistance;
      // if (currentDot) {
      //   debugger;
      //   topDistance = currentDot.getBoundingClientRect().top + 5;
      //   fullpage.verticalView.progressBar.height(topDistance);
      // }
    },
    updateNavColor: function(activeIndex) {
      var indexZero = activeIndex - 1;
      var bgcolor = $('.section:eq(' + indexZero + ')').css('background-color');
      var color = $('.section:eq(' + indexZero + ')').css('color');
      var activeDotColor;

      if (bgcolor === 'rgb(254, 216, 86)') {
        activeDotColor = color;
      } else {
        activeDotColor = bgcolor;
      }

      if ($.fn.multiscroll) {
        fullpage.verticalView.navigation
          .find('li a.activeStyle, li a.active')
          .css('background-color', '#fff')
          .css('color', activeDotColor);
      }

      setTimeout(function() {
        fullpage.verticalView.navigation
          .find('li a:not(.activeStyle)')
          .css('background-color', bgcolor)
          .css('color', color);
      }, 500);
    },
    updateActiveNav: function(activeIndex) {
      fullpage.verticalView.navigation.find('li a').each(function(index) {
        var indexZero = activeIndex - 1;
        if (index > indexZero) {
          $(this).removeClass('activeStyle');
        } else {
          $(this).addClass('activeStyle');
        }
      });
    },
  },
  handleVideo: {
    videoEl: [],
    init: function() {
      $('body').append(
        '<div id="video-container"><div id="close"><i class="fa fa-times fa-3x"></i></div></div>'
      );
      $('#video-container').append(
        '<video playsinline="" preload="metadata">' +
          '<source type="video/mp4" src="https://player.vimeo.com/external/220257455.hd.mp4?s=4d8accd0776756f6737af75957fc832d4fc21e06&profile_id=169">' +
          '</video>'
      );
      fullpage.handleVideo.videoEl = $('#video-container video')[0];
      fullpage.handleVideo.videoEl.addEventListener('ended', function() {
        fullpage.handleVideo.close();
      });
      $('#close').click(fullpage.handleVideo.close);
      $('.videoTrigger').click(this.handleClick);
    },
    handleClick: function() {
      fullpage.handleVideo.open();
    },
    animateIn: function(doneCallback) {
      var dur = 1000, ease = 'easeOutExpo';
      $('#multiscroll-nav').animate({opacity: 0}, 500, ease);
      $('.progressbar').animate({opacity: 0}, 500, ease, function() {
        $('.ms-left').animate({left: '-50%'}, dur, ease);
        $('.ms-right').animate({right: '-50%'}, dur, ease, function() {
          $('#video-container').css('z-index', '0');
          if (typeof doneCallback === 'function') {
            doneCallback();
          }
        });
      });
    },
    animateOut: function(doneCallback) {
      var dur = 1000, ease = 'easeOutExpo';
      $('#video-container').css('z-index', '-1');
      $('.ms-left').animate({left: '0'}, dur, ease);
      $('.ms-right').animate({right: '1px'}, dur, ease, function() {
        $('#multiscroll-nav').animate({opacity: 1}, 500, ease);
        $('.progressbar').animate({opacity: 1}, 500, ease, function() {
          if (typeof doneCallback === 'function') {
            doneCallback();
          }
        });
      });
    },
    open: function() {
      $.fn.multiscroll.destroy();
      fullpage.handleVideo.videoEl.currentTime = 0;
      fullpage.handleVideo.animateIn(function() {
        fullpage.handleVideo.videoEl.play();
      });
    },
    close: function() {
      fullpage.handleVideo.videoEl.pause();
      fullpage.handleVideo.animateOut(function() {
        $.fn.multiscroll.build();
      });
    },
  },
  productView: {
    options: null,
    $productContainer: [],
    currentProductHandle: null,
    selectOptions: null,
    selectedSize: null,
    init(productContainer) {
      var self = fullpage.productView;

      window.MoneyFormat = $('.MoneyFormat')[0].value;

      self.$productContainer = $(productContainer);
      self.currentProductHandle = self.$productContainer.data('initHandle');

      self.refresh();

      // set sidebar products ajax
      // self.$productContainer.find('[ref="product-select"]').click(function(e) {
      //   e.preventDefault();
      //   var target = $(this), productURl = this.href;
      //
      //   self.loadProduct(productURl);
      // });

      fullpage.options = {
        afterLoad: function(anchorLink, index) {
          // console.log('afterLoad');

          setTimeout(function() {
            self.animations.toggleTitle();
            setTimeout(function() {
              self.animations.toggleOptions();
            }, 100);
          }, 50);
        },
        onLeave: function(index, nextIndex, direction) {
          // console.log('onLeave');
        },
        onSlideLeave: function(
          anchorLink,
          index,
          slideIndex,
          direction,
          nextSlideIndex
        ) {
          self.animations.transitionIcon(slideIndex, nextSlideIndex);
          self.animations.toggleTitle();
          self.animations.toggleOptions();
          // console.log('onSlideLeave');
        },
        afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex) {
          var thisSlide = $('.slide')[slideIndex],
            productUrl = $(thisSlide).data('producturl');

          // console.log('afterSlideLoad: ', productUrl);
          self.currentProductHandle = $(thisSlide).data('handle');
          self.loadProduct(productUrl, function() {
            self.refresh();

            setTimeout(function() {
              self.animations.toggleTitle();
              self.animations.toggleOptions();
            }, 50);
          });
        },
      };
      if (fullpage.container.length) {
        fullpage.container.fullpage(fullpage.options);
      }
    },
    refresh: function() {
      var self = this;
      self.getSelectOptions();
      self.addEventListeners();
      self.updatePrice();
      self.updateSelectedSize();
      self.$productContainer.find('.range input').trigger('input');
    },
    addEventListeners: function() {
      var self = fullpage.productView,
        $rangeInput = self.$productContainer.find('.range input');

      // sync the quanitities
      self.$productContainer.find('#Quantity').on('change', function() {
        self.$productContainer
          .find('#AddToCart')
          .attr('data-cart-quantity', $(this).val());
      });
      self.$productContainer;

      // Update the price and position of range, amount and price label
      $rangeInput.on('input', self.handleRangeInput.bind(self));

      // on range movement settles, change the quantity
      $rangeInput.on('change', function(e) {
        var newVal = e.target.value / e.target.step;
        var qtyInput = document.getElementById('Quantity');
        qtyInput.value = newVal;
        self.$productContainer
          .find('[data-cart-quantity]')
          .attr('data-cart-quantity', newVal);

        // self.test(qtyInput.value, newVal);
      });

      // selector changes
      self.$productContainer.find('.product-size button').click(function(e) {
        var $this = $(e.target);
        var id = $this.attr('data-id');

        self.selectOptions.selectVariant(id);
        self.selectedSize = $this.attr('title');

        self.$productContainer
          .find('.product-size button')
          .removeClass('selected');

        $this.addClass('selected');

        self.updatePrice();
        self.updateSelectedSize();

        $rangeInput.val($rangeInput.attr('min')).trigger('input');
      });
      // submit the form
      self.$productContainer.find('#submitButton').click(function(e) {
        e.preventDefault();
        self.$productContainer.find('#AddToCart').trigger('click');
        self.$productContainer.find('#AddToCartForm').submit();
      });
      // move to left and right slide
      self.$productContainer.find('.fp-prev').click(function(e) {
        $.fn.fullpage.moveSlideLeft();
      });
      self.$productContainer.find('.fp-next').click(function(e) {
        $.fn.fullpage.moveSlideRight();
      });
    },
    handleRangeInput: function(e) {
      var self = this;
      var qty = e.target.value,
        baseprice = self.$productContainer
          .find('#ProductPrice')
          .attr('content'),
        price = (qty / e.target.step * baseprice).toFixed(2),
        // pricePerItem = Math.ceil(price / (qty / 10)),
        pricePerItem = 3,
        size = self.selectedSize,
        max = e.target.max,
        min = e.target.min,
        pct = (qty - min) / (max - min) * 100,
        sockAmt = self.calculateSocks(qty, size),
        offset,
        pctAdjusted;

      pct = pct < 0 ? 0 : pct;
      offset = 0.04 * pct;
      pctAdjusted = pct - offset;

      // console.log('percent', pct, 'offset: ', offset);
      // console.log('price', price, 'qty: ', qty);

      self.$productContainer
        .find('#price-tooltip span#price')
        .html(price.toString().replace('.', ','));
      self.$productContainer
        .find('#price-tooltip span#pricePerItem')
        .html(pricePerItem);
      self.$productContainer.find('#amount-tooltip span#grams').html(qty + 'g');
      self.$productContainer.find('#amount-tooltip span#count').html(sockAmt);

      self.$productContainer
        .find('#price-tooltip, #amount-tooltip')
        .css('left', pctAdjusted + '%');
      self.$productContainer
        .find('#bar')
        .css('width', 'calc(' + pctAdjusted + '% + 12px)');
    },
    calculateSocks(grams, size) {
      if (size == 'Small' || size == 'Medium' || size == 'Large') {
        var weight = {
          Small: 13.85,
          Medium: 16.85,
          Large: 21.45,
        };
        var result = Math.round(grams / weight[size]);

        return result;
      } else {
        return false;
      }
    },
    loadProduct: function(productUrl, callback) {
      var urlSelector = productUrl + ' #product-form-container > *';

      $('#product-form-container').load(urlSelector, function(data) {
        // console.log('reroute success');
        window.history.pushState({url: '' + productUrl + ''}, null, productUrl);
        callback();
      });
    },
    getSelectOptions: function() {
      var ProductJSON, self = this;
      $.get('/products/' + self.currentProductHandle + '.json', function(
        productJSON
      ) {
        self.selectOptions = new Shopify.OptionSelectors('productSelect', {
          product: productJSON.product,
          onVariantSelected: self.selectCallback,
          enableHistoryState: true,
        });
      });
    },
    selectCallback: function(variant, selector) {
      // console.log('Switching variant: ', variant);
      concrete.switchVariant(
        {
          moneyFormat: window.MoneyFormat,
          variant: variant,
        },
        self.$productContainer
      );
    },
    updatePrice: function() {
      var self = this;
      var price = self.$productContainer.find('#ProductPrice').attr('content');
      price = Number(price).toFixed(2);
      self.$productContainer.find('#price-tooltip span').html(price);
    },
    updateSelectedSize: function() {
      var self = this, selectedId = $('#productSelect').val();
      self.selectedSize = $('button[data-id="' + selectedId + '"]').data(
        'title'
      );
    },
    test: function(val1, val2) {
      val2 = val2.toString();
      if (val1 !== val2) {
        alert('Test fail');
        // debugger;
      } else {
        // console.log('Test: ', val1, val2);
      }
    },
    animations: {
      toggleTitle: function() {
        $('.product-title').toggleClass('hide-title');
      },
      toggleOptions: function() {
        $('.product-size').toggleClass('hide-options');
      },
      transitionIcon(slideIndex, nextSlideIndex) {
        var $iconEl = $('.icon-ss');
        currentClass = $($('.slide')[slideIndex]).data('handle');
        nextClass = $($('.slide')[nextSlideIndex]).data('handle');
        $iconEl.removeClass(currentClass).addClass(nextClass);
      },
    },
  },
  blogView: {
    init: function() {
      var self = fullpage.blogView;
      $('body').scrollTop(0);

      $(window).scroll(function() {
        var active = false;
        if (window.pageYOffset > 10 && !active) {
          $('header > .bg').addClass('active');
          active = true;
        } else {
          $('header > .bg').removeClass('active');
          active = false;
        }
      });
    },
  },
  contactView: {
    init: function() {
      $(document).on('keypress', function(e) {
        var key = e.which || e.keyCode,
            currentSectionInput
        if (key === 13 || key === 9) {
          // 13 is enter
          e.preventDefault();
          currentSectionInput = $('.slide.active input')[0]
          if (fullpage.contactView.validateInput(currentSectionInput)) {
            $.fn.fullpage.moveSectionDown();
          }
        }
      });
    },
    validateInput: function(el) {
      if (!el) {
        return false;
      }
      if (el.value !== '' && el.required) {
        $(el).validate()
        return true;
      } else {
        return false;
      }
    },
  },
};

$(document).ready(function() {
  fullpage.init();
});
