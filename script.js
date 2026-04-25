(() => {
  const header = document.querySelector(".site-header");
  const getHashTarget = (hash) => {
    if (!hash || hash === "#") return null;
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    return id ? document.getElementById(id) : null;
  };

  const getScrollOffset = () => {
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    const baseGap = mobile ? 0 : 24;
    if (!header) return baseGap;

    const headerPosition = getComputedStyle(header).position;
    const stickyHeader = headerPosition === "sticky" || headerPosition === "fixed";
    return stickyHeader ? header.getBoundingClientRect().height + baseGap : baseGap;
  };

  const scrollToHashTarget = (hash, behavior = "smooth") => {
    if (hash === "#top") {
      window.scrollTo({ top: 0, behavior });
      return;
    }

    const target = getHashTarget(hash);
    if (!target) return;

    const mobileEdgeFix = window.matchMedia("(max-width: 900px)").matches ? 1 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - getScrollOffset() + mobileEdgeFix;
    window.scrollTo({ top: Math.max(0, top), behavior });
  };

  const syncHashScroll = (hash, behavior = "auto") => {
    if (!hash) return;
    scrollToHashTarget(hash, behavior);
    window.setTimeout(() => scrollToHashTarget(hash, "auto"), 60);
    window.setTimeout(() => scrollToHashTarget(hash, "auto"), 240);
  };

  const scrollToPageTop = (behavior = "smooth") => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, behavior });
    window.setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 60);
    window.setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 240);
  };

  // Top / footer logo click: smooth-scroll to the absolute top without reloading
  document.querySelectorAll(".logo-card, .footer-logo").forEach((logo) => {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      if (location.hash) {
        history.replaceState(null, "", location.pathname + location.search);
      }
      scrollToPageTop("smooth");
    });
  });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");

  const close = () => {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const hash = new URL(link.href).hash;
        history.pushState(null, "", hash);
        close();
        syncHashScroll(hash, "smooth");
        return;
      }

      if (e.target.matches("a")) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    const mq = window.matchMedia("(min-width: 901px)");
    mq.addEventListener("change", (e) => { if (e.matches) close(); });
  }

  window.addEventListener("hashchange", () => {
    syncHashScroll(location.hash);
  });

  window.addEventListener("load", () => {
    syncHashScroll(location.hash);
  });

  if (location.hash) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        syncHashScroll(location.hash);
      });
    });
  }
})();
