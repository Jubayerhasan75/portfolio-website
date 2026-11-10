import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AppCtx, clamp, parseRoute, pushPath, useLenis, usePath, type AppApi } from './lib/app';
import { roomBySlug, type Project } from './data/projects';
import { Header, NavMenu } from './components/Header';
import { Cord } from './components/Cord';
import { Hero } from './components/Hero';
import { Doors } from './components/Doors';
import { Story } from './components/Story';
import { TechStack } from './components/TechStack';
import { Footer } from './components/Footer';
import { Room } from './components/Room';
import { ContactModal } from './components/ContactModal';
import { AbilityCard } from './components/AbilityCard';
import { Credits, Preloader, ProjectSheet } from './components/Overlays';

function ToTop({ onClick }: { onClick: () => void }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => setP(clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)));
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const C = 2 * Math.PI * 21.5;
  return (
    <button className={`totop${p > 0.08 ? ' on' : ''}`} onClick={onClick} aria-label="Back to top">
      <svg className="ring" viewBox="0 0 47 47" aria-hidden="true">
        <circle cx="23.5" cy="23.5" r="21.5" strokeDasharray={C} strokeDashoffset={C * (1 - p)} />
      </svg>
      <svg className="ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}

export default function App() {
  const path = usePath();
  const route = useMemo(() => parseRoute(path), [path]);
  const room = route.name === 'room' ? roomBySlug(route.slug) : undefined;

  const [theme, setTheme] = useState<'light' | 'dark'>(() => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'));
  const [loaded, setLoaded] = useState(false);
  const [veil, setVeil] = useState(false);
  const [menu, setMenu] = useState(false);
  const [contact, setContact] = useState(false);
  const [card, setCard] = useState(false);
  const [credits, setCredits] = useState(false);
  const [sheet, setSheet] = useState<Project | null>(null);

  const locked = !loaded || veil || menu || contact || card || credits || !!sheet;
  const lenis = useLenis(locked);
  const pending = useRef<string | null>(null);
  const busy = useRef(false);

  const scrollTo = useCallback<AppApi['scrollTo']>(
    (target, immediate = false) => {
      const l = lenis.current;
      if (l) return l.scrollTo(target as never, { immediate, force: true, duration: 1.5 });
      const y = typeof target === 'number' ? target : (typeof target === 'string' ? document.querySelector(target) : target)?.getBoundingClientRect().top ?? 0;
      window.scrollTo({ top: typeof target === 'number' ? y : y + window.scrollY, behavior: immediate ? 'auto' : 'smooth' });
    },
    [lenis],
  );

  /** Fade to black, swap the view, fade back in. */
  const travel = useCallback((to: string, section: string | null = null) => {
    if (busy.current) return;
    busy.current = true;
    setVeil(true);
    setTimeout(() => {
      pending.current = section;
      pushPath(to);
      setTimeout(() => {
        setVeil(false);
        busy.current = false;
      }, 220);
    }, 460);
  }, []);

  // after every view change, land on the right spot before the veil lifts
  useLayoutEffect(() => {
    const id = pending.current;
    pending.current = null;
    const el = id ? document.getElementById(id) : null;
    lenis.current?.resize();
    scrollTo(el ? el.getBoundingClientRect().top + window.scrollY : 0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    document.title = room ? `${room.title} — Md. Jubayer Hasan` : 'Md. Jubayer Hasan — Software Engineer, Full-Stack Developer & AI Automation';
  }, [room]);

  const api = useMemo<AppApi>(
    () => ({
      theme,
      route,
      scrollTo,
      toggleTheme: () => {
        const root = document.documentElement;
        root.classList.add('theme-fade');
        setTimeout(() => root.classList.remove('theme-fade'), 800);
        setTheme((t) => {
          const next = t === 'light' ? 'dark' : 'light';
          root.dataset.theme = next;
          document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#1A1818' : '#E8E4E0');
          try {
            localStorage.setItem('theme', next);
          } catch {
            /* private mode */
          }
          return next;
        });
      },
      go: (id) => {
        if (parseRoute(window.location.pathname).name === 'home') scrollTo(id === 'home' ? 0 : `#${id}`);
        else travel('/', id);
      },
      enterRoom: (slug) => travel(`/work/${slug}`),
      openContact: () => setContact(true),
      openCard: () => setCard(true),
      openCredits: () => setCredits(true),
    }),
    [theme, route, scrollTo, travel],
  );

  // unknown room slug: fall back to the home page
  useEffect(() => {
    if (route.name === 'room' && !room) pushPath('/');
  }, [route, room]);

  return (
    <AppCtx.Provider value={api}>
      <div className={`app${loaded ? ' ready' : ''}${room ? ' room-view' : ''}`}>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header onMenu={() => setMenu(true)} />
        <Cord />

        {room ? (
          <Room key={room.slug} room={room} onOpen={setSheet} />
        ) : (
          <>
            <main id="main">
              <Hero />
              <Doors />
              <TechStack />
              <Story />
            </main>
            <Footer />
          </>
        )}

        <ToTop onClick={() => scrollTo(0)} />
        <div className={`veil${veil ? ' on' : ''}`} aria-hidden="true" />
        <NavMenu open={menu} onClose={() => setMenu(false)} />
        <ProjectSheet project={sheet} onClose={() => setSheet(null)} />
        <ContactModal open={contact} onClose={() => setContact(false)} />
        <Credits open={credits} onClose={() => setCredits(false)} />
        <AbilityCard open={card} onClose={() => setCard(false)} />
        <Preloader onDone={() => setLoaded(true)} />
      </div>
    </AppCtx.Provider>
  );
}
