/* ============================================================
   Gabriel Salami — Portfólio | scripts (vanilla JS)
   ============================================================ */
(function () {
  "use strict";

  var WHATS_PHONE = "5551999262182";
  var WHATS_MSG = "Olá, tudo bem? Peguei seu contato no salami96.github.io!";

  /* ---------- Ano no rodapé ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Tema (dark/light) com persistência ---------- */
  var root = document.documentElement;
  var stored = localStorage.getItem("theme");
  if (stored) {
    root.setAttribute("data-theme", stored);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.setAttribute("data-theme", "light");
  }
  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  /* ---------- Navbar: estado "scrolled" + menu mobile ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") navLinks.classList.remove("open");
    });
  }

  /* ---------- Scroll spy (link ativo na navbar) ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (sections.length && spyLinks.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          spyLinks.forEach(function (l) {
            l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- WhatsApp ---------- */
  function openWhats(text) {
    var msg = text || WHATS_MSG;
    window.open(
      "https://api.whatsapp.com/send?phone=" + WHATS_PHONE + "&text=" + encodeURIComponent(msg),
      "_blank",
      "noopener"
    );
  }
  document.querySelectorAll("[data-whats]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openWhats();
    });
  });

  /* ---------- Máscara de telefone (vanilla) ---------- */
  var phone = document.getElementById("phone");
  if (phone) {
    phone.addEventListener("input", function () {
      var v = this.value.replace(/\D/g, "").slice(0, 11);
      var out = v;
      if (v.length > 6) out = "(" + v.slice(0, 2) + ") " + v.slice(2, 7) + "-" + v.slice(7);
      else if (v.length > 2) out = "(" + v.slice(0, 2) + ") " + v.slice(2);
      else if (v.length > 0) out = "(" + v;
      this.value = out;
    });
  }

  /* ---------- Formulário de contato ----------
     Sem backend ativo: a mensagem é montada e enviada via WhatsApp.
     Para usar e-mail, basta criar um endpoint no Formspree (https://formspree.io)
     e definir data-formspree="https://formspree.io/f/SEU_ID" no <form>.            */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        name: (form.querySelector("#name") || {}).value || "",
        email: (form.querySelector("#email") || {}).value || "",
        subject: (form.querySelector("#subject") || {}).value || "",
        message: (form.querySelector("#message") || {}).value || ""
      };
      var endpoint = form.getAttribute("data-formspree");
      if (endpoint) {
        var fd = new FormData(form);
        fetch(endpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
          .then(function (r) { showAlert(form, r.ok ? "success" : "error"); if (r.ok) form.reset(); })
          .catch(function () { showAlert(form, "error"); });
      } else {
        var text =
          "Olá Gabriel! Vim pelo seu portfólio.\n\n" +
          "*Nome:* " + data.name + "\n" +
          "*Assunto:* " + data.subject + "\n" +
          "*E-mail:* " + data.email + "\n\n" +
          data.message;
        openWhats(text);
        showAlert(form, "success");
      }
    });
  }
  function showAlert(form, type) {
    form.querySelectorAll(".alert").forEach(function (a) { a.hidden = true; });
    var el = form.querySelector(".alert-" + type);
    if (el) el.hidden = false;
  }
})();
