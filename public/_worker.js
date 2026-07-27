export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.hostname.endsWith('.pages.dev')) {
      const target = `https://dividend01.com${url.pathname}${url.search}`;
      return Response.redirect(target, 301);
    }
    return fetch(request);
  }
};
