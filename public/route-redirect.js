(() => {
  const url = new URL(window.location.href);
  if (url.pathname === '/' && url.searchParams.get('demo') === '1') {
    window.location.replace('/demo/');
  }
})();
