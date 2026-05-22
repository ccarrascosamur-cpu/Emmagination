import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { defaultSiteData, normalizeSiteData, type SiteData } from './site-data';

const SITE_DATA_API_URL = '/api/data';

interface SiteDataContextValue {
  data: SiteData;
  isRemoteLoaded: boolean;
}

const SiteDataContext = createContext<SiteDataContextValue>({
  data: defaultSiteData,
  isRemoteLoaded: false,
});

function readCachedSiteData() {
  if (typeof window === 'undefined') return defaultSiteData;

  try {
    const raw = window.localStorage.getItem('emmagination-site-data');
    return raw ? normalizeSiteData(JSON.parse(raw)) : defaultSiteData;
  } catch {
    return defaultSiteData;
  }
}

function cacheSiteData(data: SiteData) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem('emmagination-site-data', JSON.stringify(data));
  } catch {
    // ignore local cache failures
  }
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(() => readCachedSiteData());
  const [isRemoteLoaded, setIsRemoteLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const url = `${SITE_DATA_API_URL}?_t=${Date.now()}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            Pragma: 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load site data: ${response.status}`);
        }

        const payload = normalizeSiteData(await response.json());
        if (!isMounted) return;

        setData(payload);
        cacheSiteData(payload);
      } catch {
        if (!isMounted) return;
        setData(readCachedSiteData());
      } finally {
        if (isMounted) {
          setIsRemoteLoaded(true);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({ data, isRemoteLoaded }),
    [data, isRemoteLoaded],
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
