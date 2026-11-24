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

  // The "More" group in the desktop bar. Below 960px the button is hidden and
  // its links flatten into the mobile panel, so none of this runs there.
  var navMore = document.getElementById('navMore');
  var navMoreBtn = document.getElementById('navMoreBtn');

  function setMoreOpen(isOpen) {
    if (!navMore || !navMoreBtn) return;
    navMore.classList.toggle('open', isOpen);
    navMoreBtn.setAttribute('aria-expanded', String(isOpen));
  }

  if (navMore && navMoreBtn) {
    navMoreBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      setMoreOpen(!navMore.classList.contains('open'));
    });

    navMore.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMoreOpen(false); });
    });

    document.addEventListener('click', function (event) {
      if (!navMore.classList.contains('open')) return;
      if (navMore.contains(event.target)) return;
      setMoreOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !navMore.classList.contains('open')) return;
      setMoreOpen(false);
      navMoreBtn.focus();
    });

    // A menu left open at desktop width must not persist into the flattened
    // mobile layout, where "open" means nothing and the caret is gone.
    window.addEventListener('resize', function () {
      if (window.innerWidth <= 960) setMoreOpen(false);
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
    '.stem-card, .work-card, .stem-stats li, .explore-card'
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

// Close the More menu when keyboard focus leaves it
(function(){var nm=document.getElementById('navMore'),nb=document.getElementById('navMoreBtn');if(!nm||!nb)return;nm.addEventListener('focusout',function(e){if(!nm.contains(e.relatedTarget)){nm.classList.remove('open');nb.setAttribute('aria-expanded','false');}});})();

// Hero conversation starter: a tailored opener per visitor type
(function () {
  var box = document.getElementById('starter'); if (!box) return;
  var out = box.querySelector('.starter-out'), M = 'mailto:atindahhillary@gmail.com?subject=';
  var S = {
    founder: ['Building something for learners in hard-to-reach places? I design programmes and build the tools behind them, from Enkaji Play to Jamii Learn. Let us pressure-test your idea.', 'Pitch me your idea', M + 'Founder%3A%20'],
    ceo: ['Need a digital or EdTech programme that stands up to board and funder scrutiny? I build the delivery, the partnerships and the MEAL together, so the results hold.', 'Start the conversation', M + 'CEO%3A%20'],
    recruiter: ['Hiring a programme lead for digital transformation, EdTech or AI in education? The CV is one tap away, and I am happy to talk through any role.', 'Download my CV', 'Hillary-Atindah-George-Resume.pdf'],
    fellowship: ['Selecting leaders for an EdTech, AI or social impact fellowship? Start with the work: an IT Academy for pastoralist youth, 23+ schools, and tools mothers use at home.', 'See the selected work', '#work'],
    startup: ['An EdTech or AI startup heading into African classrooms? I help you design pilots, train teachers and prove impact before you scale.', 'Talk about a pilot', M + 'Startup%3A%20'],
    curious: ['Welcome. My bot knows the whole profile and answers in seconds. Ask it anything.', 'Ask the bot', '#bot']
  };
  box.querySelectorAll('[data-who]').forEach(function (b) {
    b.addEventListener('click', function () {
      var s = S[b.dataset.who]; if (!s) return;
      box.querySelectorAll('[data-who]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      out.innerHTML = '';
      var p = document.createElement('p'); p.textContent = s[0];
      var a = document.createElement('a'); a.className = 'starter-go'; a.textContent = s[1] + ' \u2192'; a.href = s[2];
      if (s[2] === 'Hillary-Atindah-George-Resume.pdf') a.setAttribute('download', '');
      if (s[2] === '#bot') a.addEventListener('click', function (e) { e.preventDefault(); var l = document.getElementById('abotLauncher'); if (l) l.click(); });
      out.appendChild(p); out.appendChild(a);
    });
  });
})();

// Capability orbit: five labelled pills travel clockwise around the headshot (desktop)
(function () {
  var wrap = document.querySelector('.hero-avatar-wrap'), box = wrap && wrap.querySelector('.orbits'); if (!box) return;
  var pills = [].slice.call(box.querySelectorAll('.orbit')), wide = window.matchMedia('(min-width: 1200px)');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches, angle = -90, last = 0, paused = false, raf = 0;
  function place() {
    var W = wrap.clientWidth, H = wrap.clientHeight, cx = W / 2, cy = H / 2;
    var half = Math.max.apply(null, pills.map(function (p) { return p.offsetWidth / 2; })), hh = pills[0].offsetHeight / 2;
    var av = wrap.querySelector('.hero-avatar'), R = (av ? av.offsetWidth / 2 : 110) + 12;
    var rx = R + half + 14, ry = R + hh + 30; // always clear of the photo
    pills.forEach(function (p, i) {
      var a = (angle + i * 72) * Math.PI / 180;
      p.style.transform = 'translate(' + (cx + rx * Math.cos(a) - p.offsetWidth / 2).toFixed(1) + 'px,' + (cy + ry * Math.sin(a) - p.offsetHeight / 2).toFixed(1) + 'px)';
    });
  }
  function tick(t) { if (last && !paused) angle = (angle + (t - last) * 0.006) % 360; last = t; place(); raf = requestAnimationFrame(tick); }
  function setup() {
    cancelAnimationFrame(raf); last = 0;
    if (!wide.matches) { box.classList.remove('is-orbiting'); pills.forEach(function (p) { p.style.transform = ''; }); return; }
    box.classList.add('is-orbiting'); place();
    if (!still) raf = requestAnimationFrame(tick);
  }
  wrap.addEventListener('mouseenter', function () { paused = true; });
  wrap.addEventListener('mouseleave', function () { paused = false; });
  document.addEventListener('visibilitychange', function () { last = 0; });
  (wide.addEventListener ? wide.addEventListener('change', setup) : wide.addListener(setup));
  window.addEventListener('resize', function () { if (wide.matches) place(); });
  setup();
})();

// Offline support: saves the site and the bot so both work without a connection (see sw.js)
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
}