/* ===== Saba Fatima Portfolio - Interactivity ===== */
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const toTop = document.getElementById("toTop");
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-links a");

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.forEach((link) => link.addEventListener("click", closeMenu));

  /* ---------- Navbar style, active link, back-to-top ---------- */
  function onScroll() {
    const y = window.scrollY;

    navbar.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 500);

    let current = "home";
    sections.forEach((section) => {
      if (y >= section.offsetTop - 140) current = section.id;
    });

    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Typing effect ---------- */
  const roles = [
    "AI Photo Generator",
    "Visual Photo Editor",
    "Poster Designer",
    "Data Entry Specialist",
    "Remote Freelancer",
  ];
  const typedEl = document.getElementById("typedText");
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const word = roles[roleIndex];
    typedEl.textContent = word.substring(0, charIndex);

    if (!deleting && charIndex < word.length) {
      charIndex++;
      setTimeout(type, 90);
    } else if (!deleting) {
      deleting = true;
      setTimeout(type, 1400);
    } else if (charIndex > 0) {
      charIndex--;
      setTimeout(type, 45);
    } else {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, 400);
    }
  }
  type();

  /* ---------- Counters ---------- */
  function animateCount(el) {
    const target = Number(el.dataset.count);
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Skill bars ---------- */
  function animateSkill(skillEl) {
    const fill = skillEl.querySelector(".fill");
    const percentEl = skillEl.querySelector(".percent");
    const target = Number(fill.dataset.percent);

    fill.style.width = target + "%";

    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      percentEl.textContent = Math.floor(progress * target) + "%";
      if (progress < 1) requestAnimationFrame(tick);
      else percentEl.textContent = target + "%";
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;

          // small stagger for items in the same grid
          const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
          const delay = Math.max(siblings.indexOf(el), 0) * 90;
          el.style.transitionDelay = Math.min(delay, 450) + "ms";

          el.classList.add("visible");

          if (el.classList.contains("skill")) animateSkill(el);
          el.querySelectorAll("[data-count]").forEach(animateCount);

          observer.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback for very old browsers
    revealEls.forEach((el) => {
      el.classList.add("visible");
      if (el.classList.contains("skill")) animateSkill(el);
      el.querySelectorAll("[data-count]").forEach(animateCount);
    });
  }

  /* ---------- Portfolio filter ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      projects.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hide", !match);
        if (match) {
          card.style.transitionDelay = "0ms";
          card.classList.add("visible");
        }
      });
    });
  });

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  const MY_EMAIL = "azadsaba2@gmail.com";

  function setStatus(message, ok) {
    statusEl.textContent = message;
    statusEl.className = "form-status " + (ok ? "ok" : "bad");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim() || "Portfolio enquiry";
    const message = form.message.value.trim();

    // Reset errors
    form.querySelectorAll(".field").forEach((f) => f.classList.remove("error"));

    let valid = true;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name) { form.name.parentElement.classList.add("error"); valid = false; }
    if (!emailOk) { form.email.parentElement.classList.add("error"); valid = false; }
    if (!message) { form.message.parentElement.classList.add("error"); valid = false; }

    if (!valid) {
      setStatus("Please fill in your name, a valid email and a message.", false);
      return;
    }

    // No backend: open the visitor's email app with the message pre-filled.
    const body = `Hi Saba,\n\n${message}\n\nFrom: ${name} (${email})`;
    const mailto =
      "mailto:" + MY_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    window.location.href = mailto;
    setStatus("Thank you! Your email app should open with your message ready to send.", true);
    form.reset();
  });
});
