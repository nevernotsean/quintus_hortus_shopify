var fullpage = {
  container: [],
  options: {},
  init: function() {
    fullpage.container = $("#fullpage");

    if ($("body").attr("id") === "le-concept") {
      //
    } else if ($("body.template-product").length) {
      fullpage.productView.init($("#product-form-container"));
    } else if ($("body.template-article").length) {
      fullpage.blogView.init();
    } else {
      if (fullpage.container.length) {
        fullpage.container.fullpage(fullpage.options);
      }
    }
  },
  productView: {
    options: null,
    $productContainer: [],
    currentProductHandle: null,
    selectOptions: null,
    init(productContainer) {
      var self = fullpage.productView;

      window.MoneyFormat = $(".MoneyFormat")[0].value;

      self.$productContainer = $(productContainer);
      self.currentProductHandle = self.$productContainer.data("initHandle");

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
          // console.log('afterLoad')
        },
        onLeave: function(index, nextIndex, direction) {
          // console.log('onLeave')
        },
        onSlideLeave: function(
          anchorLink,
          index,
          slideIndex,
          direction,
          nextSlideIndex
        ) {
          console.log(
            "onSlideLeave",
            anchorLink,
            index,
            slideIndex,
            direction,
            nextSlideIndex
          );
        },
        afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex) {
          var thisSlide = $(".slide")[slideIndex],
            productUrl = $(thisSlide).data("producturl");

          console.log("afterSlideLoad: ", productUrl);
          self.currentProductHandle = $(thisSlide).data("handle");
          self.loadProduct(productUrl, function(){
            self.refresh();
          });
        }
      };
      if (fullpage.container.length) {
        fullpage.container.fullpage(fullpage.options);
      }
    },
    refresh: function(){
      var self = this
      self.getSelectOptions();
      self.addEventListeners();
      self.updatePrice();
    },
    addEventListeners: function() {
      var self = fullpage.productView,
        $rangeInput = self.$productContainer.find(".range input");

      // sync the quanitities
      self.$productContainer.find("#Quantity").on("change", function() {
        self.$productContainer
          .find("#AddToCart")
          .attr("data-cart-quantity", $(this).val());
      });
      self.$productContainer;

      // Update the price and position of range, amount and price label
      $rangeInput.on("input", function(e) {
        var qty = e.target.value,
          baseprice = self.$productContainer
            .find("#ProductPrice")
            .attr("content"),
          price = (qty / e.target.step * baseprice).toFixed(2);

        self.$productContainer.find("#price-tooltip span").html(price);
        self.$productContainer.find("#amount-tooltip span").html(qty + "g");

        var max = e.target.max, min = e.target.min, pct = qty / max * 100 - 5;

        pct = pct < 0 ? 0 : pct;

        self.$productContainer
          .find("#price-tooltip, #amount-tooltip")
          .css("left", pct + "%");
        self.$productContainer
          .find("#bar")
          .css("width", "calc(" + pct + "% + 12px)");
      });

      // on range movement settles, change the quantity
      $rangeInput.on("change", function(e) {
        var newVal = e.target.value / e.target.step;
        var qtyInput = document.getElementById("Quantity");
        qtyInput.value = newVal;
        self.$productContainer
          .find("[data-cart-quantity]")
          .attr("data-cart-quantity", newVal);

        self.test(qtyInput.value, newVal);
      });

      // selector changes
      self.$productContainer.find(".product-size button").click(function(e) {
        var $this = $(e.target);
        var id = $this.attr("data-id");
        self.selectOptions.selectVariant(id);
        self.$productContainer
          .find(".product-size button")
          .removeClass("selected");
        $this.addClass("selected");
        $rangeInput.val($rangeInput.attr("min")).trigger("input");
        self.updatePrice();
      });
      // submit the form
      self.$productContainer.find("#submitButton").click(function(e) {
        e.preventDefault();
        self.$productContainer.find("#AddToCart").trigger("click");
        self.$productContainer.find("#AddToCartForm").submit();
      });
    },
    loadProduct: function(productUrl, callback) {
      var urlSelector = productUrl + " #product-form-container > *";

      $("#product-form-container").load(urlSelector, function(data) {
        console.log("reroute success");
        window.history.pushState({url: "" + productUrl + ""}, null, productUrl);
        callback()
      });
    },
    getSelectOptions: function() {
      var ProductJSON, self = this;
      $.get("/products/" + self.currentProductHandle + ".json", function(productJSON) {
        self.selectOptions = new Shopify.OptionSelectors("productSelect", {
          product: productJSON.product,
          onVariantSelected: self.selectCallback,
          enableHistoryState: true
        });
      });
    },
    selectCallback: function(variant, selector) {
      console.log("Switching variant: ", variant);
      concrete.switchVariant(
        {
          moneyFormat: window.MoneyFormat,
          variant: variant
        },
        self.$productContainer
      );
    },
    updatePrice: function() {
      var self = this;
      var price = self.$productContainer.find("#ProductPrice").attr("content");
      price = Number(price).toFixed(2);
      self.$productContainer.find("#price-tooltip span").html(price);
    },
    test: function(val1, val2) {
      val2 = val2.toString();
      if (val1 !== val2) {
        alert('Test fail')
        // debugger;
      } else {
        console.log("Test: ", val1, val2);
      }
    }
  },
  blogView: {
    init: function() {
      var self = fullpage.blogView;
      $("body").scrollTop(0);

      $(window).scroll(function() {
        var active = false;
        if (window.pageYOffset > 10 && !active) {
          $("header > .bg").addClass("active");
          active = true;
        } else {
          $("header > .bg").removeClass("active");
          active = false;
        }
      });
    }
  }
};

$(document).ready(function() {
  fullpage.init();
});
