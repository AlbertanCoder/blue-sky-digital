/* quote.js — the interactive quote quiz (car-insurance style).
   Free-text answers can wildly change the outcome: every answer is handed
   to the LLM estimator at the end, including their own words. */
(function () {
  "use strict";

  var STEPS = [
    {
      q: "What kind of community are you?",
      hint: "This helps me size everything honestly.",
      key: "community",
      options: [
        { label: "Village", note: "under ~1,000 people" },
        { label: "Summer village", note: "seasonal community" },
        { label: "Town", note: "1,000–10,000 people" },
        { label: "Small city / municipal district", note: "bigger operation" },
        { label: "Something else", note: "local board, commission, agency…" }
      ],
      free: "Anything I should know about your community? (population, staff size, how rural…)"
    },
    {
      q: "What do you need help with?",
      hint: "Pick the closest — or just type it in your own words below. Your words matter most.",
      key: "need",
      options: [
        { label: "A proper village website", note: "residents can find things" },
        { label: "Privacy & records compliance (POPA/ATIA)", note: "the new provincial rules" },
        { label: "Getting paper records organized & digitized", note: "filing cabinets → order" },
        { label: "Custom software", note: "records vaults, request tracking, portals" },
        { label: "Honestly, I'm not sure — I just know we need help", note: "very common, very welcome" }
      ],
      free: "Describe your situation however you like — messy is fine. What's bugging you most?"
    },
    {
      q: "Where are things at today?",
      hint: "Be honest — this is what changes the number up or down.",
      key: "state",
      options: [
        { label: "Starting from scratch", note: "nothing in place" },
        { label: "Some things done, big gaps", note: "partial coverage" },
        { label: "Mostly organized, need polish & proof", note: "close to done" },
        { label: "We had a scare / deadline / request", note: "something kicked this off" }
      ],
      free: "Tell me the story — a council motion, a privacy request, an audit, a messy filing room…"
    },
    {
      q: "How fast do you need this?",
      hint: "Honesty helps me estimate realistically.",
      key: "speed",
      options: [
        { label: "Urgent — weeks, not months", note: "deadline bearing down" },
        { label: "This budget year", note: "planned, not panicked" },
        { label: "Just exploring for now", note: "kicking tires is smart" }
      ],
      free: "Anything about timelines, budget year, or council dates I should factor in?"
    },
    {
      q: "One last thing — what should I know?",
      hint: "Staff comfort with tech, past attempts, budget worries, anything. This is where surprises hide.",
      key: "extra",
      options: [],
      free: "Your turn — type whatever you want me to consider in your estimate."
    }
  ];

  var answers = [];
  var step = 0;

  function money(n) {
    return "$" + Number(n).toLocaleString("en-CA", { maximumFractionDigits: 0 });
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }
  function renderStep(root) {
    var s = STEPS[step];
    var bars = STEPS.map(function (_, i) {
      return '<span class="' + (i < step ? "done" : "") + '"></span>';
    }).join("");

    var opts = s.options.map(function (o, i) {
      return '<button type="button" class="quiz-opt" data-i="' + i + '">' +
        '<span>' + escapeHtml(o.label) + "</span><small>" + escapeHtml(o.note || "") + "</small></button>";
    }).join("");

    root.innerHTML =
      '<div class="quiz-progress">' + bars + "</div>" +
      '<div class="quiz-step">' +
        '<p class="eyebrow">Step ' + (step + 1) + " of " + STEPS.length + "</p>" +
        "<h3>" + escapeHtml(s.q) + "</h3>" +
        '<p class="hint">' + escapeHtml(s.hint) + "</p>" +
        (opts ? '<div class="quiz-options">' + opts + "</div>" : "") +
        '<p style="margin:18px 0 8px;color:var(--mist);font-size:.92rem">' + escapeHtml(s.free) + "</p>" +
        '<textarea class="quiz-free" id="quiz-free" placeholder="Type in your own words…"></textarea>' +
        '<div class="quiz-nav">' +
          (step > 0 ? '<button class="btn btn-ghost" id="quiz-back">← Back</button>' : "") +
          '<button class="btn btn-primary" id="quiz-next">' + (step === STEPS.length - 1 ? "See my estimate ✨" : "Next →") + "</button>" +
          '<span class="quiz-note">No email required · generic estimate · 60 seconds</span>' +
        "</div>" +
      "</div>";

    root.querySelectorAll(".quiz-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        root.querySelectorAll(".quiz-opt").forEach(function (x) { x.classList.remove("sel"); });
        b.classList.add("sel");
        root._picked = s.options[Number(b.getAttribute("data-i"))].label;
      });
    });

    var back = root.querySelector("#quiz-back");
    if (back) back.addEventListener("click", function () {
      capture(root, s);
      step--;
      renderStep(root);
    });

    root.querySelector("#quiz-next").addEventListener("click", function () {
      capture(root, s);
      if (step < STEPS.length - 1) {
        step++;
        renderStep(root);
      } else {
        renderLoading(root);
      }
    });
  }

  function capture(root, s) {
    answers[step] = {
      question: s.q,
      answer: root._picked || "",
      detail: (root.querySelector("#quiz-free") || {}).value || ""
    };
    root._picked = null;
  }
  function renderLoading(root) {
    root.innerHTML =
      '<div class="quiz-step" style="text-align:center;padding:40px 0">' +
        '<div class="typing" style="justify-content:center"><i></i><i></i><i></i></div>' +
        "<h3 style=\"margin-top:18px\">Building your estimate…</h3>" +
        '<p class="hint">Reading your answers — including everything you typed — like a real estimator would.</p>' +
      "</div>";
    if (!window.RockyAI || !window.RockyAI.available()) {
      renderQuote(root, null);
      return;
    }
    window.RockyAI.quote(answers).then(function (q) {
      renderQuote(root, q);
    }).catch(function () {
      renderQuote(root, null);
    });
  }

  function renderQuote(root, quote) {
    if (!quote) {
      root.innerHTML =
        '<div class="quiz-step" style="text-align:center;padding:30px 0">' +
          "<h3>My AI brain is napping 😴</h3>" +
          '<p class="hint">The estimator loads from the web — check your connection and hit retry. Or skip straight to the free assessment and I\'ll price it in person.</p>' +
          '<div class="quiz-nav" style="justify-content:center">' +
            '<button class="btn btn-primary" id="quiz-retry">Retry estimate</button>' +
            '<a class="btn btn-ghost" href="#assessment">Book free assessment</a>' +
          "</div>" +
        "</div>";
      var r = root.querySelector("#quiz-retry");
      if (r) r.addEventListener("click", function () { renderLoading(root); });
      return;
    }

    var items = (quote.line_items || []).map(function (li) {
      return '<div class="quote-line"><span class="lbl">' + escapeHtml(li.label) +
        '<span class="why">' + escapeHtml(li.why || "") + "</span></span>" +
        '<span class="val">' + money(li.amount) + "</span></div>";
    }).join("");

    var notes = (quote.notes || []).map(function (n) {
      return "<li>" + escapeHtml(n) + "</li>";
    }).join("");

    root.innerHTML =
      '<div class="quote-card">' +
        '<p class="eyebrow">Your generic estimate · ' + escapeHtml(quote.package_fit || "Mixed") + "</p>" +
        "<h3>" + escapeHtml(quote.headline || "Here's roughly where you'd land.") + "</h3>" +
        '<p class="quote-price">' + money(quote.total_low) + " – " + money(quote.total_high) + "</p>" +
        '<p style="color:var(--mist);font-size:.92rem;margin-top:-6px">Generic planning estimate — like an online insurance quote. Confirmed in writing after a free assessment.</p>' +
        '<div class="quote-lines">' + items + "</div>" +
        (notes ? "<ul style=\"color:var(--mist);font-size:.92rem;padding-left:1.2em\">" + notes + "</ul>" : "") +
        '<div class="quiz-nav">' +
          '<button class="btn btn-gold" onclick="window.print()">🖨️ Save / Print this quote</button>' +
          '<a class="btn btn-primary" href="#assessment">Book the free assessment</a>' +
          '<button class="btn btn-ghost" id="quiz-again">Start over</button>' +
        "</div>" +
        '<p class="quiz-note">No promise, no obligation — just an honest ballpark based on what you told me.</p>' +
      "</div>";

    var again = root.querySelector("#quiz-again");
    if (again) again.addEventListener("click", function () {
      answers = [];
      step = 0;
      renderStep(root);
    });
  }

  function init() {
    var root = document.getElementById("quote-quiz");
    if (!root) return;
    renderStep(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();