/* Ask Blue Sky — in-browser assistant for Blue Sky Digital.
   Runs entirely client-side: no API keys, no data leaves the visitor's computer. */
(function () {
  "use strict";

  var CONTACT_EMAIL = "hello@blueskydigital.ca";

  var KB = [
    {
      keys: ["price","pricing","cost","how much","fee","fees","charge","rates","quote","budget","expensive","afford"],
      a: "Three fixed packages: Village Web Presence $1,850 (website, email, training), Privacy &amp; Records $4,950 (POPA/ATIA readiness — gap assessment, program documents, retention schedule, training), and Full Compliance Partner $9,500 (everything plus digitization, a PIA, and follow-up). Custom software starts at $6,500. All prices fixed in writing before work starts — and my price-match promise beats any lower written quote for the same scope by 10%."
    },
    {
      keys: ["price match","price-match","beat","cheaper","lower quote","competitor","undercut","10%"],
      a: "My price-match promise: if you get a lower written quote for the same scope, I'll beat it by 10%. Send the quote with your assessment request — same work, less money, still fixed-price in writing. No fine print."
    },
    {
      keys: ["package","packages","services","what do you do","what do you offer","include","included"],
      a: "Three packages plus custom work: (1) Village Web Presence $1,850 — website, email setup, training, 1 year of updates. (2) Privacy &amp; Records $4,950 — gap assessment, privacy management program, records inventory, retention schedule, request workflow, staff training. (3) Full Compliance Partner $9,500 — everything plus records digitization, a PIA for one project, 6-month review, priority support. Custom software (records vaults, portals, automation) from $6,500. Details are on the Packages &amp; Pricing page."
    },
    {
      keys: ["web","website","site","online","web presence","email","hosting","domain"],
      a: "The Village Web Presence package ($1,850) is a clean, mobile-friendly website with your news, council info, forms and contacts — plus email setup, staff training, and 1 year of updates. An optional $45/month care plan keeps it maintained afterward. Most sites are done in 2–3 weeks."
    },
    {
      keys: ["popa","atia","privacy act","access to information","legislation","law","legal","regulation","statute","compliance","compliant","30 business"],
      a: "POPA (Protection of Privacy Act) and the updated ATIA (Access to Information Act) apply to every Alberta municipality — including villages of any size. The Privacy &amp; Records Package ($4,950) covers readiness: gap assessment, privacy management program documents, records inventory, retention schedule, request workflow templates, and staff training. Note: I provide practical implementation work based on published legislation — not legal advice. Your municipality's counsel confirms what applies to you, and I work alongside them gladly."
    },
    {
      keys: ["legal advice","lawyer","attorney","disclaimer","liable","liability","is this legal"],
      a: "Straight answer: I am not a law firm and this is not legal advice. I provide practical privacy-program, records, and technology work based on published legislation and official guidance. Your municipality's legal advisor confirms what applies to your situation — I work alongside them happily. I never overstate what I do; that protects you and me."
    },
    {
      keys: ["assessment","free","first step","getting started","start","begin","how do we","what happens next","process","how does it work"],
      a: "The free assessment is the easy first step: I visit your office (or we meet by video), spend about an hour learning how you handle records and requests today, and hand you a written gap summary — yours to keep, no obligation. If you want to proceed, you get a fixed written quote and we book the work. You can request one from the Free Assessment form on this site."
    },
    {
      keys: ["contract","agreement","terms","scope","sign","commitment","obligation","cancel"],
      a: "Everything is agreed in writing before work starts: fixed scope, fixed price, 50% deposit to book your dates and 50% on completion. If something extra comes up, I quote it separately and you approve first — never surprise invoices. If delivered work doesn't match the written scope, I fix it free until it does."
    },
    {
      keys: ["payment","pay","invoice","cheque","check","purchase order","e-transfer","deposit","gst","tax"],
      a: "Payment is simple: 50% deposit to book, 50% on completion. I accept cheque, e-transfer, and municipal purchase orders — whatever your process is — and provide proper invoices with GST numbers your administrator can process easily."
    },
    {
      keys: ["one person","solo","one-person","sick","disappear","bus","hit by a bus","backup","who are you","about you","about yourself","yourself","shad","story","background","experience"],
      a: "I'm Shad Hunter, founder of Blue Sky Digital — a self-taught developer who builds privacy, records, and web solutions for small Alberta municipalities. Why villages? Because big firms quote big-firm prices and small offices get stuck. With me you get the person who does the work, directly. Safeguards: your files live in your systems, everything is documented as we go, work is staged in deliverables, and I keep trusted colleagues I can bring in if ever needed."
    },
    {
      keys: ["trust","deliver","reliable","references","proof","guarantee","satisfied","refund","unhappy","quality"],
      a: "Fair question. Three concrete reasons to trust the work: (1) staged deliverables you approve as we go — you see progress, not promises; (2) payment follows delivery beyond the booking deposit; (3) the free assessment is a no-risk sample of how I operate. And if delivered work doesn't match the written scope, I fix it at no charge until it does. My business runs on word of mouth in small communities — unhappy clients aren't in my plan."
    },
    {
      keys: ["data","security","secure","encrypted","confidential","nda","non-disclosure","private","privacy policy","records safe"],
      a: "Your data stays yours: project files are stored encrypted, handed over or securely deleted at project end (your choice), and never shared, sold, or reused. I'm happy to sign your confidentiality or NDA before we start. And yes — this chat assistant runs entirely in your browser; nothing you type here ever leaves your computer."
    },
    {
      keys: ["time","how long","timeline","turnaround","when","deadline","schedule","weeks","months","fast","rush"],
      a: "Typical timelines: websites 2–3 weeks, Privacy &amp; Records Package usually within a month of the assessment, Full Compliance Partner scoped at the assessment. You get a written timeline before we start and I keep you posted along the way. Budget season is here — the sooner we assess, the sooner you're covered."
    },
    {
      keys: ["staff","training","teach","learn","documentation","support","help","after","ongoing","maintenance","care plan"],
      a: "Training is plain-language and hands-on (a half-day for the Privacy &amp; Records Package), documentation is written for humans, and I stay available after handover. Websites include 1 year of updates with an optional $45/month care plan after. Full Compliance Partner includes a 6-month review and priority phone support for a year."
    },
    {
      keys: ["own","ownership","who owns","lock-in","portable","switch","leave","hostage"],
      a: "You own everything: documents, templates, systems, website files, logins — in your municipality's name and accounts. No lock-in, no proprietary formats. If you ever hire someone else, they'll find everything in order. That's deliberate."
    },
    {
      keys: ["custom","software","system","build","app","portal","records vault","automation","prototype","demo","tool"],
      a: "I build custom systems too — records vaults, request tracking pipelines, audit trails, resident portals — starting at $6,500, always fixed-price after the free assessment. I even bring a working prototype you can click through in person (it runs on my laptop, no internet needed). Ask me to show you at our meeting."
    },
    {
      keys: ["tiny","too small","population","under 500","we are just","little","village","municipality"],
      a: "There's no such thing as too small — POPA and ATIA apply regardless of population. Villages under 500 people are exactly who I built this business for. The work is the same as for a city; my fixed prices are built for small budgets."
    },
    {
      keys: ["where","area","region","service area","travel","come to us","remote","rural","distance","alberta","province"],
      a: "I serve municipalities anywhere in Alberta — in person whenever it helps (assessments, kickoffs, council meetings), and by phone, email, or video for the rest. Being rural or remote is not a problem; that's the whole market I serve."
    },
    {
      keys: ["council","meeting","presentation","pitch","agenda","vote","approve"],
      a: "Happy to present to council — in person or by video. I bring documentation formatted for agenda packages, plain-language answers to every question (see the Questions &amp; Concerns page), and a working software prototype to click through. Councils decide best when they can see and touch the thing."
    },
    {
      keys: ["procurement","bid","rfp","tender","threshold","purchasing"],
      a: "These package prices usually sit well under the thresholds that require open bidding — small purchases can often be approved administratively. If your municipality has specific procurement policies, tell me the threshold at the assessment and I'll structure the engagement to fit. If a formal process is required, I provide written quotes formatted for council agendas."
    },
    {
      keys: ["insurance","risk","coverage","wcb","bond"],
      a: "Honest answer: as a sole proprietor I keep overhead lean — that's exactly why my prices beat the big firms. At the assessment I'll walk you through what that means for your risk management and any vendor terms your municipality requires. Tell me early what your procurement rules require and we'll figure out the right structure together."
    },
    {
      keys: ["already","existing","have some","in place","partially","redo","duplicate"],
      a: "You only pay for what you need. The free assessment maps what you already have versus the actual gaps, and the written scope reflects that. If you're already in good shape, I'll tell you so — and the gap summary is yours either way. A vendor who says 'you don't need me for that part' is the vendor you want."
    },
    {
      keys: ["print","brochure","pdf","download","share","send","councillor","colleague"],
      a: "Every page on this site prints cleanly for agenda packages (use your browser's Print command). The Questions &amp; Concerns page is designed to be sent to council members before a meeting — it answers the doubts people raise in the room."
    },
    {
      keys: ["contact","email","phone","call","reach","talk","human","person","message","touch"],
      a: "Easiest: fill in the Free Assessment form on this site. Or email hello@blueskydigital.ca directly — a real person (me) replies within two business days. If you'd rather talk first, leave your phone number in the form and I'll call."
    },
    {
      keys: ["chat","bot","assistant","ai","robot","who am i talking","real person","automated"],
      a: "You're talking to Ask Blue Sky — my instant-answer assistant. It runs entirely in your browser (nothing you type leaves your computer — handy for a privacy business!). It knows my services, prices, and policies cold. For anything beyond that, email hello@blueskydigital.ca and you'll get me, personally, within two business days."
    },
    {
      keys: ["after the project","what happens after","when you're done","handover","after completion","wrap up","afterwards"],
      a: "Your choice. Websites include a year of updates with an optional $45/month care plan after that. The Full Compliance Partner includes a 6-month review and priority phone support for a year. For anything else you can call me any time — existing clients get my best response times. No obligation to keep me on; plenty of villages just keep my number for when something comes up."
    },
    {
      keys: ["hours","when are you","response time","how fast","wait"],
      a: "Inquiries get a reply within two business days — usually faster. Existing clients get priority response times. If a deadline is bearing down on you, say so in the message and I'll tell you honestly whether I can meet it."
    }
  ];
  // ---------------- Matching ----------------
  function normalize(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").replace(/\s+/g, " ").trim();
  }

  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // word-boundary hit test ("own" must not match inside "owns"/"website"),
  // tolerant of simple plurals ("order" matches "orders")
  function wordHit(q, k) {
    var variants = [k];
    if (/s$/.test(k)) variants.push(k.slice(0, -1), k.slice(0, -2) + "y");
    else variants.push(k + "s", k + "es");
    if (k.endsWith("y")) variants.push(k.slice(0, -1) + "ies");
    return variants.some(function (v) {
      return new RegExp("(^|[^a-z0-9])" + escapeRe(v) + "($|[^a-z0-9])").test(q);
    });
  }

  function bestMatch(question) {
    var q = normalize(question);
    if (!q) return null;
    var words = q.split(" ");
    var best = null, bestScore = 0;

    KB.forEach(function (entry) {
      var score = 0;
      entry.keys.forEach(function (k) {
        k = normalize(k);
        if (!k) return;
        if (wordHit(q, k)) {
          // phrase hits weigh more; longer keywords weigh more
          score += k.indexOf(" ") !== -1 ? 3 : Math.min(2, 1 + k.length / 8);
        } else {
          // plural/variant credit ("price" ~ "prices") — distinctive stems only (5+ chars)
          var stem = k.split(" ")[0].slice(0, 5);
          if (stem.length >= 5 && words.some(function (w) { return w.indexOf(stem) === 0; })) {
            score += 0.5;
          }
        }
      });
      if (score > bestScore) { bestScore = score; best = entry; }
    });

    return bestScore >= 1 ? best : null;
  }

  var GREETING = "Hi! I'm Ask Blue Sky 👋 I can answer anything about my services, prices, process, or policies — instantly, and nothing you type leaves your computer. What would you like to know?";

  var CHIPS = [
    "What does it cost?",
    "Is this legal advice?",
    "What's the free assessment?",
    "How is our data protected?",
    "What if we're a tiny village?",
    "How do we start?"
  ];

  var FALLBACK = "Good question — that one's outside my knowledge, so I won't guess. Email " +
    "<a href=\"mailto:" + CONTACT_EMAIL + "?subject=Question%20from%20the%20website\">" + CONTACT_EMAIL + "</a> " +
    "and you'll get a personal answer within two business days — or click \"Free assessment\" at the top and tell me there.";

  // ---------------- UI ----------------
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  var state = { open: false };

  function buildWidget() {
    var wrap = el("div", "bsky-chat");
    wrap.innerHTML =
      '<button class="bsky-fab" aria-expanded="false" aria-controls="bsky-panel">' +
        '<span class="bsky-fab-icon" aria-hidden="true">💬</span>' +
        '<span class="bsky-fab-text">Ask Blue Sky</span>' +
      '</button>' +
      '<div class="bsky-panel" id="bsky-panel" role="dialog" aria-label="Ask Blue Sky assistant" aria-modal="false">' +
        '<div class="bsky-head">' +
          '<div>' +
            '<p class="bsky-title">Ask Blue Sky</p>' +
            '<p class="bsky-sub">Instant answers · nothing leaves your browser</p>' +
          '</div>' +
          '<button class="bsky-close" aria-label="Close chat">×</button>' +
        '</div>' +
        '<div class="bsky-log" role="log" aria-live="polite"></div>' +
        '<div class="bsky-chips"></div>' +
        '<form class="bsky-form">' +
          '<label for="bsky-input" class="skip">Your question</label>' +
          '<input id="bsky-input" type="text" placeholder="Ask about prices, process, POPA…" autocomplete="off">' +
          '<button type="submit" aria-label="Send">➤</button>' +
        '</form>' +
        '<p class="bsky-foot">Answers are provided for general information only and are not legal advice.</p>' +
      '</div>';
    document.body.appendChild(wrap);

    var log = wrap.querySelector(".bsky-log");
    var chipsBox = wrap.querySelector(".bsky-chips");
    var form = wrap.querySelector(".bsky-form");
    var input = wrap.querySelector("#bsky-input");
    var fab = wrap.querySelector(".bsky-fab");
    var panel = wrap.querySelector(".bsky-panel");
    var closeBtn = wrap.querySelector(".bsky-close");

    function addMsg(who, html) {
      var m = el("div", "bsky-msg bsky-" + who, html);
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
      return m;
    }

    function botReply(html, delay) {
      var typing = addMsg("bot bsky-typing", "<span></span><span></span><span></span>");
      setTimeout(function () {
        typing.remove();
        addMsg("bot", html);
      }, delay || 420);
    }

    function ask(q) {
      addMsg("user", escapeHtml(q));
      var m = bestMatch(q);
      botReply(m ? m.a : FALLBACK, 380 + Math.min(600, q.length * 12));
    }

    function escapeHtml(s) {
      return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
        return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
      });
    }

    CHIPS.forEach(function (c) {
      var b = el("button", "bsky-chip", escapeHtml(c));
      b.type = "button";
      b.addEventListener("click", function () { ask(c); });
      chipsBox.appendChild(b);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) return;
      input.value = "";
      ask(q);
    });

    function setOpen(open) {
      state.open = open;
      panel.classList.toggle("open", open);
      fab.setAttribute("aria-expanded", String(open));
      if (open) {
        if (!log.childNodes.length) botReply(GREETING, 260);
        setTimeout(function () { input.focus(); }, 260);
      } else {
        fab.focus();
      }
    }

    fab.addEventListener("click", function () { setOpen(!state.open); });
    closeBtn.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.open) setOpen(false);
    });

    return { open: setOpen };
  }

  var widget = null;
  function ensureWidget() {
    if (!widget) widget = buildWidget();
    return widget;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureWidget);
  } else {
    ensureWidget();
  }
})();