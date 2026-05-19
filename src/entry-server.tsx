import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { getPrerenderRoutes, getRouteSeo, renderSeoHead } from './lib/route-seo';

export function render(url: string) {
  const appHtml = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );

  const seo = getRouteSeo(url);

  return {
    appHtml,
    headHtml: renderSeoHead(seo),
    seo,
  };
}

export { getPrerenderRoutes };
