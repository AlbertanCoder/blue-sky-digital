/* chat.js — Ask Rocky: real LLM chat widget (Puter.js via RockyAI). */
(function () {
  "use strict";

  var history = [];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }

  var SUGGESTIONS = [
    "What does a village website cost?",
    "We need help with POPA — where do we start?",
    "Our records are a mess — can you fix that?",
    "What if we're a village of 200?"
  ];

  function build() {
    var wrap = el("div", "rmd-chat");
    wrap.innerHTML =
      '<button class="rmd-fab" aria-expanded="false" aria-controls="rmd-panel">' +
        '<span aria-hidden="true">💬</span><span>Ask Rocky</span></button>' +
      '<div class="rmd-panel" id="rmd-panel" role="dialog" aria-label="Ask Rocky AI assistant">' +
        '<div class="rmd-head">' +
          '<div><p class="rmd-title">Ask Rocky</p>' +
          '<p class="rmd-sub">Real AI · answers anything · powered by Puter</p></div>' +
          '<button class="rmd-close" aria-label="Close chat">×</button>' +
        '</div>' +
        '<div class="rmd-log" role="log" aria-live="polite"></div>' +
        '<form class="rmd-form">' +
          '<label for="rmd-input" class="skip">Your question</label>' +
          '<input id="rmd-input" type="text" placeholder="Ask me anything…" autocomplete="off">' +
          '<button type="submit" aria-label="Send">➤</button>' +
        '</form>' +
        '<p class="rmd-foot">AI answers are general information, not legal advice.</p>' +
      '</div>';
    document.body.appendChild(wrap);

    var log = wrap.querySelector(".rmd-log");
    var form = wrap.querySelector(".rmd-form");
    var input = wrap.querySelector("#rmd-input");
    var fab = wrap.querySelector(".rmd-fab");
    var panel = wrap.querySelector(".rmd-panel");
    var closeBtn = wrap.querySelector(".rmd-close");
    var opened = false, greeted = false;

    function add(who, html) {
      var m = el("div", "rmd-msg rmd-" + who, html);
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
      return m;
    }

    function typing() {
      return add("bot", '<span class="typing"><i></i><i></i><i></i></span>');
    }

    function ask(q) {
      add("user", escapeHtml(q));
      var t = typing();
      if (!window.RockyAI || !window.RockyAI.available()) {
        t.remove();
        add("bot", "I can't reach my AI brain right now (it loads from the web — are you offline?). " +
          "Email <a href=\"mailto:hello@rockymountaindigital.ca\">hello@rockymountaindigital.ca</a> and you'll get a real answer fast.");
        return;
      }
      window.RockyAI.chatReply(q, history.slice(-8)).then(function (reply) {
        t.remove();
        history.push({ who: "user", text: q });
        history.push({ who: "bot", text: reply });
        add("bot", escapeHtml(reply).replace(/\n/g, "<br>"));
      }).catch(function () {
        t.remove();
        add("bot", "Something glitched on my side — try again, or email " +
          "<a href=\"mailto:hello@rockymountaindigital.ca\">hello@rockymountaindigital.ca</a>.");
      });
    }

    SUGGESTIONS.forEach(function (s) {
      // suggestions live as clickable chips in the first bot message
    });

    function greet() {
      if (greeted) return;
      greeted = true;
      var chips = SUGGESTIONS.map(function (s) {
        return '<button class="quiz-opt rmd-suggest" style="padding:10px 14px;font-size:.85rem">' + escapeHtml(s) + '</button>';
      }).join("");
      var m = add("bot", "Hi! I'm Rocky 🏔️ — a real AI that knows everything about this business " +
        "(and plenty beyond it). Ask me anything: prices, POPA/ATIA, your village's situation, whatever.<br><br>" +
        '<div style="display:grid;gap:8px;margin-top:6px">' + chips + "</div>");
      m.querySelectorAll(".rmd-suggest").forEach(function (b) {
        b.addEventListener("click", function () { ask(b.textContent); });
      });
    }

    function setOpen(open) {
      opened = open;
      panel.classList.toggle("open", open);
      fab.setAttribute("aria-expanded", String(open));
      if (open) { greet(); setTimeout(function () { input.focus(); }, 200); }
      else fab.focus();
    }

    fab.addEventListener("click", function () { setOpen(!opened); });
    closeBtn.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && opened) setOpen(false);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) return;
      input.value = "";
      ask(q);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();