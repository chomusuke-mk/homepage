import { ui, defaultLang, languages } from './ui';

export { languages, defaultLang, ui };
export type Lang = keyof typeof ui;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang]?.[key] || ui[defaultLang][key] || key;
  };
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string, targetLang: string = lang) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (targetLang === defaultLang) {
      return cleanPath.replace(/^\/en(?=\/|$)/, '') || '/';
    }
    if (cleanPath.startsWith('/en/') || cleanPath === '/en') {
      return cleanPath;
    }
    return `/en${cleanPath === '/' ? '' : cleanPath}`;
  };
}
