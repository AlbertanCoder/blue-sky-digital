/* ai.js — real LLM layer for Rocky Mountain Digital (Puter.js).
   One script tag powers BOTH the chat assistant and the quote engine.
   No API keys, no cost, works on GitHub Pages. Swap PROVIDER for a
   personal API key later without touching UI code. */
(function () {
  "use strict";

  var CONTEXT = [
    "You are the helpful AI assistant for Shad Hunter (trading as Rocky Mountain Digital), a",
    "self-taught civic-tech builder in Alberta, Canada who helps villages and small",
    "municipalities with:",
    "(1) village websites & email, (2) privacy and records compliance for Alberta's",
    "Protection of Privacy Act (POPA) and Access to Information Act (ATIA),",
    "(3) records digitization & retention schedules, (4) custom software (records",
    "vaults, request tracking, audit trails).",
    "",
    "VOICE: plain, warm, kitchen-table language. A mayor's neighbour should understand",
    "every sentence. Never corporate jargon. Short paragraphs. Confident but humble.",
    "",
    "PRICING GUIDANCE (generic estimates only, like an online insurance quote):",
    "- Village Web Presence: typically $1,500-$3,500 depending on size",
    "- Privacy & Records Package (POPA/ATIA readiness): typically $3,500-$8,000",
    "- Full Compliance Partner (everything + digitization + follow-up): $7,500-$15,000",
    "- Custom software: from $6,500, scoped per project",
    "- Free on-site assessment is always the first step; final prices are confirmed",
    "  in writing after the assessment. Small villages get flexibility.",
    "",
    "HARD RULES:",
    "- NEVER promise, guarantee, or claim outcomes ('promise nothing'). Give honest",
    "  estimates and information instead. It is always fine to say 'it depends'.",
    "- Legal questions: explain the published legislation in plain words and add that",
    "  the municipality's own legal advisor confirms what applies. You are not a law firm.",
    "- Never invent prices outside the guidance above. Ranges are fine.",
    "- If asked about the team: one dedicated self-taught builder (Shad Hunter) who ships",
    "  full-stack software, uses AI-assisted engineering with rigorous verification, and",
    "  brings in trusted colleagues when needed; no big-firm overhead — that is why",
    "  prices beat large consultancies. He is also open to employment or partnership",
    "  conversations — interested parties can email hello@rockymountaindigital.ca.",
    "- If asked to book/contact: point to the free assessment form or email",
    "  hello@rockymountaindigital.ca (placeholder address).",
    "- You may answer general questions too (weather, Alberta, tech) in the same",
    "  friendly voice, then gently steer back to how the visitor can be helped."
  ].join("\n");

  function puter() {
    return (typeof window.puter !== "undefined" && window.puter.ai) ? window.puter.ai : null;
  }

  function available() { return !!puter(); }

  function clean(text) {
    return String(text || "")
      .replace(/\*\*/g, "")
      .replace(/^#+\s*/gm, "")
      .trim();
  }

  // ---------------- Model chain: best frontier models, free to visitors ----------------
  // Puter's free tier lets visitors use premium models at no cost. We try the
  // strongest first and fall back automatically. null = Puter's auto-router.
  var MODELS = ["gpt-5", "claude-sonnet-4", "gemini-2.0-flash", null];
  var workingModelIndex = 0;

  function callAI(messages) {
    var ai = puter();
    if (!ai) return Promise.reject(new Error("no-ai"));
    var order = [];
    for (var i = 0; i < MODELS.length; i++) {
      order.push((workingModelIndex + i) % MODELS.length);
    }
    function attempt(k) {
      if (k >= order.length) return Promise.reject(new Error("all-models-failed"));
      var idx = order[k];
      var m = MODELS[idx];
      var p = m ? ai.chat(messages, { model: m }) : ai.chat(messages);
      return p.then(function (res) {
        workingModelIndex = idx; // remember what works for the session
        return res;
      }).catch(function () {
        return attempt(k + 1); // model unavailable -> next best
      });
    }
    return attempt(0);
  }

  function chatReply(userMessage, history) {
    var messages = [{ role: "system", content: CONTEXT }];
    (history || []).forEach(function (m) {
      messages.push({ role: m.who === "user" ? "user" : "assistant", content: m.text });
    });
    messages.push({ role: "user", content: userMessage });
    return callAI(messages).then(function (res) {
      var text = (res && res.message && res.message.content) ? res.message.content : String(res || "");
      return clean(text);
    });
  }
  // ---------------- Quote engine (insurance-style) ----------------
  var QUOTE_SYSTEM = CONTEXT + "\n\n" +
    "You are now acting as a friendly estimator — like a car-insurance quote tool.\n" +
    "Given the visitor's quiz answers, produce a GENERIC planning estimate.\n" +
    "CRITICAL: respond with ONLY a JSON object (no markdown, no commentary) EXACTLY in this shape:\n" +
    "{\n" +
    "  \"headline\": \"short warm sentence about what they need\",\n" +
    "  \"total_low\": number,\n" +
    "  \"total_high\": number,\n" +
    "  \"line_items\": [{ \"label\": \"item name\", \"amount\": number, \"why\": \"max 12 words explaining why it changed\" }],\n" +
    "  \"notes\": [\"1-3 plain-language notes: assumptions, what could change the number, free assessment next step\"],\n" +
    "  \"market_note\": \"one short line comparing this to typical big-consultant pricing for the same scope (e.g. 'Similar work from a downtown consultancy often runs $12,000-$20,000') — honest ranges only, never invented precision\",\n" +
    "  \"package_fit\": \"one of: Village Web Presence | Privacy & Records | Full Compliance Partner | Custom Software | Mixed\"\n" +
    "}\n" +
    "Total range = sum of line items (roughly). Small villages (<500) skew lower. Urgent\n" +
    "deadlines, staff turnover, messy records, or many systems skew higher. Keep every\n" +
    "'why' human-readable. Estimates are generic planning figures only — never a promise.\n" +
    "Line items: 3 to 6 of them. Numbers must be plain numbers (no $ or commas).";

  function parseQuoteJSON(text) {
    var t = String(text || "").trim();
    var start = t.indexOf("{");
    var end = t.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("no-json");
    return JSON.parse(t.slice(start, end + 1));
  }

  function quote(quizAnswers) {
    var summary = quizAnswers.map(function (a) {
      return "Q: " + a.question + "\nA: " + (a.answer || "(not answered)") +
        (a.detail ? "\nTheir own words: " + a.detail : "");
    }).join("\n\n");
    function request() {
      return callAI([
        { role: "system", content: QUOTE_SYSTEM },
        { role: "user", content: "Quiz answers:\n\n" + summary + "\n\nReturn ONLY the JSON object." }
      ]).then(function (res) {
        var text = (res && res.message && res.message.content) ? res.message.content : String(res || "");
        return parseQuoteJSON(text);
      });
    }
    // one retry: if the model hiccups on JSON, ask again before giving up
    return request().catch(function (err) {
      if (err && err.message === "no-ai") throw err;
      return request();
    });
  }

  window.RockyAI = {
    available: available,
    chatReply: chatReply,
    quote: quote,
    CONTEXT: CONTEXT
  };
})();