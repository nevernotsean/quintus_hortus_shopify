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
      fullpage.productView.init()
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
    init(){

      var self = fullpage.productView

      options = new Shopify.OptionSelectors('productSelect', {
        product: window.ProductJSON,
        onVariantSelected: self.selectCallback,
        enableHistoryState: true
      });

      self.updatePrice()
      self.addEventListeners()
    },
    addEventListeners: function() {
      var self = fullpage.productView,
          $rangeInput = $('.range input')

      // sync the quanitities
      $("#Quantity").on("change", function() {
        $("#AddToCart").attr("data-cart-quantity", $(this).val());
      });

      // Change input value on label click
      $('.range-labels li').on('click', function() {
        var qty = $(this).attr('data-quantity');

        $rangeInput.val(qty).trigger('input');
      });

      // Update the price and position of range and price label
      $rangeInput.on('input', function(e) {
        var qty = e.target.value,
          baseprice = $('#ProductPrice').attr('content'),
          price = (qty / e.target.step * baseprice).toFixed(2)

        $("#price-tooltip span").html(price)

        var max = e.target.max,
            min = e.target.min,
            pct = (qty / max * 100) - 5;

            pct = pct < 0 ? 0 : pct


            $("#price-tooltip").css("left", pct + "%")
            $('#bar').css("width", "calc(" + pct + "% + 12px)")

            // update label active states
            $('.range-labels li').each(function() {
              var labelQty = $(this).attr('data-quantity')
              if (qty < Number(labelQty)) {
                $(this).removeClass('active');
              } else {
                $(this).addClass('active');
              }
            })
      });

      // on range movement settles, change the quantity
      $rangeInput.on('change', function(e) {
        var newVal = e.target.value / e.target.step
        var qtyInput = document.getElementById('Quantity')
        qtyInput.value = newVal
        $("[data-cart-quantity]").attr('data-cart-quantity', newVal)

        self.test(qtyInput.value, newVal);
      });

      // selector changes
      $('.product-size button').click(function(e) {
        var $this = $(e.target)
        var id = $this.attr('data-id')
        options.selectVariant(id)
        $('.product-size button').removeClass('selected')
        $this.addClass('selected')
        $rangeInput.val($rangeInput.attr("min")).trigger('input');
        self.updatePrice()
      })
      // submit the form
      $('#submitButton').click(function(e) {
        e.preventDefault()
        $('#AddToCart').trigger('click');
        $('#AddToCartForm').submit();
      })

      // products ajax
      $('[ref="product-select"]').click(function(e) {
        // e.preventDefault()
        var target = $(this),
            productURl = this.href

        // self.loadProduct(productURl)
      })
    },
    selectCallback: function(variant, selector) {
      console.log("Switching variant: ", variant);
      concrete.switchVariant({
        moneyFormat: window.MoneyFormat,
        variant: variant,
      })
    },
    updatePrice: function() {
      var price = $('#ProductPrice').attr('content')
      price = Number(price).toFixed(2)
      $('#price-tooltip span').html(price)
    },
    loadProduct: function(productUrl) {
      $('#product-container').load( productUrl + ' #product-container *', function(data){
        console.log(data)
      })
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
