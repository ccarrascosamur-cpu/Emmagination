export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    // Serve static assets from the dist directory
    return fetch(new Request(url.toString(), request));
  },
};
