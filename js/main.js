/* Rocky Mountain Digital — nav toggle + assessment form handling
   Form posts via Formspree endpoint when configured; otherwise shows a
   mailto fallback so the site works before any account exists. */
(function () {
  "use strict";

  // ---- Mobile nav ----
  var toggle = document.querySelector(".navtoggle");
  var nav = document.getElementById("mainnav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
    });
  }

  // ---- Assessment form ----
  // Set your Formspree endpoint here after signing up at formspree.io (free):
  var FORMSPREE_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxxx"
  var CONTACT_EMAIL = "hello@rockymountaindigital.ca"; // placeholder — swap when the real one is decided

  var form = document.getElementById("assessment-form");
  if (!form) return;

  var okBox = document.getElementById("form-ok");
  var okMsg = document.getElementById("form-ok-msg");

  function showOk(msg) {
    if (okMsg) okMsg.textContent = msg;
    if (okBox) {
      okBox.classList.add("show");
      okBox.setAttribute("tabindex", "-1");
      okBox.focus();
      okBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    form.reset();
  }

  function mailtoFallback(data) {
    var lines = [
      "Village / municipality: " + (data.village || "-"),
      "Contact name: " + (data.name || "-"),
      "Email: " + (data.email || "-"),
      "Phone: " + (data.phone || "-"),
      "",
      "Message:",
      data.message || "-"
    ];
    var href = "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent("Free assessment request — " + (data.village || "Village inquiry")) +
      "&body=" + encodeURIComponent(lines.join("\n"));
    window.location.href = href;
    showOk("Your email program should open with the details filled in. " +
      "Press send, and I'll reply within two business days. " +
      "(If nothing opened, email " + CONTACT_EMAIL + " directly.)");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;

    var fd = new FormData(form);
    var data = {
      village: (fd.get("village") || "").trim(),
      name: (fd.get("name") || "").trim(),
      email: (fd.get("email") || "").trim(),
      phone: (fd.get("phone") || "").trim(),
      message: (fd.get("message") || "").trim()
    };

    if (!FORMSPREE_ENDPOINT) {
      mailtoFallback(data);
      return;
    }

    var btn = form.querySelector("[type=submit]");
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(function (res) {
      if (res.ok) {
        showOk("Thank you! Your request is on its way. I'll reply within two business days.");
      } else {
        throw new Error("bad response");
      }
    }).catch(function () {
      mailtoFallback(data);
    }).finally(function () {
      if (btn) { btn.disabled = false; btn.textContent = "Request my free assessment"; }
    });
  });
})();