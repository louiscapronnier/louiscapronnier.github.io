// Portfolio BTS SIO - interactions vanilla:
// 1) Dark mode (localStorage)
// 2) Animations au scroll (IntersectionObserver)
// 3) Mise en avant du lien de navigation active
// 4) Modal details projet
// 5) Formulaire de contact (validation simple + message)

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------------------------
  // Footer year
  // ---------------------------
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------------------------
  // Theme toggle
  // ---------------------------
  const themeToggleBtn = $("#themeToggle");
  const htmlEl = document.documentElement;

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    const pressed = theme === "dark";
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute("aria-pressed", String(pressed));
    }
  }

  function getPreferredTheme() {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    // Si rien n'est stocke, on respecte la preference navigateur.
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const current = htmlEl.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      applyTheme(next);
    });
  }

  // ---------------------------
  // Navigation active link + animations au scroll
  // ---------------------------
  const sections = $$("main .section[id]");
  const navLinks = $$(".nav-link");
  const hasHashNavigation = navLinks.some((link) => (link.getAttribute("href") || "").startsWith("#"));

  function setActiveLink(sectionId) {
    for (const link of navLinks) {
      const href = link.getAttribute("href") || "";
      const target = href.startsWith("#") ? href.slice(1) : href;
      link.classList.toggle("is-active", target === sectionId);
    }
  }

  // IntersectionObserver: ajoute "is-visible" pour les animations.
  const revealEls = $$(".reveal, .reveal-left, .reveal-right");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          revealObserver.unobserve(e.target);
        }
      }
    },
    {
      threshold: 0.2,
      // Declenche un peu plus tard pour que l'effet soit visible
      rootMargin: "0px 0px -12% 0px",
    }
  );

  for (const el of revealEls) revealObserver.observe(el);

  function setActiveLinkByPathname() {
    const currentFile = window.location.pathname.split("/").pop() || "index.html";
    for (const link of navLinks) {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === currentFile);
    }
  }

  // Navigation active fiable: version page unique avec ancres.
  function updateActiveLinkOnScroll() {
    if (!sections.length || !hasHashNavigation) return;

    const headerHeight = 72;
    const referenceY = window.scrollY + headerHeight + window.innerHeight * 0.28;

    // Gestion explicite de la zone "Accueil" (avant la 1re section avec id)
    if (window.scrollY < sections[0].offsetTop - headerHeight - 40) {
      setActiveLink("accueil");
      return;
    }

    let activeId = sections[0].id;
    for (const sec of sections) {
      if (referenceY >= sec.offsetTop) {
        activeId = sec.id;
      } else {
        break;
      }
    }
    setActiveLink(activeId);
  }

  if (hasHashNavigation) {
    updateActiveLinkOnScroll();
    window.addEventListener("scroll", updateActiveLinkOnScroll, { passive: true });
    window.addEventListener("resize", updateActiveLinkOnScroll);
  } else {
    setActiveLinkByPathname();
  }

  // ---------------------------
  // Mobile menu (simple)
  // ---------------------------
  const mobileMenuBtn = $("#mobileMenuBtn");
  const nav = $(".nav");
  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener("click", () => {
      const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      const next = !isExpanded;
      mobileMenuBtn.setAttribute("aria-expanded", String(next));
      nav.style.display = next ? "block" : "";
      if (next) nav.focus?.();
    });
  }

  // ---------------------------
  // Modal projet
  // ---------------------------
  const modal = $("#projectModal");
  const modalScreenshot = $("#modalScreenshot");
  const modalTitle = $("#modalTitle");
  const modalDescription = $("#modalDescription");
  const modalContext = $("#modalContext");
  const modalCompetences = $("#modalCompetences");
  const modalGithubLink = $("#modalGithubLink");
  const modalCloseBtn = $("#modalCloseBtn");
  const modalOverlay = $(".modal-overlay");

  let lastFocusedEl = null;

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function openModalFromCard(card) {
    if (!modal) return;
    lastFocusedEl = document.activeElement;

    const title = card.getAttribute("data-title") || "";
    const description = card.getAttribute("data-description") || "";
    const context = card.getAttribute("data-context") || "";
    const competences = (card.getAttribute("data-competences") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const screenshot = card.getAttribute("data-screenshot") || "";
    const github = card.getAttribute("data-github") || "#";

    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalContext.textContent = context;
    modalScreenshot.src = screenshot;
    modalScreenshot.alt = "Capture du projet: " + title;

    modalCompetences.innerHTML = "";
    for (const c of competences) {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = c;
      modalCompetences.appendChild(span);
    }

    modalGithubLink.href = github;
    modal.hidden = false;
    // Nettoyage de focus
    modalCloseBtn?.focus();
  }

  // Ouverture depuis les boutons "Voir le projet"
  const openButtons = $$("[data-open-project]");
  for (const btn of openButtons) {
    btn.addEventListener("click", (ev) => {
      const card = ev.currentTarget.closest(".project-card");
      if (card) openModalFromCard(card);
    });
  }

  // Possibilite: ouvrir au clic du card (optionnel)
  $$(".project-card").forEach((card) => {
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModalFromCard(card);
      }
    });
  });

  modalCloseBtn?.addEventListener("click", closeModal);
  modalOverlay?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (!modal || modal.hidden) return;
    if (e.key === "Escape") closeModal();
  });

  // ---------------------------
  // Contact form validation (client-side)
  // ---------------------------
  const contactForm = $("#contactForm");
  const formStatus = $("#formStatus");

  function setStatus(msg) {
    if (!formStatus) return;
    formStatus.textContent = msg;
  }

  function isValidEmail(email) {
    // Regex simple pour un formulaire etudiant
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      setStatus("");

      const name = String($("#name")?.value || "").trim();
      const email = String($("#email")?.value || "").trim();
      const message = String($("#message")?.value || "").trim();

      if (name.length < 2) {
        setStatus("Veuillez saisir un nom (au moins 2 caracteres).");
        $("#name")?.focus();
        return;
      }
      if (!isValidEmail(email)) {
        setStatus("Veuillez saisir un email valide.");
        $("#email")?.focus();
        return;
      }
      if (message.length < 10) {
        setStatus("Veuillez saisir un message plus detaille (au moins 10 caracteres).");
        $("#message")?.focus();
        return;
      }

      // Pas de backend: on simule un envoi reussi.
      setStatus("Message envoye (simulation). Merci! Je te repondrai bientot.");
      contactForm.reset();
    });
  }

  // ---------------------------
  // Filtres TP complémentaires (page E5)
  // ---------------------------
  const suppFilter = $("#suppFilter");
  if (suppFilter) {
    const filterButtons = $$(".filter-btn", suppFilter);
    const suppItems = $$(".supp-item");

    function applySuppFilter(filter) {
      for (const item of suppItems) {
        const cat = item.getAttribute("data-cat") || "";
        const isVisible = filter === "all" || cat === filter;
        item.style.display = isVisible ? "" : "none";
      }

      for (const btn of filterButtons) {
        const isActive = (btn.getAttribute("data-filter") || "") === filter;
        btn.classList.toggle("primary", isActive);
        btn.classList.toggle("ghost", !isActive);
      }
    }

    for (const btn of filterButtons) {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter") || "all";
        applySuppFilter(filter);
      });
    }

    applySuppFilter("all");
  }
})();

