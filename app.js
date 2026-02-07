(() => {
  // ---- View switching (hash "pages") ----
  const views = Array.from(document.querySelectorAll("[data-view]"));
  const navLinks = Array.from(document.querySelectorAll("a[data-nav]"));

  const normalize = (hash) => {
    const v = (hash || "").replace("#", "").trim().toLowerCase();
    return v || "home";
  };

  const setActiveNav = (view) => {
    navLinks.forEach((a) => {
      const target = (a.getAttribute("href") || "").replace("#", "");
      const on = target === view;
      a.classList.toggle("is-active", on);
      a.setAttribute("aria-current", on ? "page" : "false");
    });
  };

  const showView = (view) => {
    let found = false;

    views.forEach((el) => {
      const isMatch = el.getAttribute("data-view") === view;
      el.classList.toggle("is-active", isMatch);
      el.toggleAttribute("hidden", !isMatch);
      if (isMatch) found = true;
    });

    if (!found) {
      view = "home";
      views.forEach((el) => {
        const isHome = el.getAttribute("data-view") === "home";
        el.classList.toggle("is-active", isHome);
        el.toggleAttribute("hidden", !isHome);
      });
    }

    setActiveNav(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---- Mobile menu (animated) ----
  const menuBtn = document.getElementById("menuBtn");
  const menuOverlay = document.getElementById("menuOverlay");
  const mobileMenu = document.getElementById("mobileMenu");

  const canMenu = () => menuBtn && menuOverlay && mobileMenu;

  const lockScroll = (lock) => {
    document.body.style.overflow = lock ? "hidden" : "";
  };

  const openMenu = () => {
    if (!canMenu()) return;
    menuBtn.setAttribute("aria-expanded", "true");

    // Make visible first (so it can animate)
    menuOverlay.hidden = false;
    mobileMenu.hidden = false;

    // Next frame: add open class to trigger transition
    requestAnimationFrame(() => {
      menuOverlay.classList.add("is-open");
      mobileMenu.classList.add("is-open");
    });

    lockScroll(true);
  };

  const closeMenu = () => {
    if (!canMenu()) return;
    menuBtn.setAttribute("aria-expanded", "false");

    // Start transition
    menuOverlay.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");

    lockScroll(false);

    // After transition ends, hide completely
    const finish = () => {
      menuOverlay.hidden = true;
      mobileMenu.hidden = true;
      mobileMenu.removeEventListener("transitionend", finish);
    };

    // If transitions are disabled, fallback
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) {
      menuOverlay.hidden = true;
      mobileMenu.hidden = true;
      return;
    }

    mobileMenu.addEventListener("transitionend", finish);
  };

  const toggleMenu = () => {
    if (!canMenu()) return;
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    expanded ? closeMenu() : openMenu();
  };

  // Default closed (prevents “menu open on load”)
  document.addEventListener("DOMContentLoaded", () => {
    if (!canMenu()) return;
    menuBtn.setAttribute("aria-expanded", "false");
    menuOverlay.hidden = true;
    mobileMenu.hidden = true;
    menuOverlay.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
  });

  // Close when clicking mobile menu items (delegation)
  mobileMenu?.addEventListener("click", (e) => {
    if (e.target && e.target.tagName === "A") closeMenu();
  });

  menuBtn?.addEventListener("click", toggleMenu);
  menuOverlay?.addEventListener("click", closeMenu);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // ---- Intercept nav clicks for hash views ----
  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "#home";
      if (!href.startsWith("#")) return;

      e.preventDefault();
      const view = normalize(href);

      if (location.hash !== `#${view}`) location.hash = view;
      else showView(view);

      closeMenu();
    });
  });

  // ---- Hash changes ----
  const handleHash = () => showView(normalize(location.hash));
  window.addEventListener("hashchange", handleHash);
  handleHash();
})();