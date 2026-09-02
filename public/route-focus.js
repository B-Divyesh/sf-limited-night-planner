(() => {
  const storageKey = 'limited-night-planner:last-document-route';
  const route = window.location.pathname.replace(/\/+$/, '') || '/';
  let initialized = false;

  const readLastRoute = () => {
    try {
      return window.sessionStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const writeLastRoute = () => {
    try {
      window.sessionStorage.setItem(storageKey, route);
    } catch {
      // Route focus remains available when browser storage is unavailable.
    }
  };

  const focusAndAnnounce = () => {
    const heading = document.querySelector('main h1');
    if (!heading) return false;

    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });

    let announcer = document.querySelector('#route-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'route-announcer';
      announcer.className = 'route-announcer';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      document.body.append(announcer);
    }

    const name = document.body.dataset.routeName || heading.textContent?.trim() || 'Page';
    window.setTimeout(() => { announcer.textContent = `${name} opened.`; }, 0);
    return true;
  };

  const requestRouteFocus = () => {
    if (document.body.dataset.appRoute === 'true') {
      if (document.documentElement.dataset.routeReady === 'true') {
        focusAndAnnounce();
        return;
      }
      let complete = false;
      const whenPlannerIsReady = () => {
        complete = true;
        window.removeEventListener('limited-night-planner:route-ready', whenPlannerIsReady);
        focusAndAnnounce();
      };
      window.addEventListener('limited-night-planner:route-ready', whenPlannerIsReady, { once: true });
      window.setTimeout(() => {
        if (complete) return;
        window.removeEventListener('limited-night-planner:route-ready', whenPlannerIsReady);
        focusAndAnnounce();
      }, 3_000);
      return;
    }
    if (focusAndAnnounce()) return;
    const observer = new MutationObserver(() => {
      if (focusAndAnnounce()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 3_000);
  };

  const initialize = () => {
    if (initialized) return;
    initialized = true;
    const previousRoute = readLastRoute();
    writeLastRoute();
    if (previousRoute && previousRoute !== route) requestRouteFocus();
  };

  window.addEventListener('pagehide', writeLastRoute);
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    const previousRoute = readLastRoute();
    writeLastRoute();
    if (previousRoute && previousRoute !== route) requestRouteFocus();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
