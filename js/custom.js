(function ($) {

	"use strict";

	var $document = $(document),
		$window = $(window),
		plugins = {
			mainSlider: $('#mainSlider'),
			slideNav: $('#slide-nav'),
			categoryCarousel: $('.category-carousel'),
			servicesCarousel: $('.services-carousel'),
			clientsCarousel: $('.clients-carousel'),
			servicesAltCarousel: $('.services-alt'),
			servicesBlockAlt: $('.services-block-alt'),
			textIconCarousel: $('.text-icon-carousel'),
			testimonialsCarousel: $('.testimonials-carousel'),
			promoCarousel: $('.promo-carousel'),
			submenu: $('[data-submenu]'),
			mapFooter: $('#ymap'),
			counterBlock: $('#counterBlock'),
			isotopeGallery: $('.gallery-isotope'),
			postGallery: $('.blog-isotope'),
			postCarousel: $('.post-carousel'),
			postMoreLink: $('.view-more-post'),
			animation: $('.animation'),

			stickyHeader: $("header.sticky"),
		},
		$shiftMenu = $('#slidemenu, #pageContent, #mainSliderWrapper, .page-footer, .page-header .header-row, body, .darkout-menu'),
		$navbarToggle = $('.navbar-toggle'),
		$dropdown = $('.dropdown-submenu, .dropdown'),
		$fullHeight = $('#mainSlider, #mainSlider .img--holder'),
		$marginTop = $('body.fixedSlider #pageContent'),
		$marginBottom = $('body.fixedFooter #pageContent');

	/* ---------------------------------------------
     Scripts initialization
    --------------------------------------------- */
	$document.ready(function () {

		var windowWidth = window.innerWidth || $window.width();
		var windowH = $window.height();

		// set fullheigth
		if (windowWidth < 992) {
			$fullHeight.height('');
		} else {
			var windowHeight = Math.min($window.height(), 500);
			var footerHeight = $('.page-footer').height();
			$fullHeight.height(windowHeight);
			$marginTop.css({
				'margin-top': windowHeight + 'px'
			});
			$marginBottom.css({
				'margin-bottom': footerHeight + 'px'
			})
		}

		// vertical tabs
		$("div.vertical-tab-menu>div.list-group>a").on('click', function (e) {
			e.preventDefault();
			$(this).siblings('a.active').removeClass("active");
			$(this).addClass("active");
			var index = $(this).index();
			$("div.vertical-tab>div.vertical-tab-content").removeClass("active");
			$("div.vertical-tab>div.vertical-tab-content").eq(index).addClass("active");
		});

		// collapsed text
		$(".view-more-link").on('click', function (e) {
			var $this = $(this);
			var $target = $($this.attr('href'));
			if ($this.hasClass('opened')) {
				$this.removeClass('opened');
				$('.view-more-mobile', $target).stop(true, true).fadeOut();
			} else {
				$this.addClass('opened');
				$('.view-more-mobile', $target).stop(true, true).fadeIn();
			}
			e.preventDefault();
		})

		// image animation in modal (appointment form)
		/*$('header .appointment').on('click', function () {
			$('html').css({
				'overflow-y': 'hidden'
			});
			$('.page-header, #mainSliderWrapper').css({
				'padding-right': getScrollbarWidth() + 'px'
			});
		})*/
		/*$('.modal').on('shown.bs.modal', function () {
			var $el = $('.animate', $(this));
			doAnimations($el);
		}).on('hidden.bs.modal', function () {
			var $el = $('.animate', $(this));
			$el.addClass('animation');
			$('html').css({
				'overflow-y': ''
			})
			$('.page-header, #mainSliderWrapper').css({
				'padding-right': ''
			});
		})*/

		// main slider
		if (plugins.mainSlider.length) {
			var $el = plugins.mainSlider;
			$el.on('init', function (e, slick) {
				var $firstAnimatingElements = $('div.slide:first-child').find('[data-animation]');
				doAnimations($firstAnimatingElements);
			});
			$el.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
				var $currentSlide = $('div.slide[data-slick-index="' + nextSlide + '"]');
				var $animatingElements = $currentSlide.find('[data-animation]');
				setTimeout(function () {
					$('div.slide').removeClass('slidein');
				}, 500);
				setTimeout(function () {
					$currentSlide.addClass('slidein');
				}, 1000);
				doAnimations($animatingElements);
			});
			$el.slick({
				arrows: true,
				dots: false,
				autoplay: true,
				autoplaySpeed: 7000,
				fade: true,
				speed: 500,
				pauseOnHover: false,
				pauseOnDotsHover: true
			});
		}

		// number counter
		if (plugins.counterBlock.length) {
			plugins.counterBlock.waypoint(function () {
				$('.number > span.count', plugins.counterBlock).each(count);
				this.destroy();
			}, {
					triggerOnce: true,
					offset: '80%'
				});
		}

		// slide menu
		if (plugins.slideNav.length) {
			var $slideNav = plugins.slideNav,
				toggler = '.navbar-toggle',
				$closeNav = $('.darkout-menu, .close-menu');

			$slideNav.after($('<div id="navbar-height-col"></div>'));
			var $heightCol = $('#navbar-height-col')
			$slideNav.on("click", toggler, function (e) {
				var $this = $(this);
				$heightCol.toggleClass('slide-active');
				$this.toggleClass('slide-active');
				$shiftMenu.toggleClass('slide-active');
			});
			$closeNav.on("click", function (e) {
				$heightCol.toggleClass('slide-active');
				$shiftMenu.toggleClass('slide-active');
			});
		}

		// image popup
		if (plugins.isotopeGallery.length) {
			plugins.isotopeGallery.find('a.hover').magnificPopup({
				type: 'image',
				gallery: {
					enabled: true
				}
			});
		}

		// gallery isotope
		if (plugins.isotopeGallery.length) {
			var $gallery = plugins.isotopeGallery;
			$gallery.imagesLoaded(function () {
				$gallery.isotope({
					itemSelector: '.gallery-item',
					masonry: {
						columnWidth: '.gallery-item',
						gutter: 30
					}
				});
			});
			isotopeFilters($gallery);
		}

		// post isotope
		if (plugins.postGallery.length) {
			console.log('dsad')
			var $postgallery = $('.blog-isotope');
			$postgallery.imagesLoaded(function () {
				$postgallery.isotope({
					itemSelector: '.blog-post',
					masonry: {
						gutter: 30,
						columnWidth: '.blog-post'
					}
				});
			});
		}

		// post more ajax load
		if (plugins.postMoreLink.length) {
			var $postMoreLink = plugins.postMoreLink,
				$postPreload = $('#postPreload'),
				$postLoader = $('#moreLoader');

			$postMoreLink.on('click', function () {
				var target = $(this).attr('data-load');
				$postLoader.addClass('visible');
				$(this).hide();
				$.ajax({
					url: target,
					success: function (data) {
						setTimeout(function () {
							$postPreload.append(data);
							$postLoader.removeClass('visible');
						}, 500);
					}
				});
			})
		}

		// CAROUSELS

		// text_icon carousel
		if (plugins.textIconCarousel.length) {
			plugins.textIconCarousel.slick({
				mobileFirst: false,
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
				dots: true,
				arrows: false,
				responsive: [{
					breakpoint: 991,
					settings: {
						slidesToShow: 3
					}
				}, {
					breakpoint: 767,
					settings: {
						slidesToShow: 2
					}
				}, {
					breakpoint: 480,
					settings: {
						slidesToShow: 1
					}
				}]
			});
		}

		// Slide mobile info
		function slideMobileInfo(toggle, slide) {
			var $toggle = $(toggle),
				$slide = $(slide);
			$toggle.on("click", function (e) {
				$(this).toggleClass('open');
				$slide.slideToggle(300).toggleClass('open');
			})
		}
		slideMobileInfo('.header-info-toggle', '.header-info-mobile');

		// person carousel (team)
		/*if (plugins.personCarousel.length) {
			plugins.personCarousel.slick({
				mobileFirst: false,
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
				autoplay: true,
				autoplaySpeed: 2000,
				arrows: false,
				dots: true,
				responsive: [{
					breakpoint: 1199,
					settings: {
						slidesToShow: 3
					}
            }, {
					breakpoint: 767,
					settings: {
						slidesToShow: 1
					}
            }]
			});
		}*/


		// promo carousel (Р°РєС†РёРё)
		if (plugins.promoCarousel.length) {
			plugins.promoCarousel.slick({
				mobileFirst: false,
				slidesToShow: 2,
				slidesToScroll: 1,
				infinite: true,
				autoplay: true,
				autoplaySpeed: 2000,
				arrows: false,
				dots: true,
				responsive: [{
					breakpoint: 1199,
					settings: {
					slidesToShow: 1
					}
            	}]
			});
		}

		if (plugins.clientsCarousel.length) {
			plugins.clientsCarousel.slick({
				mobileFirst: false,
				slidesToShow: 4,
				slidesToScroll: 1,
				infinite: true,
				autoplay: true,
				autoplaySpeed: 2000,
				arrows: true,
				dots: false,
				responsive: [{
					breakpoint: 1199,
					settings: {
						slidesToShow: 3
					}
				}, {
					breakpoint: 780,
					settings: {
						slidesToShow: 2
					}
				}]
			});
		}

		// category carousel
		if (plugins.categoryCarousel.length) {
			plugins.categoryCarousel.slick({
				mobileFirst: false,
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
				arrows: false,
				dots: true,
				responsive: [{
					breakpoint: 991,
					settings: {
						slidesToShow: 3
					}
				}, {
					breakpoint: 767,
					settings: {
						slidesToShow: 2
					}
				}, {
					breakpoint: 480,
					settings: {
						slidesToShow: 1
					}
				}]
			});
		}

		// post carousel
		if (plugins.postCarousel.length) {
			plugins.postCarousel.slick({
				mobileFirst: false,
				slidesToShow: 1,
				slidesToScroll: 1,
				infinite: true,
				autoplay: false,
				arrows: true,
				dots: false
			});
		}

		// testimonials carousel
		if (plugins.testimonialsCarousel.length) {
			plugins.testimonialsCarousel.slick({
				mobileFirst: false,
				slidesToShow: 3,
				slidesToScroll: 3,
				infinite: true,
				autoplay: false,
				autoplaySpeed: 30000,
				arrows: true,
				//rtl: plugins.rtltrue,
				dots: false,
				//fade: true,
				//cssEase: 'linear'
				responsive: [{
					breakpoint: 1200,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2
					}
				}, {
					breakpoint: 991,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}]
			});
		}

		// END CAROUSELS

		// lazy loading effect
		if (plugins.animation.length) {
			onScrollInit(plugins.animation, windowWidth);
		}

		toggleNavbarMethod(windowWidth);
		mobileClickBanner(windowWidth);

		// Resize window events
		$window.resize(function () {
			var windowWidth = window.innerWidth || $window.width();

			startCarousel();

			if (windowWidth < 992) {
				$fullHeight.height('');
			}
			if (windowWidth > 767 && $navbarToggle.is(':hidden')) {
				$shiftMenu.removeClass('slide-active');
			}
			if (plugins.servicesBlockAlt.length) {
				$(".services-block-alt, .services-block-alt .title, .services-block-alt .text").each(function () {
					$(this).css({
						'height': ''
					});
				})
			}
		});

		$(window).resize(debouncer(function (e) {
			var windowWidth = window.innerWidth || $window.width();
			if (windowWidth > 991) {
				$fullHeight.height(Math.min($(window).height(), 500));
			}

			if (windowWidth > 768) {
				if (plugins.servicesCarousel.length) {
					equalHeight(".text-icon-carousel > div", ".title", ".text");
				}
			}
			if (windowWidth > 480) {
				if (plugins.servicesBlockAlt.length) {
					equalHeight(".services-block-alt", ".title", ".text");
				}
			}

			$dropdown.removeClass('opened');
			toggleNavbarMethod(windowWidth);
			mobileClickBanner(windowWidth);
		}))

		// Back to top
		function backToTop(button) {
			var $button = $(button);
			$(window).on('scroll', function () {
				if ($(window).scrollTop() >= (($(document).height() - $(window).height()) - 100)) {
					$button.css({ 'bottom': '' })
				} else {
					$button.css({ 'bottom': '15px' })
				}
				if ($(this).scrollTop() >= 500) {
					$button.addClass('visible');
				} else {
					$button.removeClass('visible');
				}
			});
			$button.on('click', function () {
				$('body,html').animate({
					scrollTop: 0
				}, 1000);
			});
		}
		backToTop('.back-to-top');

		calcPrice();
		$("#inputMaterial, #inputVolume, #inputPlace, #inputPump").change(function () {
			calcPrice();
		});

		$("#inputMaterial, #inputVolume, #inputPlace, #inputPump").focusin(function () {
			//$(this).closest(".row").addClass("active");
			//console.log("focusin");
		});

		$("#inputMaterial, #inputVolume, #inputPlace, #inputPump").focusout(function () {
			//$(this).closest(".row").removeClass("active");
			//console.log("focusout");
		});

		$("#sendOrder").on('click', function(event) {
			event.preventDefault();
		
			var $elem = $("#inputName");
			var str = $elem.val();
			var hasErr = false;
			if (str.trim() == "") {
				$elem.closest(".form-group").addClass("has-error");
				$.jGrowl("Перед отправкой заявки укажите Ваше имя", { theme: 'infos' });
				hasErr = true;
			} else {
				$elem.closest(".form-group").removeClass("has-error");
			}
		
			$elem = $("#inputContact");
			str = $elem.val();
			var re = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{5,10}$/i;
			if (str.trim() == "") {
				$elem.closest(".form-group").addClass("has-error");
				$.jGrowl("Перед отправкой заявки укажите Ваш телефон", { theme: 'infos' });
				hasErr = true;
			} else if (!re.test(str)) {
				$elem.closest(".form-group").addClass("has-error");
				$.jGrowl("Возможно, ваши контакты введены неправильно. Введите корректный номер телефона", { theme: 'infos' });
				hasErr = true;
			} else {
				$elem.closest(".form-group").removeClass("has-error");
			}
		
			$elem = $("#inputDescl");
			if (!$elem.is(':checked')) {
				$.jGrowl("Перед отправкой ознакомьтесь с политикой конфидециальности", { theme: 'infos' });
				hasErr = true;
			} else {
				$elem.closest(".form-group").removeClass("has-error");
			}
		
			if (hasErr) {
				return false;
			} else {
		
				$.ajax({
					type: "POST",
					url: "mail.php",
					data: $('#calc-beton').serialize()
				}).done(function() {
					$('#calc-beton').trigger('reset');
					$.jGrowl("Сообщение отправлено - OK", {  header: 'Внимание!', theme: 'infos' });
				});
				
				
		
			}
		
			var $form = $(this).closest('form'), name = $form.attr('name'), obj = {};
			obj.form = $form;
			obj.act = name;
			obj.data = $form.serialize();
			//console.log(obj.data);
			//console.log(mcf.state());
		
			// /(^((8|\+)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{5,10}$)|(^[a-z0-9\._]\w*@\w+\.[a-z]+$)/i
			//feedback(obj);
		
			//return false;
		});
	})

	$window.on('load', function () {

		var windowWidth = window.innerWidth || $window.width();

		startCarousel();

		// remove preloader

		if (windowWidth > 768) {
			if (plugins.servicesCarousel.length) {
				equalHeight(".text-icon-carousel > div", ".title", ".text");
			}
		}
		if (windowWidth > 480) {
			if (plugins.servicesBlockAlt.length) {
				equalHeight(".services-block-alt", ".title", ".text");
			}
		}
		if (plugins.mapFooter.length) {
			createMap('ymap')
		}


	});


	/* ---------------------------------------------
     Functions
    --------------------------------------------- */

	// Set equal height to block
	function equalHeight(block) {
		var wrapWidth = $(block).parent().width(),
			blockWidth = $(block).width(),
			wrapDivide = Math.floor(wrapWidth / blockWidth),
			cellArr = $(block);
		for (var arg = 1; arg <= arguments.length; arg++) {
			for (var i = 0; i <= cellArr.length; i = i + wrapDivide) {
				var maxHeight = 0,
					heightArr = [];
				for (var j = 0; j < wrapDivide; j++) {
					heightArr.push($(cellArr[i + j]).find(arguments[arg]));
					if (heightArr[j].outerHeight() > maxHeight) {
						maxHeight = heightArr[j].outerHeight();
					}
				}
				for (var counter = 0; counter < heightArr.length; counter++) {
					$(cellArr[i + counter]).find(arguments[arg]).outerHeight(maxHeight);
				}
			}
		}
	}

	// Slider Animation
	function doAnimations(elements) {
		var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		elements.each(function () {
			var $this = $(this);
			var $animationDelay = $this.data('animation-delay');
			var $animationDuration = $this.data('animation-duration');
			var $animationType = 'animated ' + $this.data('animation');
			$this.css({
				'animation-delay': $animationDelay,
				'-webkit-animation-delay': $animationDelay,
				'animation-duration': $animationDuration,
				'-webkit-animation-duration': $animationDuration,
			});
			$this.addClass($animationType).one(animationEndEvents, function () {
				$this.removeClass($animationType);
			});
			if ($this.hasClass('animate')) {
				$this.removeClass('animation');
			}
		});
	}

	// Time Out Resize
	function debouncer(func, timeout) {
		var timeoutID, timeout = timeout || 500;
		return function () {
			var scope = this,
				args = arguments;
			clearTimeout(timeoutID);
			timeoutID = setTimeout(function () {
				func.apply(scope, Array.prototype.slice.call(args));
			}, timeout);
		}
	}

	// Count To
	function count(options) {
		var $this = $(this);
		options = $.extend({}, options || {}, $this.data('countToOptions') || {});
		$this.countTo(options);
	}

	// Isotope Filters (for gallery)
	function isotopeFilters(gallery) {
		var $gallery = $(gallery);
		if ($gallery.length) {
			var container = $gallery;
			var optionSets = $(".filters-by-category .option-set"),
				optionLinks = optionSets.find("a");
			optionLinks.on('click', function (e) {
				var thisLink = $(this);
				if (thisLink.hasClass("selected")) return false;
				var optionSet = thisLink.parents(".option-set");
				optionSet.find(".selected").removeClass("selected");
				thisLink.addClass("selected");
				var options = {},
					key = optionSet.attr("data-option-key"),
					value = thisLink.attr("data-option-value");
				value = value === "false" ? false : value;
				options[key] = value;
				if (key === "layoutMode" && typeof changeLayoutMode === "function") changeLayoutMode($this, options);
				else {
					container.isotope(options);
				}
				return false
			})
		}
	}

	// Mobile Only carousel initialization
	function slickMobile(carousel, breakpoint, slidesToShow, slidesToScroll) {
		var windowWidth = window.innerWidth || $window.width();
		if (windowWidth < (breakpoint + 1)) {
			carousel.slick({
				mobileFirst: true,
				slidesToShow: slidesToShow,
				slidesToScroll: slidesToScroll,
				infinite: true,
				autoplay: false,
				arrows: false,
				dots: true,
				responsive: [{
					breakpoint: breakpoint,
					settings: "unslick",
				}]
			});
		}
	}

	function startCarousel() {
		if (plugins.servicesAltCarousel.length) {
			slickMobile(plugins.servicesAltCarousel, 480, 1, 1);
		}
		if (plugins.servicesCarousel.length) {
			slickMobile(plugins.servicesCarousel, 767, 2, 2);
		}
	}

	// Navigation dropdown menu
	function toggleNavbarMethod(windowWidth) {
		var $dropdownLink = $(".dropdown > a, .dropdown-submenu > a");
		var $dropdown = $(".dropdown, .dropdown-submenu");
		var $dropdownCaret = $(".dropdown > a > .ecaret, .dropdown-submenu > a > .ecaret");
		$dropdownLink.on('click.toggleNavbarMethod', function (e) {
			e.preventDefault();
			e.stopPropagation();
			var url = $(this).attr('href');
			if (url) $(location).attr('href', url);
		});
		if (windowWidth < 768) {
			$dropdown.unbind('.toggleNavbarMethod');
			$dropdownCaret.unbind('.toggleNavbarMethod');
			$dropdownCaret.on('click.toggleNavbarMethod', function (e) {
				e.stopPropagation();
				e.preventDefault();
				var $li = $(this).parent().parent('li');
				if ($li.hasClass('opened')) {
					$li.find('.dropdown-menu').first().stop(true, true).slideUp(0);
					$li.removeClass('opened');
				} else {
					$li.find('.dropdown-menu').first().stop(true, true).slideDown(0);
					$li.addClass('opened');
				}
			})
		}
	}


	// Lazy Load animation
	function onScrollInit(items, wW) {
		if (wW > 991) {
			if (!$('body').data('firstInit')) {
				items.each(function () {
					var $element = $(this),
						animationClass = $element.attr('data-animation'),
						animationDelay = $element.attr('data-animation-delay');
					$element.removeClass('no-animate');
					$element.css({
						'-webkit-animation-delay': animationDelay,
						'-moz-animation-delay': animationDelay,
						'animation-delay': animationDelay
					});
					var trigger = $element;
					trigger.waypoint(function () {
						$element.addClass('animated').addClass(animationClass);
						if ($element.hasClass('hoveranimation')) {
							$element.on("webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd", function () {
								$(this).removeClass("animated").removeClass("animation").removeClass(animationClass);
							});
						}
					}, {
							triggerOnce: true,
							offset: '90%'
						});
				});
				$('body').data('firstInit', true);
			}
		} else {
			items.each(function () {
				var $element = $(this);
				$element.addClass('no-animate')
			})
		}
	}

	// sticky header
	$.fn.stickyHeader = function () {
		var $header = this,
			$body = $('body'),
			headerOffset,
			stickyH;

		function setHeigth() {
			$(".fix-space").remove();
			$header.removeClass('animated is-sticky slideInDown');
			$body.removeClass('hdr-sticky');
			headerOffset = $('#slidemenu', $header).offset().top;
			stickyH = $header.height() + headerOffset;
		}
		setHeigth();
		var prevWindow = window.innerWidth || $(window).width()
		$(window).bind('resize', function () {
			var currentWindow = window.innerWidth || $(window).width();
			if (currentWindow != prevWindow) {
				setHeigth()
				prevWindow = currentWindow;
			}
		});
		$(window).scroll(function () {
			//if (prevWindow < 992) return;
			var st = getCurrentScroll();
			if (st > headerOffset) {
				if (!$(".fix-space").length && !$body.hasClass('home')) {
					$header.after('<div class="fix-space"></div>');
					$(".fix-space").css({
						'height': $header.height() + 'px'
					});
				}
				$header.addClass('is-sticky animated slideInDown');
				$body.addClass('hdr-sticky');
			} else {
				$(".fix-space").remove();
				$header.removeClass('animated is-sticky slideInDown');
				$body.removeClass('hdr-sticky');
			}
		});

		function getCurrentScroll() {
			return window.pageYOffset || document.documentElement.scrollTop;
		}
	}

	if (plugins.stickyHeader.length) {
		$(plugins.stickyHeader).stickyHeader();
	}

	// Get Scrollbar Width
	/*function getScrollbarWidth() {
		var outer = document.createElement("div");
		outer.style.visibility = "hidden";
		outer.style.width = "100px";
		outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

		document.body.appendChild(outer);

		var widthNoScroll = outer.offsetWidth;
		// force scrollbars
		outer.style.overflow = "scroll";

		// add innerdiv
		var inner = document.createElement("div");
		inner.style.width = "100%";
		outer.appendChild(inner);

		var widthWithScroll = inner.offsetWidth;

		// remove divs
		outer.parentNode.removeChild(outer);

		return widthNoScroll - widthWithScroll;
	}*/

	// Click event to banner on mobile when action button is hidden
	function mobileClickBanner(wW) {
		if (wW < 768) {
			$(".banner-under-slider").on('click', function (e) {
				var $this = $(this);
				var target = $this.find('.action .btn').attr('href');
				if (target) $(location).attr('href', target);
				e.preventDefault();
			})
		} else {
			$(".banner-under-slider").unbind('click');
		}
	}

	// Ya Map
	function createMap(id) {

		ymaps.ready(init);

		function init() {
			var myMap = new ymaps.Map("ymap", 
				{
					center: [57.083559, 65.623024],
					zoom: 12,
					controls: ['fullscreenControl', 'trafficControl', 'zoomControl']
				}, {
					searchControlProvider: 'yandex#search'
				});

			myMap.geoObjects
				.add(new ymaps.Placemark([57.083559, 65.623024], {
					iconCaption: 'РњС‹ Р·РґРµСЃСЊ'
				}, {
						preset: 'islands#yellowFactoryIcon'
					}));
		}




	}


	function calcPrice() {
		var price = $("#inputMaterial  option:selected").data("value");
		$("#pricePerM3").html(price);

		var vol = $("#inputVolume").val();
		if (!$.isNumeric(vol) || vol < parseInt($("#inputVolume").attr("min"))) {
			vol = parseInt($("#inputVolume").attr("min"));
			$("#inputVolume").val(vol);
		};
		price = price * vol;
		$("#materialCost").html(price);


		var val = $("#inputPlace option:selected").data("value") * Math.max(5, vol);

		$("#deliveryPrice").html(val);
		price = parseInt(price) + parseInt(val);

		var $pump = $("#inputPump option:selected");
		val = $pump.data("value") + (Math.max($pump.data("volume"), vol) - $pump.data("volume")) * $pump.data("overprice");
		$("#pumpPrice").html(val);
		price = price + val;

		$("#totalPrice").html(price);
		$("#calculatedPrice").val(price);
	}
	// END FUNCTIONS

})(jQuery);