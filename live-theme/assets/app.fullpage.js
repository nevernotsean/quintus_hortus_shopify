var fullpage = {
  container: [],
  options: {},
  init: function() {
    fullpage.container = $("#fullpage");

    if ($('body').attr('id') === 'le-concept') {
      fullpage.options = {
        afterLoad: function(anchorLink, index) {
          // console.log('afterLoad')
        },
        onLeave: function(index, nextIndex, direction) {
          // console.log('onLeave')
        },
        onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex) {
          console.log('onSlideLeave', anchorLink, index, slideIndex, direction, nextSlideIndex);
        },
        afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex) {
          console.log('afterSlideLoad', anchorLink, index, slideAnchor, slideIndex)

        }
      }
    }
    if ( fullpage.container.length ){
      fullpage.container.fullpage(fullpage.options);
    }

    if ( $('body.template-product').length ){
      fullpage.options = {
        afterLoad: function(anchorLink, index) {
          // console.log('afterLoad')
        },
        onLeave: function(index, nextIndex, direction) {
          // console.log('onLeave')
        },
        onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex) {
          console.log('onSlideLeave', anchorLink, index, slideIndex, direction, nextSlideIndex);
        },
        afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex) {
          console.log('afterSlideLoad', anchorLink, index, slideAnchor, slideIndex)
        }
      }
      $('.product-slide').each( function () {
        fullpage.productView.init( $(this) )
      })
    }

    if ( $('body.template-article') ){
      fullpage.blogView.init();
    }
  },
  blogView: {
    init: function(){
      var self = fullpage.blogView
      $('body').scrollTop(0)

      $(window).scroll(function(){
        var active = false
        if (window.pageYOffset > 10 && !active){
          $('header > .bg').addClass('active')
          active = true
        } else {
          $('header > .bg').removeClass('active')
          active = false
        }
      })
    }
  },
  productView: {
    options: null,
    $productContainer: [],
    init(productContainer){

      var self = fullpage.productView, productHandle

      self.$productContainer = $(productContainer)

      productHandle = self.$productContainer.data('handle')

      window.MoneyFormat = $('.MoneyFormat')[0].value

      options = new Shopify.OptionSelectors('productSelect', {
        product: window.ProductJSON[productHandle],
        onVariantSelected: self.selectCallback,
        enableHistoryState: true
      });

      self.addEventListeners()
    },
    addEventListeners: function() {
      var self = fullpage.productView,
          $rangeInput = self.$productContainer.find('.range input')

      // sync the quanitities
      self.$productContainer.find("#Quantity").on("change", function() {
        self.$productContainer.find("#AddToCart").attr("data-cart-quantity", $(this).val());
      });self.$productContainer

      // Update the price and position of range, amount and price label
      $rangeInput.on('input', function(e) {
        var qty = e.target.value,
            baseprice = self.$productContainer.find('#ProductPrice').attr('content'),
            price = (qty / e.target.step * baseprice).toFixed(2)

        self.$productContainer.find("#price-tooltip span").html(price)
        self.$productContainer.find('#amount-tooltip span').html(qty + "g")

        var max = e.target.max,
            min = e.target.min,
            pct = (qty / max * 100) - 5;

            pct = pct < 0 ? 0 : pct


            self.$productContainer.find("#price-tooltip, #amount-tooltip").css("left", pct + "%")
            self.$productContainer.find('#bar').css("width", "calc(" + pct + "% + 12px)")
      });

      // on range movement settles, change the quantity
      $rangeInput.on('change', function(e) {
        var newVal = e.target.value / e.target.step
        var qtyInput = document.getElementById('Quantity')
        qtyInput.value = newVal
        self.$productContainer.find("[data-cart-quantity]").attr('data-cart-quantity', newVal)

        self.test(qtyInput.value, newVal);
      });

      // selector changes
      self.$productContainer.find('.product-size button').click(function(e) {
        var $this = $(e.target)
        var id = $this.attr('data-id')
        options.selectVariant(id)
        self.$productContainer.find('.product-size button').removeClass('selected')
        $this.addClass('selected')
        $rangeInput.val($rangeInput.attr("min")).trigger('input');
        self.updatePrice()
      })
      // submit the form
      self.$productContainer.find('#submitButton').click(function(e) {
        e.preventDefault()
        self.$productContainer.find('#AddToCart').trigger('click');
        self.$productContainer.find('#AddToCartForm').submit();
      })

      // products ajax
      // self.$productContainer.find('[ref="product-select"]').click(function(e) {
        // e.preventDefault()
        // var target = $(this),
            // productURl = this.href

        // self.loadProduct(productURl)
      // })
    },
    // loadProduct: function(productUrl) {
    //   $('#product-container').load( productUrl + ' #product-container *', function(data){
    //     console.log(data)
    //   })
    // },
    selectCallback: function(variant, selector) {

      console.log("Switching variant: ", variant);

      concrete.switchVariant({
        moneyFormat: window.MoneyFormat,
        variant: variant,
      }, self.$productContainer)
    },
    updatePrice: function() {
      var price = self.$productContainer.find('#ProductPrice').attr('content')
      price = Number(price).toFixed(2)
      self.$productContainer.find('#price-tooltip span').html(price)
    },
    test: function(val1, val2){
      val2 = val2.toString()
      if (val1 !== val2){
        debugger
      } else {
        console.log('Test: ', val1, val2)
      }
    }
  }
};

$(document).ready(function () {
  fullpage.init();
})
