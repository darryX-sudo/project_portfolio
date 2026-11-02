(() => {
  "use strict";

  /* ---------- Data (replace with your own projects) ---------- */
  const PROJECTS = [
    { title: "EduReformSystem",   type: "App",    desc: "An object-oriented Java gamification desktop application featuring badges, quizzes, and file-based overall time tracking.", detail: "An Educational App using Java and OOP principles.", tags: ["Java", "OOP"], url: "#", image: "images/edureform.png" },
    { title: "Mee Kolok Ordering System",   type: "System",    desc: "A command line based ordering system for a local food stall.", detail: "Longer description of the Mee Kolok Ordering System.", tags: ["C++"], url: "#", image: "images/meekolok_system.png" },
    { title: "Student-Lecturer Management System", type: "System",   desc: "A system for managing the relationship between students and lecturers.", detail: "A system for managing the interaction between students and lecturers.", tags: ["Python"], url: "#", image: "images/student_management.png" },
    { title: "KUTS ART App Research",  type: "UI/UX", desc: "Research on UI accessibility for the KUTS ART App.", detail: "This project involves researching UI accessibility guidelines and evaluating the usability of the KUTS ART App.", tags: ["Figma", "UX"], url: "#", image: "images/KUTS_Mobile_App.png" },
    { title: "Sarawak Heritage Database",  type: "Data",    desc: "A database for storing and managing information about Sarawak's cultural heritage.", detail: "A comprehensive database for preserving and showcasing Sarawak's rich cultural heritage.", tags: ["SQL"], url: "#", image: "images/local_heritage.jpeg" }
  ];
  const TYPED_WORDS = ["basic websites.", "simple applications.", "things that work."];

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }
  };

  /* 1. Mobile menu toggle */
  function initMenu() {
    const btn = $("#navToggle"), links = $("#navLinks");
    btn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", e => {
      if (e.target.closest("a")) { links.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") links.classList.remove("open"); });
  }

  /* 2. Theme toggle, remembered between visits */
  function initTheme() {
    const btn = $("#themeBtn"), root = document.documentElement;
    const apply = theme => {
      root.dataset.theme = theme;
      btn.setAttribute("aria-pressed", String(theme === "dark"));
      btn.textContent = theme === "dark" ? "☀️" : "🌙";
      btn.title = theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode";
    };
    const saved = store.get("theme");
    apply(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    btn.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      apply(next); store.set("theme", next);
    });
  }

  /* 3. Typing effect in the hero */
  function initTyping() {
    const el = $("#typed");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = TYPED_WORDS[0]; return; }
    let w = 0, i = 0, deleting = false;
    (function tick() {
      const word = TYPED_WORDS[w];
      el.textContent = word.slice(0, i);
      i += deleting ? -1 : 1;
      let delay = deleting ? 40 : 90;
      if (!deleting && i > word.length) { deleting = true; delay = 1400; }
      else if (deleting && i < 0) { deleting = false; i = 0; w = (w + 1) % TYPED_WORDS.length; delay = 400; }
      setTimeout(tick, delay);
    })();
  }

  /* 4. Render projects from data, 5. filter them */
  function initProjects() {
    const grid = $("#projectGrid"), count = $("#projectCount");
    const render = filter => {
      const list = PROJECTS.filter(p => filter === "all" || p.type === filter);
      grid.innerHTML = "";
      list.forEach(p => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `<img src="" alt="" class="project-img"><h3></h3><p></p><p class="muted"></p><button class="btn" type="button">Details</button>`;
        
        // POPULATING IMAGE DATA
        $("img", card).src = p.image;
        $("img", card).alt = "Preview of " + p.title;
        
        $("h3", card).textContent = p.title;
        $("p", card).textContent = p.desc;
        $(".muted", card).textContent = p.tags.join(", ");
        $("button", card).addEventListener("click", () => openDialog(p));
        grid.appendChild(card);
      });
      count.textContent = `Showing ${list.length} of ${PROJECTS.length} projects`;
    };
    $$(".chip[data-filter]").forEach(chip => chip.addEventListener("click", () => {
      $$(".chip[data-filter]").forEach(c => { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
      chip.classList.add("is-active"); chip.setAttribute("aria-pressed", "true");
      render(chip.dataset.filter);
    }));
    render("all");
  }

  /* 6. Project details dialog */
  function openDialog(p) {
    const dlg = $("#projectDialog");
    
    // MODAL IMAGE INJECTION
    const dlgImg = $("#dlgImg");
    if (dlgImg) {
      dlgImg.src = p.image;
      dlgImg.alt = "Preview of " + p.title;
    }
    
    $("#dlgTitle").textContent = p.title;
    $("#dlgBody").textContent = p.detail;
    $("#dlgTags").textContent = "Built with: " + p.tags.join(", ");
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }
  
  function initDialog() {
    const dlg = $("#projectDialog");
    $("#dlgClose").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  }

  /* 7. Highlight the nav link of the section in view */
  function initActiveLink() {
    const links = $$(".nav-links a[href^='#']");
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) links.forEach(a => a.classList.toggle("active", a.hash === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section").forEach(s => io.observe(s));
  }

  /* 8. Scroll progress bar, header shadow and back-to-top button */
  function initScroll() {
    const bar = $("#progress"), header = $(".site-header"), top = $("#toTop");
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
      header.classList.toggle("scrolled", scrollY > 10);
      top.hidden = scrollY < 500;
    };
    addEventListener("scroll", update, { passive: true });
    top.addEventListener("click", () => scrollTo({ top: 0 }));
    update();
  }

  /* 9. Animate skill bars and stat counters when they appear */
  function initReveal() {
    const animateCount = el => {
      const target = +el.dataset.count; let n = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const t = setInterval(() => { n = Math.min(target, n + step); el.textContent = n; if (n === target) clearInterval(t); }, 30);
    };
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        $$("#skills li").forEach(li => { $("i", li).style.width = li.dataset.level + "%"; });
        $$("[data-count]").forEach(animateCount);
        obs.disconnect();
      });
    }, { threshold: 0.3 });
    io.observe($("#about"));
  }

  /* 10. Copy email to clipboard, with fallback message */
  function initCopy() {
    $("#copyEmail").addEventListener("click", async () => {
      const msg = $("#copyMsg");
      try { await navigator.clipboard.writeText($("#emailLink").textContent); msg.textContent = "Copied."; }
      catch { msg.textContent = "Could not copy. Select the address and copy it manually."; }
      setTimeout(() => { msg.textContent = ""; }, 3000);
    });
  }

  /* 11. Contact form: live character counter + validation */
  function initForm() {
    const form = $("#contactForm"), msg = $("#message");
    msg.addEventListener("input", () => { $("#counter").textContent = `${msg.value.length}/300`; });

    const rules = {
      name:    v => v.trim().length >= 2 ? "" : "Enter your name (at least 2 characters).",
      email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email, like name@example.com.",
      message: v => v.trim().length >= 10 ? "" : "Write at least 10 characters."
    };
    const check = field => {
      const error = rules[field.name](field.value);
      $("#" + field.id + "-err").textContent = error;
      field.setAttribute("aria-invalid", String(Boolean(error)));
      return !error;
    };
    $$("input, textarea", form).forEach(f => f.addEventListener("blur", () => check(f)));

    form.addEventListener("submit", e => {
      e.preventDefault();
      const fields = $$("input, textarea", form);
      const results = fields.map(check);
      const status = $("#formStatus");
      if (results.every(Boolean)) {
        status.textContent = "Thanks! Your message is ready to send (demo only: nothing was uploaded).";
        form.reset(); $("#counter").textContent = "0/300";
      } else {
        status.textContent = "Please fix the highlighted fields.";
        fields[results.indexOf(false)].focus();
      }
    });
  }

  /* 12. Footer year and live local clock */
  function initFooter() {
    $("#year").textContent = new Date().getFullYear();
    const clock = $("#clock");
    const tick = () => { clock.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); };
    tick(); setInterval(tick, 30000);
  }

  /* Start everything. */
  document.addEventListener("DOMContentLoaded", () => {
    [initMenu, initTheme, initTyping, initProjects, initDialog, initActiveLink,
     initScroll, initReveal, initCopy, initForm, initFooter].forEach(fn => {
      try { fn(); } catch (err) { console.warn(`${fn.name} failed:`, err); }
    });
  });
})();
