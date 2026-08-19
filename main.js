(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Current year in the footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Header scroll state + reading progress bar
  var header = document.getElementById('siteHeader');
  var progressBar = document.getElementById('progressBar');
  var ticking = false;

  function updateScrollState() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }
    if (progressBar) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }

  if (header || progressBar) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateScrollState();
  }

  // Mobile navigation
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  function setNavOpen(isOpen) {
    if (!mainNav || !navToggle) return;
    mainNav.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      setNavOpen(!mainNav.classList.contains('open'));
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setNavOpen(false); });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mainNav.classList.contains('open')) {
        setNavOpen(false);
        navToggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (!mainNav.classList.contains('open')) return;
      if (mainNav.contains(event.target) || navToggle.contains(event.target)) return;
      setNavOpen(false);
    });
  }

  // Animated counters: run from zero to target over 3 seconds when scrolled into view
  var COUNT_DURATION = 3000;
  var counters = document.querySelectorAll('.count');

  function formatCount(value, suffix) {
    return value.toLocaleString('en-US') + suffix;
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var elapsed = timestamp - start;
      var progress = Math.min(elapsed / COUNT_DURATION, 1);
      // ease-out so the number decelerates into its final value
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(Math.round(target * eased), suffix);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = formatCount(target, suffix);
      }
    }

    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      // leave the final values already present in the markup
      counters.forEach(function (el) {
        el.textContent = formatCount(parseFloat(el.getAttribute('data-target')), el.getAttribute('data-suffix') || '');
      });
    } else {
      counters.forEach(function (el) {
        el.textContent = formatCount(0, el.getAttribute('data-suffix') || '');
      });

      var countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCounter(entry.target);
              countObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );

      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  // Scroll reveal animations
  var revealTargets = document.querySelectorAll(
    '.skill-card, .tl-item, .achieve-card, .cert-item, .community-card, ' +
    '.about-copy, .about-facts, .contact-cards, .impact-item, .chip-row, ' +
    '.stem-card, .work-card, .stem-stats li'
  );

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach(function (el) { observer.observe(el); });
})();
