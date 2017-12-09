var fullpage = {
	container: [],
	options: {},
	init: function() {
		fullpage.container = $('#fullpage')

		if ($('body').attr('id') === 'le-concept') {
			if (fullpage.container.length) {
				fullpage.verticalView.init()
			}
		} else if ($('body').attr('id') === 'chaussettes-made-in-france') {
			if (fullpage.container.length) {
				fullpage.verticalView.init()
				fullpage.handleVideo.init()
			}
		} else if ($('body').attr('id') === 'contactez-nous') {
			if (fullpage.container.length) {
				fullpage.contactView.init()
			}
		} else if ($('body.template-product').length) {
			fullpage.productView.init($('#product-form-container'))
		} else if ($('body.template-article').length) {
			fullpage.blogView.init()
		} else {
			if (fullpage.container.length) {
				fullpage.container.fullpage(fullpage.options)
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
				responsiveHeight: 500,
				responsiveWidth: 900
			}
			if ($('.ms-left, .ms-right').length) {
				fullpage.container.multiscroll({
					navigation: true,
					afterLoad: this.handleAfterLoad,
					onLeave: this.handleOnLeave,
					afterRender: this.handleRender,
					easing: 'easeInOutExpo',
					scrollingSpeed: 1200,
					responsiveHeight: 500,
					responsiveWidth: 900,
					responsiveExpand: true,
					responsiveExpandKey:
						'cXVpbnR1c2hvcnR1cy5jb21fSTZHY21WemNHOXVjMmwyWlVWNGNHRnVaQT09UU1N'
				})
			} else {
				fullpage.container.fullpage(fullpage.options)
			}
		},
		eventHandlers: function() {
			$(window).on('resize', function() {
				fullpage.verticalView.updateProgressBar($('.section.active').index())
			})
			$('a.nextSection').click(function() {
				if ($.fn.multiscroll) {
					$.fn.multiscroll.moveSectionDown()
				} else {
					$.fn.fullpage.moveSectionDown()
				}
			})
			$('a.topSection').click(function() {
				$.fn.multiscroll.moveTo(1)
			})
		},
		handleRender: function() {
			var context = fullpage.verticalView
			$('#fullpage').addClass('fullpage-wrapper')
			if ($('.ms-left, .ms-right').length) {
				$('#MainContent').prepend('<div class="progressbar"></div>')
			}
			context.progressBar = $('.progressbar')
			context.navigation = $('#fp-nav,  #multiscroll-nav')
			context.updateNav(1)
			context.eventHandlers()
		},
		handleOnLeave: function(anchorLink, index) {
			var context = fullpage.verticalView
			if (context.progressBar.length && context.navigation.length) {
				context.updateNav(index)
			}
		},
		updateNav: function(activeIndex) {
			this.updateProgressBar(activeIndex)
			this.updateActiveNav(activeIndex)
			this.updateNavColor(activeIndex)
		},
		updateProgressBar: function(activeIndex) {
			var indexZero = activeIndex - 1,
				currentDot = fullpage.verticalView.navigation
					.find('ul li')
					.eq(indexZero)[0]
			if (currentDot) {
				fullpage.verticalView.progressBar.height(
					currentDot.getBoundingClientRect().top
				)
			}
		},
		updateNavColor: function(activeIndex) {
			var indexZero = activeIndex - 1
			var bgcolor = $('.section:eq(' + indexZero + ')').css('background-color')
			var color = $('.section:eq(' + indexZero + ')').css('color')
			var activeDotColor

			if (bgcolor === 'rgb(254, 216, 86)') {
				activeDotColor = color
			} else {
				activeDotColor = bgcolor
			}

			if ($.fn.multiscroll) {
				fullpage.verticalView.navigation
					.find('li a.activeStyle, li a.active')
					.css('background-color', '#fff')
					.css('color', activeDotColor)
			}

			setTimeout(function() {
				fullpage.verticalView.navigation
					.find('li a:not(.activeStyle)')
					.css('background-color', bgcolor)
					.css('color', color)
			}, 500)
		},
		updateActiveNav: function(activeIndex) {
			fullpage.verticalView.navigation.find('li a').each(function(index) {
				var indexZero = activeIndex - 1
				if (index > indexZero) {
					$(this).removeClass('activeStyle')
				} else {
					$(this).addClass('activeStyle')
				}
			})
		}
	},
	handleVideo: {
		videoEl: [],
		init: function() {
			if (window.innerWidth < 768) {
				$('.videoTrigger').attr('href', 'https://youtu.be/77CrFxVBagM')
			} else {
				$('body').append(
					'<div id="video-container"><div id="close"><i class="fa fa-times fa-3x"></i></div></div>'
				)
				$('#video-container').append(
					'<video playsinline="" preload="metadata">' +
						'<source type="video/mp4" src="https://player.vimeo.com/external/220257455.hd.mp4?s=4d8accd0776756f6737af75957fc832d4fc21e06&profile_id=169">' +
						'</video>'
				)
				fullpage.handleVideo.videoEl = $('#video-container video')[0]
				fullpage.handleVideo.videoEl.addEventListener('ended', function() {
					fullpage.handleVideo.close()
				})
				$('#close').click(fullpage.handleVideo.close)
				$('.videoTrigger').click(this.handleClick)
			}
		},
		handleClick: function() {
			fullpage.handleVideo.open()
		},
		animateIn: function(doneCallback) {
			var dur = 1000,
				ease = 'easeOutExpo'
			$('#multiscroll-nav').animate({ opacity: 0 }, 500, ease)
			$('.progressbar').animate({ opacity: 0 }, 500, ease, function() {
				$('.ms-left').animate({ left: '-50%' }, dur, ease)
				$('.ms-right').animate({ right: '-50%' }, dur, ease, function() {
					$('#video-container').css('z-index', '0')
					if (typeof doneCallback === 'function') {
						doneCallback()
					}
				})
			})
		},
		animateOut: function(doneCallback) {
			var dur = 1000,
				ease = 'easeOutExpo'
			$('#video-container').css('z-index', '-1')
			$('.ms-left').animate({ left: '0' }, dur, ease)
			$('.ms-right').animate({ right: '1px' }, dur, ease, function() {
				$('#multiscroll-nav').animate({ opacity: 1 }, 500, ease)
				$('.progressbar').animate({ opacity: 1 }, 500, ease, function() {
					if (typeof doneCallback === 'function') {
						doneCallback()
					}
				})
			})
		},
		open: function() {
			$.fn.multiscroll.destroy()
			fullpage.handleVideo.videoEl.currentTime = 0
			fullpage.handleVideo.animateIn(function() {
				fullpage.handleVideo.videoEl.play()
			})
		},
		close: function() {
			fullpage.handleVideo.videoEl.pause()
			fullpage.handleVideo.animateOut(function() {
				$.fn.multiscroll.build()
			})
		}
	},
	productView: {
		debug: false,
		options: null,
		$productContainer: [],
		currentProductHandle: null,
		productSlides: [],
		selectOptions: null,
		selectedSize: 'Small',
		selectedPrice: null,
		currentQty: 1,
		currentBaseprice: null,
		currentVariantID: null,
		circles: {
			right: [],
			left: []
		},
		init: function(productContainer) {
			var self = fullpage.productView

			window.MoneyFormat = $('.MoneyFormat')[0].value

			self.$productContainer = $(productContainer)
			self.currentProductHandle = self.$productContainer.data('initHandle')
			self.currentVariantID = window.selectedVariant.id

			fullpage.options = {
				afterLoad: this.handleAfterLoad,
				onSlideLeave: this.handleSlideLeave,
				afterSlideLoad: this.handleSlideLoad,
				slidesNavigation: true,
				scrollingSpeed: 500,
				responsiveWidth: 700,
				responsiveHeight: 669,
				easing: 'easeOutBounce',
				fixedElements: '.product-view',
				controlArrows: false,
				verticalCentered: true
			}
			if (fullpage.container.length) {
				fullpage.container.fullpage(fullpage.options)
			}

			fullpage.productView.circles.right = $('.nextCircle')[0]
			fullpage.productView.circles.left = $('.prevCircle')[0]

			self.handleResize()

			self.optimizedResize.add(self.handleResize)

			self.reset(0)
			self.updateBoldState()
			self.updateColors(0)
		},
		reset: function(slideIndex) {
			var self = this
			self.selectBoldVariation()
			self.addEventListeners(slideIndex)
			self.productSlides
				.eq(slideIndex)
				.find('.product-sizes button[data-title="Large"]')
				.click()
			self.$productContainer.find('.range input').trigger('input').trigger('change')
		},
		handleResize: function() {
			var heightOffset
			if (window.innerWidth <= 600 || window.innerHeight <= 768 ) {
				$('body').addClass('small-product')
				heightOffset = $('#product-form-container').innerHeight() - 130
			} else {
				$('body').removeClass('small-product')
				heightOffset = $('#product-form-container').innerHeight() + 50
			}

			$('.fp-slides .product-circle').css('margin-bottom', heightOffset)
		},
		handleAfterLoad: function(anchorLink, index) {
			var self = fullpage.productView
			if (fullpage.productView.debug) {
				console.log('afterLoad')
			}
			fullpage.productView.productSlides = fullpage.container.find(
				'.product-slide'
			)

			if ($('.fp-responsive').length) {
				$.fn.fullpage.setAllowScrolling(false, 'left, right')
				$.fn.fullpage.verticalCentered = false
			}

			// move to left and right slide
			$('.fp-prev').click(function(e) {
				$.fn.fullpage.moveSlideLeft()
			})
			$('.fp-next').click(function(e) {
				$.fn.fullpage.moveSlideRight()
			})

			// show the previous and next circles
			$('.prevCircle, .nextCircle').addClass('active')

			// color the nav dots
			self.productSlides.each( function(index){
				var color = $(this).data('color')
				$('.fp-slidesNav ul li').eq(index)
				.find('a')
				.css('border-color', '#' + color)
				.find('span')
				.css('background-color', '#' + color)
			})
		},
		handleSlideLeave: function(anchorLink, index, slideIndex, dir, nextIndex) {
			var nextSlide = $('.slide')[nextIndex]

			if (fullpage.productView.debug) {
				console.log('onSlideLeave')
			}

			// reset slide animation
			$('.animate-title-prev, .animate-title-next').removeClass(
				'animate-title-prev animate-title-next'
			)

			$('body').addClass('product-loading')

			fullpage.productView.animations.slideChange(nextSlide, dir)
			fullpage.productView.animations.moveCircles(dir)
			fullpage.productView.animations.moveCurrentCircle(dir, $(nextSlide).find('.product-circle')[0])
		},
		handleSlideLoad: function(anchorLink, index, slideAnchor, slideIndex) {
			var thisSlide = $('.slide')[slideIndex],
				productUrl = $(thisSlide).data('producturl')

			if (fullpage.productView.debug) {
				console.log('afterSlideLoad: ', slideIndex)
			}

			fullpage.productView.currentProductHandle = $(thisSlide).data('handle')

			fullpage.productView.loadProduct(productUrl, function() {
				// on complete reset the events
				fullpage.productView.reset(slideIndex)
				fullpage.productView.updateColors(slideIndex)
				setTimeout(function() {
					$('body').removeClass('product-loading')
				}, 50)
			})
		},
		selectBoldVariation: function() {
			var self = this,
				titleAndQty = self.currentQty == 1
					? self.selectedSize
					: self.selectedSize + ' ' + self.currentQty / 1 + '+'

			if (fullpage.productView.debug) {
				console.log('Switching variant: ', self.currentVariantID)
			}

			$('#productSelect').val(self.currentVariantID)
			// self.selectOptions.selectVariant(self.currentVariantID)
		},
		updateBoldState: function() {
			var self = this,
				priceContainer = self.$productContainer.find('#ProductPrice'),
				normalizeQty = self.currentQty / 1,
				totalPrice,
				variantData

			if (Shopify.Products) {
				variantData = self.getCurrentVariant().variants.filter(function(item) {
					return item.option1 == self.selectedSize
				})[0]

				if (variantData) {
					self.currentBaseprice = variantData.price
					self.currentVariantID = variantData.id
					self.selectedSize = variantData.option1

					totalPrice = normalizeQty * self.currentBaseprice

					self.printLabels(totalPrice)
				} else {
					console.log('error: self.selectedSize is ', self.selectedSize)
				}
			}
		},
		getCurrentVariant: function() {
			return Shopify.Products.filter(function(item) {
				return item.handle == fullpage.productView.currentProductHandle
			})[0]
		},
		addEventListeners: function(slideIndex) {
			var self = fullpage.productView,
				$rangeInput,
				activeSlide

			if (!slideIndex) {
				var slideIndex = $('.product-slides.active').index()
			}

			activeSlide = self.productSlides.eq(slideIndex)
			$rangeInput = self.$productContainer.find('.range input')

			// sync the quanitities
			self.$productContainer.find('#Quantity').on('change', function() {
				self.$productContainer
					.find('#AddToCart')
					.attr('data-cart-quantity', $(this).val())
			})

			// Update the price and position of range, amount and price label
			$rangeInput.on('input mousemove', self.handleRangeInput.bind(self))

			// // debug IE
			// $rangeInput.on('mousemove', function(){
			// 	console.log('range mousemove')
			// })

			// on range movement settles, change the quantity
			$rangeInput.on('change', self.handleRangeChange.bind(self))

			// selector changes
			$('.product-sizes button').click(self.handleSizeButton.bind(self))

			// submit the form
			self.$productContainer.find('#submitButton').click(function(e) {
				e.preventDefault()
				self.$productContainer.find('#AddToCart').trigger('click')
				self.$productContainer.find('#AddToCartForm').submit()
			})
		},
		handleSizeButton: function(e) {
			var self = this,
				$rangeInput = self.$productContainer.find('.range input')

			var $this = $(e.target)
			var id = $this.attr('data-id')

			self.selectedSize = $this.data('title')

			if (!$this.data('title')) {
				self.selectedSize = $this.closest('[data-title]').data('title')
			}

			self.updateBoldState()
			self.selectBoldVariation()
			self.updateSelectedSizeButton()

			$rangeInput.val($rangeInput.attr('min')).trigger('input').trigger('mousemove')

			$('#Quantity').attr('value','1').attr('data-cart-quantity','1')
		},
		handleRangeChange: function(e) {
			var newVal = e.target.value / e.target.step,
				qtyInput = document.getElementById('Quantity')
			qtyInput.value = newVal
			this.$productContainer
				.find('[data-cart-quantity]')
				.attr('data-cart-quantity', newVal)

			this.updateBoldState()
			this.selectBoldVariation()

			if (fullpage.productView.debug) {
				console.log('Form: ' + $('#AddToCartForm').serialize())
			}
		},
		handleRangeInput: function(e) {
			var self = this

			self.currentQty = e.target.value

			this.updateBoldState()
			this.selectBoldVariation()

			var max = e.target.max,
				min = e.target.min,
				offset,
				pctAdjusted

			pct = (self.currentQty - min) / (max - min) * 100
			pct = pct < 0 ? 0 : pct
			offset = 0.04 * pct
			pctAdjusted = pct - offset

			self.$productContainer
				.find('#bar')
				.css('width', 'calc(' + pctAdjusted + '% + 12px)')

			self.$productContainer
				.find('#price-tooltip, #amount-tooltip')
				.css('left', pctAdjusted + '%')
		},
		optimizedResize: (function() {
			var callbacks = [],
				running = false

			// fired on resize event
			function resize() {
				if (!running) {
					running = true

					if (window.requestAnimationFrame) {
						window.requestAnimationFrame(runCallbacks)
					} else {
						setTimeout(runCallbacks, 66)
					}
				}
			}

			// run the actual callbacks
			function runCallbacks() {
				callbacks.forEach(function(callback) {
					callback()
				})

				running = false
			}

			// adds callback to loop
			function addCallback(callback) {
				if (callback) {
					callbacks.push(callback)
				}
			}

			return {
				// public method to add additional callback
				add: function(callback) {
					if (!callbacks.length) {
						window.addEventListener('resize', resize)
					}
					addCallback(callback)
				}
			}
		})(),
		loadProduct: function(productUrl, callback) {
			var urlSelector = productUrl + ' #product-form-container > *'

			$('#product-form-container').load(urlSelector, function(
				response,
				status,
				xhr
			) {
				if (status == 'success') {
					if (fullpage.productView.debug) {
						console.log('reroute success')
					}
					window.history.pushState(
						{ url: '' + productUrl + '' },
						null,
						productUrl
					)
					callback()
				} else if (status == 'error') {
					window.location = productUrl
				}
			})
		},
		calculateSocks: function(qty, size) {
			if (size == 'Small' || size == 'Medium' || size == 'Large') {
				var weight = {
					Small: 13.85,
					Medium: 16.85,
					Large: 21.45
				}
				// var amountPer100 = {
				// 	Small: 8,
				// 	Medium: 6,
				// 	Large: 5
				// }
				var result = (weight[size] * qty).toFixed(2)
				// var result = qty

				return result
			} else {
				return false
			}
		},
		printLabels: function(price) {
			var self = this,
				sockAmt = self.calculateSocks(self.currentQty, self.selectedSize)

			self.$productContainer
				.find('span#price-label')
				.html(Shopify.formatMoney(price, window.MoneyFormat))

			self.$productContainer
				.find('.bottom-label span#grams')
				.html(sockAmt + 'g')

			self.$productContainer.find('.bottom-label span#count').html(self.currentQty)
		},
		updateSelectedSizeButton: function() {
			var self = this

			$('.product-slide.active .product-sizes button.selected').removeClass(
				'selected'
			)
			$(
				'.product-slide.active .product-sizes button[data-title="' +
					self.selectedSize +
					'"]'
			).addClass('selected')
		},
		updateColors: function(currentSlideIndex) {
			var prevI = currentSlideIndex - 1,
				nextI = currentSlideIndex + 1,
				slideCount = fullpage.productView.productSlides.length,
				pColor,
				nColor

			// set the previous index to the last item index if negative
			prevI = prevI < 0 ? slideCount - 1 : prevI
			// set the next index to the first item if over the limit index
			nextI = nextI > slideCount - 1 ? 0 : nextI

			// console.log('prevI:', prevI, 'currentSlideIndex:', currentSlideIndex, 'nextI:', nextI)

			pColor = fullpage.productView.productSlides.eq(prevI).data('color')
			nColor = fullpage.productView.productSlides.eq(nextI).data('color')

			$('#left-arrow-poly').css('stroke', '#' + pColor)
			$('.prevCircle').css('background', '#' + pColor)

			$('#right-arrow-poly').css('stroke', '#' + nColor)
			$('.nextCircle').css('background', '#' + nColor)
		},
		animations: {
			slideChange: function(slide, dir) {
				if (dir == 'left') {
					$(slide).toggleClass('animate-title-prev')
				}
				if (dir == 'right') {
					$(slide).toggleClass('animate-title-next')
				}
			},
			moveCurrentCircle: function(dir, currentEl){
				dynamics.animate(currentEl,
					{ translateX: 0 },
					{ type: dynamics.spring, duration: 3000, friction: 700, frequency: 500 }
				);
			},
			moveCircles: function(dir) {
				var animProps = {
					type: dynamics.easeIn,
					duration: 100,
					complete: function(el) {
						dynamics.animate(el,
							{
								translateX: 0, scale: 1
							},
							{
								type: dynamics.spring, duration: 1000, friction: 300
							}
						);
					}
				}

				dynamics.animate(fullpage.productView.circles.right,
					{
						translateX: dir === 'right' ? -fullpage.productView.circles.right.offsetWidth/3 : fullpage.productView.circles.right.offsetWidth/3, scale: 1
					},
					animProps
				);
				dynamics.animate(fullpage.productView.circles.left,
					{
						translateX: dir === 'right' ? -fullpage.productView.circles.left.offsetWidth/3 : fullpage.productView.circles.left.offsetWidth/3, scale: 1
					},
					animProps
				);
			}
		}
	},
	blogView: {
		init: function() {
			var self = fullpage.blogView
			$('body').scrollTop(0)

			$(window).scroll(function() {
				var active = false
				if (window.pageYOffset > 10 && !active) {
					$('header > .bg').addClass('active')
					active = true
				} else {
					$('header > .bg').removeClass('active')
					active = false
				}
			})
		}
	},
	contactView: {
		init: function() {
			fullpage.options = {
				navigation: true,
				afterLoad: this.handleLoad,
				onLeave: this.handleOnLeave,
				// afterRender: this.handleRender,
				easing: 'easeInOutExpo',
				scrollingSpeed: 1200,
				responsiveWidth: 900,
				setAllowScrolling: false
			}
			if (window.innerWidth >= 900) {
				fullpage.container.fullpage(fullpage.options)
			}
			$(document).on('keydown', this.handleKeypress)
		},
		handleLoad: function() {
			$('a.nextField').click(function() {
				$.fn.fullpage.moveSectionDown()
			})
		},
		handleOnLeave: function(index, nextIndex, direction) {
			if ($('.fp-responsive').length) {
				return false
			}
			var index0 = index - 1,
				element = $('#fullpage .section').eq(index0).find('input, textarea')[0],
				isValid = $('form#contact_form').validate().element(element)

			if (!isValid) {
				return false
			}
		},
		handleKeypress: function(e) {
			var key = e.which || e.keyCode
			// console.log(key)
			if (key == 13 || key == 9) {
				// 13 is enter
				e.preventDefault()
				$.fn.fullpage.moveSectionDown()
			}
		}
	}
}

$(document).ready(function() {
	fullpage.init()
})
