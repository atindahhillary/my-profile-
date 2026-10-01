/* ATINDLET BOT
 *
 * A self-contained profile assistant for the site. It injects its own markup,
 * so a page only needs <script src="chatbot.js" defer></script>.
 *
 * It answers from the knowledge base below by keyword scoring. There is no
 * model call and no API key: this site is static, served from GitHub Pages and
 * Vercel with no backend, and any key shipped to the browser would be public.
 * Every answer here is lifted from what the pages already say, so the bot
 * cannot invent a claim the site does not make.
 *
 * It speaks about Hillary in the third person on purpose. A visitor should
 * never be left thinking they are messaging him directly.
 */
(function () {
  'use strict';

  var NAME = 'ATINDLET BOT';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------- knowledge
  // intent: keywords to match on, reply text, and the chips to offer next.
  var KB = [
    {
      id: 'greeting',
      keys: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'habari', 'jambo', 'sasa'],
      reply: "Hey. I'm " + NAME + ", here to answer questions about Hillary Atindah George: what he runs, what it produced, and how to reach him.",
      chips: ['What does he do?', 'Show me the numbers', 'Can I hire him?']
    },
    {
      id: 'who',
      keys: ['who', 'about', 'tell me about', 'background', 'profile', 'summary', 'introduce', 'bio'],
      reply: "Hillary is a STEM, EdTech and digital transformation leader based in Nairobi. He designs digital skills and STEM pathways that move people into paid work, then builds the data, AI and security systems that prove the result. The range runs across education, conservation, finance and software.",
      link: { href: 'about.html', label: 'Read the full About page' },
      chips: ['What is he working on now?', 'Show me the numbers', 'What are his skills?']
    },
    {
      id: 'impact',
      keys: ['numbers', 'impact', 'results', 'metrics', 'stats', 'reach', 'how many', 'evidence', 'proof', 'outcomes'],
      reply: "The headline figures: 5,000+ learners reached, 798+ teachers trained across 23+ schools, a 95% pass rate in the most recent cohort, 300+ girls mentored into STEM, and a KES 25M annual programme budget under management. Backend platforms he built earlier serve 50,000+ users.",
      chips: ['Tell me about the academy', 'How does he measure impact?', 'Can I hire him?']
    },
    {
      id: 'current',
      keys: ['now', 'current', 'currently', 'present', 'today', 'latest role', 'working on', 'hpf', 'academy', 'fellowship', 'mara', 'maasai', 'aitong'],
      reply: "He leads the HPF ICT Academy in Aitong, Maasai Mara as Skills Development Program Lead. It is a learn-to-earn fellowship for pastoralist youth across three tracks: web development, cybersecurity and data analytics. A cohort of 26 fellows closed at a 95% pass rate, 86% completion and 4.1/5 satisfaction, with graduates earning verified income through digital work platforms. He manages the KES 25M annual budget behind it.",
      link: { href: 'experience.html', label: 'See the full experience' },
      chips: ['What did he do before?', 'How does he measure impact?', 'Can I hire him?']
    },
    {
      id: 'experience',
      keys: ['experience', 'career', 'history', 'before', 'previous', 'past', 'worked', 'roles', 'journey', 'lewa', 'alatpres', 'selution'],
      reply: "Ten years across four sectors. Before the academy he built the Mt Kenya school digital literacy programme from zero across 23+ partner schools. Earlier: Assistant Financial Accountant and ICT Support at Lewa Wildlife Conservancy, and backend engineer at Alatpres Technologies on platforms serving 50,000+ users. He also co-leads programme design at SELution, a regional play-based learning initiative.",
      link: { href: 'experience.html', label: 'Open the timeline' },
      chips: ['What is he working on now?', 'What are his skills?', 'What has he been certified in?']
    },
    {
      id: 'skills',
      keys: ['skill', 'skills', 'competenc', 'good at', 'expertise', 'strengths', 'capabilit', 'what can he do', 'toolkit'],
      reply: "Six areas: programme design and delivery, data and M&E reporting, AI automation and ML, cybersecurity and digital safety, partnerships and stakeholders, and grants and proposal writing. Underneath those sit fellowship and cohort management, Trainer of Trainers, field operations, safeguarding and data protection.",
      link: { href: 'skills.html', label: 'See all competencies' },
      chips: ['Tell me about the cybersecurity work', 'What about AI?', 'How does he measure impact?']
    },
    {
      id: 'security',
      keys: ['security', 'cyber', 'cybersecurity', 'hacking', 'africahackon', 'safeguarding', 'data protection', 'infosec'],
      reply: "Practitioner level, and honest about it. Attack-surface hygiene, safeguarding learners online, Microsoft 365 security and staff training, plus data-protection compliance for learner records. His most recent training is AfricaHackon Academy, Cohort 5. Cybersecurity is also one of the three tracks the academy teaches.",
      link: { href: 'skills.html', label: 'See the skills page' },
      chips: ['What about AI?', 'What is he working on now?', 'Can I hire him?']
    },
    {
      id: 'ai',
      keys: ['ai', 'artificial intelligence', 'automation', 'machine learning', 'ml', 'llm', 'ai literacy', 'deepmind'],
      reply: "AI-assisted learning platforms, workflow automation, and AI literacy curricula built for low-bandwidth, low-device classrooms. He is certified through Experience AI with the Raspberry Pi Foundation and Google DeepMind, and took that straight into Kenyan classrooms so teachers can teach it themselves.",
      link: { href: 'stem.html', label: 'See the STEM work' },
      chips: ['Tell me about the cybersecurity work', 'What has he been certified in?', 'What are his skills?']
    },
    {
      id: 'me',
      keys: ['measure', 'm&e', 'mel', 'monitoring', 'evaluation', 'data', 'salesforce', 'power bi', 'reporting', 'dashboard', 'kpi', 'donor report'],
      reply: "He sets up the measurement, not just the delivery. Salesforce CRM and Power BI pipelines, KPI frameworks, donor analytics and data-protection compliance. At SELution he designed per-child measurement that rolls up to cluster dashboards. Weekly executive reports and monthly consolidated donor reports are part of the current role.",
      link: { href: 'work.html', label: 'See how engagements run' },
      chips: ['Can I hire him?', 'Show me the numbers', 'What are his skills?']
    },
    {
      id: 'stem',
      keys: ['stem', 'robot', 'robotics', 'olympiad', 'wro', 'girls', 'science', 'competition', 'wissafrica'],
      reply: "He judges and runs national robotics competitions, two World Robot Olympiad seasons across 2024 and 2025 as judge, mentor and organiser. Through WiSSAfrica he has reached 300+ girls with STEM mentorships, and 500+ students overall. The focus is the learners the sector usually skips: pastoralist, rural and low-resource classrooms.",
      link: { href: 'stem.html', label: 'Open the STEM page' },
      chips: ['What about AI?', 'What does he do in the community?', 'Show me the numbers']
    },
    {
      id: 'certs',
      keys: ['certif', 'qualification', 'credential', 'accredit', 'trained in', 'courses', 'lego', 'raspberry'],
      reply: "Certified Learning Through Play and SEL Facilitator (LEGO Foundation and Care for Education), Tech4Sustainability Champion (UN System Staff College and UNEP), Designing Ed-Tech Systems with EdTech Hub, Experience AI with the Raspberry Pi Foundation and Google DeepMind, plus grant writing and project management certificates. Latest cybersecurity training: AfricaHackon Academy, Cohort 5.",
      link: { href: 'certifications.html', label: 'See all certifications' },
      chips: ['What are his skills?', 'Where did he study?', 'Tell me about the cybersecurity work']
    },
    {
      id: 'education',
      keys: ['education', 'study', 'studied', 'degree', 'university', 'school did', 'bbit', 'meru', 'graduate'],
      reply: "BBIT, Bachelor of Business and Information Technology, from Meru University of Science and Technology, 2016 to 2020.",
      link: { href: 'about.html', label: 'More on the About page' },
      chips: ['What has he been certified in?', 'What did he do before?', 'What are his skills?']
    },
    {
      id: 'community',
      keys: ['community', 'volunteer', 'advisory', 'board', 'mentor', 'watoto', 'ishara', 'mukogodo', 'yali', 'conservation', 'climate'],
      reply: "Outside the day job: WiSSAfrica outreach and partnerships, Watoto Go Green advisory on climate learning, Ishara Foundation on Deaf inclusion and accessible digital learning, the Mukogodo Forest Wild Walk backing indigenous-led conservation, plus EdTech East Africa, I Choose Life and YALI.",
      link: { href: 'community.html', label: 'See community work' },
      chips: ['Tell me about STEM and robotics', 'What does he do?', 'How do I reach him?']
    },
    {
      id: 'teachers',
      keys: ['teacher', 'teaching', 'training', 'capacity', 'trainer of trainers', 'tot', 'classroom', 'curriculum', 'pedagog'],
      reply: "798+ teachers trained across 23+ schools, using a Trainer of Trainers model that scales past the workshop. He designed the curriculum himself and wrote the standard operating procedures behind the schools programme, grounded in Learning Through Play and Social Emotional Learning.",
      link: { href: 'work.html', label: 'Teacher capacity building' },
      chips: ['Can I hire him?', 'Show me the numbers', 'What are his skills?']
    },
    {
      id: 'hire',
      keys: ['hire', 'hiring', 'work with', 'consult', 'engage', 'available', 'services', 'freelance', 'contract', 'partner', 'collaborat', 'recruit', 'job', 'opportunit'],
      reply: "Yes. Founders, CEOs and programme leads bring him in when a digital skills or EdTech initiative has to produce evidence rather than activity. Engagements run as short advisory sprints or full delivery: programme design and launch, impact measurement and reporting, teacher capacity building, AI and automation adoption. He is Nairobi-based, open to fieldwork and rural travel, on-site and hybrid.",
      link: { href: 'work.html', label: 'See the engagement types' },
      chips: ['How do I reach him?', 'How does he measure impact?', 'Show me the numbers']
    },
    {
      id: 'contact',
      keys: ['contact', 'reach', 'email', 'phone', 'call', 'linkedin', 'get in touch', 'talk to', 'speak', 'message', 'hire him directly'],
      reply: "Email atindahhillary@gmail.com or call +254 790 780 579. He is also on LinkedIn. Based in Nairobi, Kenya, available on-site and hybrid, and open to fieldwork and rural travel.",
      link: { href: 'contact.html', label: 'Open the contact page' },
      chips: ['Can I hire him?', 'Can I see his resume?', 'What does he do?']
    },
    {
      id: 'resume',
      keys: ['resume', 'cv', 'download', 'pdf'],
      reply: "The resume is on the site as a PDF, linked from the hero on the home page and from the contact page.",
      link: { href: 'contact.html', label: 'Go to the download' },
      chips: ['How do I reach him?', 'What did he do before?', 'Can I hire him?']
    },
    {
      id: 'location',
      keys: ['where', 'located', 'location', 'based', 'nairobi', 'kenya', 'remote', 'travel', 'relocat'],
      reply: "Nairobi, Kenya. He works on-site and hybrid, and is open to fieldwork and rural travel, which the Maasai Mara and Mt Kenya programmes both required.",
      link: { href: 'contact.html', label: 'Contact details' },
      chips: ['Can I hire him?', 'What is he working on now?', 'How do I reach him?']
    },
    {
      id: 'funding',
      keys: ['budget', 'grant', 'proposal', 'funder', 'donor', 'fundrais', 'money', 'concept note', 'ingo'],
      reply: "He manages a KES 25M annual programme budget and writes the funding behind the work: concept notes, donor proposals, budget development and impact reporting. He negotiated the Phase 2 partnership structure with Power Learn Project Africa, and reports weekly to partners and leadership.",
      link: { href: 'work.html', label: 'See consultancy options' },
      chips: ['How does he measure impact?', 'Can I hire him?', 'Show me the numbers']
    },
    {
      id: 'bot',
      keys: ['who are you', 'what are you', 'your name', 'atindlet', 'chatbot', 'a robot'],
      re: /\bare\s+you\b[\s\w]*\b(hillary|real|human|a?\s*bot|ai|person|him)\b/,
      reply: "I'm " + NAME + ", a small assistant built into this site. I am not Hillary and I am not an AI model. I answer from a fixed set of facts drawn from these pages, so if I do not know something I will say so rather than guess. For anything beyond the profile, email him directly.",
      chips: ['How do I reach him?', 'What does he do?', 'Show me the numbers']
    },
    {
      id: 'thanks',
      keys: ['thanks', 'thank you', 'asante', 'cheers', 'appreciate', 'great', 'nice', 'cool', 'bye', 'goodbye'],
      reply: "Asante. If you want to take it further, the contact page has his email, phone and LinkedIn.",
      link: { href: 'contact.html', label: 'Get in touch' },
      chips: ['Can I hire him?', 'Show me the numbers']
    }
  ];

  var OPENERS = ['What does he do?', 'Show me the numbers', 'Can I hire him?', 'How do I reach him?'];

  var FALLBACK = "I don't have that one. I only know what these pages say about Hillary's work, so I'd rather point you somewhere real than guess. Try one of these, or email atindahhillary@gmail.com.";

  // ------------------------------------------------------------------ matcher
  function normalise(s) {
    return (' ' + s.toLowerCase().replace(/[^a-z0-9&+ ]+/g, ' ').replace(/\s+/g, ' ') + ' ');
  }

  function match(input) {
    var q = normalise(input);
    var best = null, bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var intent = KB[i], score = 0;
      if (intent.re && intent.re.test(q)) score += 6;
      for (var k = 0; k < intent.keys.length; k++) {
        var key = intent.keys[k];
        // whole-word for short keys, substring for longer/stemmed ones
        var hit = key.length <= 3 ? q.indexOf(' ' + key + ' ') !== -1 : q.indexOf(key) !== -1;
        if (hit) score += key.length > 6 ? 3 : 2;
      }
      if (score > bestScore) { bestScore = score; best = intent; }
    }
    return bestScore > 0 ? best : null;
  }

  // ---------------------------------------------------------------- rendering
  var el = {};
  var open = false;

  function node(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function build() {
    var root = node('div', 'abot');

    var launcher = node('button', 'abot-launcher');
    launcher.type = 'button';
    launcher.id = 'abotLauncher';
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-controls', 'abotPanel');
    launcher.setAttribute('aria-label', 'Open ' + NAME + ', the profile assistant');
    launcher.innerHTML =
      '<span class="abot-launcher-mark" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 3c4.97 0 9 3.36 9 7.5 0 4.14-4.03 7.5-9 7.5a10.6 10.6 0 0 1-2.6-.32L5 20l1.06-3.18C4.17 15.46 3 13.1 3 10.5 3 6.36 7.03 3 12 3z" fill="currentColor"/></svg>' +
      '</span><span class="abot-launcher-text">Ask ' + NAME + '</span>';

    var panel = node('div', 'abot-panel');
    panel.id = 'abotPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', NAME + ', profile assistant');
    panel.hidden = true;

    var head = node('div', 'abot-head');
    var title = node('div', 'abot-title');
    title.appendChild(node('strong', null, NAME));
    title.appendChild(node('span', 'abot-sub', 'Ask about Hillary’s work'));
    var close = node('button', 'abot-close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close ' + NAME);
    close.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';
    head.appendChild(title);
    head.appendChild(close);

    var log = node('div', 'abot-log');
    log.id = 'abotLog';
    log.setAttribute('role', 'log');
    log.setAttribute('aria-live', 'polite');
    log.setAttribute('aria-atomic', 'false');

    var chips = node('div', 'abot-chips');
    chips.setAttribute('aria-label', 'Suggested questions');

    var form = node('form', 'abot-form');
    var label = node('label', 'abot-sr', 'Type your question for ' + NAME);
    label.setAttribute('for', 'abotInput');
    var input = node('input', 'abot-input');
    input.id = 'abotInput';
    input.type = 'text';
    input.autocomplete = 'off';
    input.placeholder = 'Ask about his work…';
    var send = node('button', 'abot-send');
    send.type = 'submit';
    send.setAttribute('aria-label', 'Send question');
    send.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 12L4 4l6 8-6 8z" fill="currentColor"/></svg>';
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(send);

    panel.appendChild(head);
    panel.appendChild(log);
    panel.appendChild(chips);
    panel.appendChild(form);
    root.appendChild(panel);
    root.appendChild(launcher);
    document.body.appendChild(root);

    el = { root: root, launcher: launcher, panel: panel, log: log, chips: chips, form: form, input: input, close: close };
  }

  function scrollLog() { el.log.scrollTop = el.log.scrollHeight; }

  function say(who, text, link) {
    var row = node('div', 'abot-msg abot-' + who);
    var bubble = node('div', 'abot-bubble');
    bubble.appendChild(node('p', null, text));
    if (link) {
      var a = node('a', 'abot-link', link.label + ' →');
      a.href = link.href;
      bubble.appendChild(a);
    }
    row.appendChild(bubble);
    el.log.appendChild(row);
    scrollLog();
  }

  function setChips(list) {
    el.chips.innerHTML = '';
    (list || OPENERS).forEach(function (q) {
      var b = node('button', 'abot-chip', q);
      b.type = 'button';
      b.addEventListener('click', function () { ask(q); });
      el.chips.appendChild(b);
    });
  }

  function typing(done) {
    if (reduceMotion) { done(); return; }
    var row = node('div', 'abot-msg abot-bot abot-typing');
    row.innerHTML = '<div class="abot-bubble"><span></span><span></span><span></span></div>';
    el.log.appendChild(row);
    scrollLog();
    window.setTimeout(function () { row.remove(); done(); }, 480);
  }

  function ask(text) {
    var q = (text || '').trim();
    if (!q) return;
    say('you', q);
    el.input.value = '';
    var intent = match(q);
    typing(function () {
      if (intent) {
        say('bot', intent.reply, intent.link);
        setChips(intent.chips);
      } else {
        say('bot', FALLBACK);
        setChips(OPENERS);
      }
    });
  }

  // ------------------------------------------------------------------ opening
  function setOpen(next) {
    open = next;
    el.panel.hidden = !next;
    el.root.classList.toggle('abot-open', next);
    el.launcher.setAttribute('aria-expanded', String(next));
    if (next) {
      if (!el.log.childElementCount) {
        say('bot', "Hi, I'm " + NAME + ". Ask me anything about Hillary Atindah George: the programmes he runs, the numbers behind them, or how to work with him.");
        setChips(OPENERS);
      }
      el.input.focus();
    } else {
      el.launcher.focus();
    }
  }

  function wire() {
    el.launcher.addEventListener('click', function () { setOpen(!open); });
    el.close.addEventListener('click', function () { setOpen(false); });
    el.form.addEventListener('submit', function (e) { e.preventDefault(); ask(el.input.value); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) { setOpen(false); }
    });
  }

  function autoOpen() {
    // Pops out on arrival, but once per browsing session: re-opening it on
    // every page of a ten-page site would be hostile.
    var KEY = 'atindlet-bot-greeted';
    var seen;
    try { seen = window.sessionStorage.getItem(KEY); } catch (err) { seen = '1'; }
    if (seen) return;

    function pop() {
      if (open) return;
      try { window.sessionStorage.setItem(KEY, '1'); } catch (err) { /* private mode */ }
      setOpen(true);
    }

    // The home page hero fills the viewport: the portrait on the right, the
    // headline, summary and both calls to action on the left. A panel big
    // enough to hold a conversation covers one or the other wherever it sits,
    // and burying "Let's work together" is the worst of those options. So on
    // the hero page it waits until the hero is mostly scrolled past, then
    // pops. Every other page opens on the timer, nothing there to block.
    var hero = document.querySelector('.hero');
    if (!hero || !('IntersectionObserver' in window)) {
      window.setTimeout(pop, 1400);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      if (entries[0].intersectionRatio < 0.4) { io.disconnect(); pop(); }
    }, { threshold: [0, 0.4, 1] });
    io.observe(hero);
  }

  function init() {
    if (document.querySelector('.abot')) return;
    build();
    wire();
    autoOpen();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
