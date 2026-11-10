import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Lenis from 'lenis';

/* ---------------- routing (two views, so no router dependency) ---------------- */
export type Route = { name: 'home' } | { name: 'room'; slug: string };

export function parseRoute(path: string): Route {
  const m = path.match(/^\/work\/([\w-]+)\/?$/);
  return m ? { name: 'room', slug: m[1] } : { name: 'home' };
}

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
if (typeof window !== 'undefined') window.addEventListener('popstate', emit);

export function pushPath(path: string) {
  if (path !== window.location.pathname) window.history.pushState(null, '', path);
  emit();
}

export function usePath() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => window.location.pathname,
  );
}

/* ---------------- app context ---------------- */
export interface AppApi {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  /** Smooth-scroll to a home section, travelling back from a room first if needed. */
  go: (sectionId: string) => void;
  /** Fade through the passage veil into a room. */
  enterRoom: (slug: string) => void;
  openContact: () => void;
  openCard: () => void;
  openCredits: () => void;
  scrollTo: (target: number | string | HTMLElement, immediate?: boolean) => void;
  route: Route;
}

export const AppCtx = createContext<AppApi>(null as unknown as AppApi);
export const useApp = () => useContext(AppCtx);

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- smooth scroll ---------------- */
export function useLenis(locked: boolean) {
  const ref = useRef<Lenis | null>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), touchMultiplier: 1.4 });
    ref.current = lenis;
    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      ref.current = null;
    };
  }, []);
  useEffect(() => {
    const l = ref.current;
    if (l) locked ? l.stop() : l.start();
    else document.documentElement.style.overflow = locked ? 'hidden' : '';
  }, [locked]);
  return ref;
}

/** Runs `cb` at most once per frame on scroll and resize, and once on mount. */
export function useScrollFrame(cb: () => void, deps: unknown[] = []) {
  useEffect(() => {
    let queued = 0;
    const run = () => {
      queued = 0;
      cb();
    };
    const on = () => {
      if (!queued) queued = requestAnimationFrame(run);
    };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    run();
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      cancelAnimationFrame(queued);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Adds `.in` once the element scrolls into view. */
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/** Live clock in a fixed time zone. */
export function useClock(timeZone: string) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  const time = new Intl.DateTimeFormat('en-GB', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true })
    .format(now)
    .replace(' ', '')
    .toLowerCase();
  const date = new Intl.DateTimeFormat('en-GB', { timeZone, day: 'numeric', month: 'long', year: 'numeric' })
    .format(now)
    .replace(/ (\d{4})$/, ', $1');
  const short = new Intl.DateTimeFormat('en-GB', { timeZone, day: 'numeric', month: 'short' }).format(now);
  return { time, date, short };
}

/** Escape key + focus return for overlays. */
export function useOverlay(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ArrowOut = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const Cross = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

/** React 18 has no typed `inert` prop; spread this to set the attribute. */
export const inertIf = (on: boolean): object => (on ? { inert: '' } : {});
