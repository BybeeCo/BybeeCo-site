(() => {
  const views = Array.from(document.querySelectorAll("[data-view]"));
  const navLinks = Array.from(document.querySelectorAll('a[data-nav]'));

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
      views.forEach((el) => {
        const isHome = el.getAttribute("data-view") === "home";
        el.classList.toggle("is-active", isHome);
        el.toggleAttribute("hidden", !isHome);
      });
      view = "home";
    }

    setActiveNav(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Intercept nav clicks (hash links)
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

  // Hash changes
  const handleHash = () => showView(normalize(location.hash));
  window.addEventListener("hashchange", handleHash);
  handleHash();

  // Mobile menu
  const menuBtn = document.getElementById("menuBtn");
  const menuOverlay = document.getElementById("menuOverlay");
  const mobileMenu = document.getElementById("mobileMenu");

  document.addEventListener("DOMContentLoaded", () => {
  mobileMenu.hidden = true;
  menuOverlay.hidden = true;
});

  function closeMenu() {
    if (!menuBtn || !menuOverlay || !mobileMenu) return;
    menuBtn.setAttribute("aria-expanded", "false");
    menuOverlay.hidden = true;
    mobileMenu.hidden = true;
  }

  function openMenu() {
    if (!menuBtn || !menuOverlay || !mobileMenu) return;
    menuBtn.setAttribute("aria-expanded", "true");
    menuOverlay.hidden = false;
    mobileMenu.hidden = false;
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });
  }

  if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

})();