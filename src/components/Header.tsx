import { useEffect, useRef, useState } from 'react';
import { Cross, useApp, useClock, useOverlay, inertIf } from '../lib/app';
import { profile } from '../data/profile';
import { rooms } from '../data/projects';
import './header.css';

interface Item {
  label: string;
  run: () => void;
  current: boolean;
}

function useItems(): Item[] {
  const { go, enterRoom, openContact, route } = useApp();
  return [
    { label: 'Home', run: () => go('home'), current: route.name === 'home' },
    ...rooms.map((r) => ({
      label: r.nav,
      run: () => enterRoom(r.slug),
      current: route.name === 'room' && route.slug === r.slug,
    })),
    { label: 'My story', run: () => go('about'), current: false },
    { label: 'Contact', run: openContact, current: false },
  ];
}

export function Header({ onMenu }: { onMenu: () => void }) {
  const items = useItems();
  const clock = useClock(profile.timeZone);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const on = () => setStuck(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`hdr rv${stuck ? ' is-stuck' : ''}`}>
      <div className="shell hdr__in">
        <nav aria-label="Primary" className="hdr__nav">
          <ul className="nav">
            {items.map((it) => (
              <li key={it.label}>
                <button onClick={it.run} aria-current={it.current ? 'page' : undefined}>
                  <span>{it.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <button className="chip menu-btn" onClick={onMenu} aria-haspopup="dialog" aria-label="Open menu">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <span>Menu</span>
        </button>
        <div className="chip clock" aria-label={`Dhaka time ${clock.time}`}>
          <span className="clock__lbl">Dhaka time</span>
          <span className="clock__time tnum">{clock.time}</span>
          <span className="clock__sep" aria-hidden="true">
            •
          </span>
          <span className="clock__date">{clock.date}</span>
          <span className="clock__ds">{clock.short}</span>
        </div>
      </div>
    </header>
  );
}

export function NavMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useItems();
  const clock = useClock(profile.timeZone);
  const { openContact } = useApp();
  const first = useRef<HTMLButtonElement>(null);
  useOverlay(open, onClose);
  useEffect(() => {
    if (open) first.current?.focus();
  }, [open]);

  return (
    <div className={`navm${open ? ' on' : ''}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open} {...inertIf(!open)}>
      <div className="shell navm__top">
        <span className="navm__brand">{profile.shortName}</span>
        <button className="chip" onClick={onClose} ref={first}>
          <Cross />
          <span>Close</span>
        </button>
      </div>
      <nav className="shell navm__nav" aria-label="Menu">
        <ul>
          {items.map((it, i) => (
            <li key={it.label} style={{ ['--i' as string]: i }}>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(it.run, 260);
                }}
              >
                <small className="tnum">{String(i + 1).padStart(2, '0')}</small>
                <span>{it.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="shell navm__bot">
        <span>
          Dhaka time — <span className="tnum">{clock.time}</span>
        </span>
        <button
          onClick={() => {
            onClose();
            setTimeout(openContact, 260);
          }}
        >
          Get in touch →
        </button>
      </div>
    </div>
  );
}
