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
      a.classList.toggle("is-active", target === view);
      a.setAttribute("aria-current", target === view ? "page" : "false");
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

    // fallback
    if (!found) {
      views.forEach((el) => {
        const isHome = el.getAttribute("data-view") === "home";
        el.classList.toggle("is-active", isHome);
        el.toggleAttribute("hidden", !isHome);
      });
      view = "home";
    }

    setActiveNav(view);
    // Keep user at top of content when switching
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Click handling
  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "#home";
      const view = normalize(href);
      // let normal links work (mailto, external)
      if (!href.startsWith("#")) return;
      e.preventDefault();
      if (location.hash !== `#${view}`) location.hash = view;
      else showView(view); // if clicking the active hash
    });
  });

  // Initial + hash changes
  const handleHash = () => showView(normalize(location.hash));
  window.addEventListener("hashchange", handleHash);
  handleHash();
})();