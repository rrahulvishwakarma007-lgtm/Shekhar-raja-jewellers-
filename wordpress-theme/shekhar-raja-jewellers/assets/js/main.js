/**
 * Shekhar Raja Jewellers - Main JavaScript
 * Premium Luxury Jewellery Theme
 * 
 * @package Shekhar_Raja_Jewellers
 */

(function($) {
    'use strict';

    // ============================================
    // DOCUMENT READY
    // ============================================
    $(document).ready(function() {
        initMobileMenu();
        initHeroSlider();
        initProductFilter();
        initAnimations();
        initSmoothScroll();
    });

    // ============================================
    // MOBILE MENU
    // ============================================
    function initMobileMenu() {
        const $toggle = $('.mobile-menu-toggle');
        const $menu = $('.mobile-menu');
        const $overlay = $('.mobile-menu-overlay');

        $toggle.on('click', function() {
            $(this).toggleClass('active');
            $menu.toggleClass('active');
            $overlay.toggleClass('active');
            $('body').toggleClass('menu-open');
        });

        $overlay.on('click', function() {
            $toggle.removeClass('active');
            $menu.removeClass('active');
            $overlay.removeClass('active');
            $('body').removeClass('menu-open');
        });

        // Close on menu link click
        $('.mobile-nav-menu a').on('click', function() {
            $toggle.removeClass('active');
            $menu.removeClass('active');
            $overlay.removeClass('active');
            $('body').removeClass('menu-open');
        });
    }

    // ============================================
    // HERO SLIDER
    // ============================================
    function initHeroSlider() {
        const $slides = $('.slide');
        const $indicators = $('.indicator');
        const $prevBtn = $('.slider-arrow.prev');
        const $nextBtn = $('.slider-arrow.next');
        let currentSlide = 0;
        let slideInterval;
        const slideCount = $slides.length;
        const slideDuration = 4500; // 4.5 seconds

        if (slideCount === 0) return;

        function goToSlide(index) {
            // Wrap around
            if (index >= slideCount) index = 0;
            if (index < 0) index = slideCount - 1;

            // Update slides
            $slides.removeClass('active');
            $slides.eq(index).addClass('active');

            // Update indicators
            $indicators.removeClass('active');
            $indicators.eq(index).addClass('active');

            currentSlide = index;

            // Reset interval
            resetInterval();
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, slideDuration);
        }

        // Event listeners
        $nextBtn.on('click', function(e) {
            e.preventDefault();
            nextSlide();
        });

        $prevBtn.on('click', function(e) {
            e.preventDefault();
            prevSlide();
        });

        $indicators.on('click', function() {
            const index = $(this).data('index');
            goToSlide(index);
        });

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        $('.hero-slider').on('touchstart', function(e) {
            touchStartX = e.originalEvent.touches[0].clientX;
        });

        $('.hero-slider').on('touchend', function(e) {
            touchEndX = e.originalEvent.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }

        // Start auto-slide
        resetInterval();

        // Pause on hover
        $('.hero-slider').hover(
            function() { clearInterval(slideInterval); },
            function() { resetInterval(); }
        );
    }

    // ============================================
    // PRODUCT FILTER
    // ============================================
    function initProductFilter() {
        const $tabs = $('.filter-tab');
        const $products = $('.product-card');
        const $count = $('.results-count .count');

        $tabs.on('click', function() {
            const filter = $(this).data('filter');

            // Update active tab
            $tabs.removeClass('active');
            $(this).addClass('active');

            // Filter products
            if (filter === 'all') {
                $products.fadeIn(300);
            } else {
                $products.hide();
                $products.filter('[data-category="' + filter + '"]').fadeIn(300);
            }

            // Update count
            setTimeout(function() {
                const visibleCount = $products.filter(':visible').length;
                $count.text(visibleCount);
            }, 350);
        });

        // Initial count
        $count.text($products.length);
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    function initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements
        $('.category-item, .product-card, .trust-item, .featured-card').each(function() {
            observer.observe(this);
        });

        // Header scroll effect
        $(window).on('scroll', function() {
            const scrollTop = $(this).scrollTop();
            const $header = $('.main-header');
            const $topBar = $('.top-bar');

            if (scrollTop > 50) {
                $header.addClass('scrolled');
                $topBar.addClass('hidden');
            } else {
                $header.removeClass('scrolled');
                $topBar.removeClass('hidden');
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    function initSmoothScroll() {
        $('a[href^="#"]').on('click', function(e) {
            const target = $(this).attr('href');
            
            if (target === '#') return;
            
            const $target = $(target);
            
            if ($target.length) {
                e.preventDefault();
                
                $('html, body').animate({
                    scrollTop: $target.offset().top - 100
                }, 800);
            }
        });
    }

    // ============================================
    // 3D TILT EFFECT
    // ============================================
    function init3DTilt() {
        $('.product-card, .category-item').on('mousemove', function(e) {
            const $card = $(this);
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            $card.css('transform', 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)');
        }).on('mouseleave', function() {
            $(this).css('transform', 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)');
        });
    }

    // Initialize 3D tilt on desktop only
    if (window.innerWidth > 1024) {
        init3DTilt();
    }

    // ============================================
    // LAZY LOADING IMAGES
    // ============================================
    function initLazyLoad() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            lazyImages.forEach(function(img) {
                img.src = img.dataset.src;
            });
        }
    }

    initLazyLoad();

    // ============================================
    // PRELOADER
    // ============================================
    $(window).on('load', function() {
        $('.preloader').fadeOut(500);
    });

    // ============================================
    // AJAX GOLD RATE UPDATE (Admin)
    // ============================================
    window.updateGoldRate = function(rate) {
        return $.ajax({
            url: srjData.ajaxUrl,
            type: 'POST',
            data: {
                action: 'srj_update_gold_rate',
                nonce: srjData.nonce,
                rate: rate
            }
        });
    };

    // ============================================
    // WHATSAPP HELPERS
    // ============================================
    window.getWhatsAppLink = function(message) {
        const number = srjData.whatsapp.replace(/[^0-9]/g, '');
        let url = 'https://wa.me/' + number;
        if (message) {
            url += '?text=' + encodeURIComponent(message);
        }
        return url;
    };

})(jQuery);
