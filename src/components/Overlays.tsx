import { useEffect, useState } from 'react';
import { ArrowOut, Cross, reducedMotion, useOverlay, inertIf } from '../lib/app';
import { profile } from '../data/profile';
import { rooms, type Project } from '../data/projects';
import './overlays.css';

/** Opening sequence: a counter and one pill per door, then the curtain lifts. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    let ready = false;
    const img = new Image();
    img.src = '/img/figure-1600.webp';
    Promise.all([document.fonts?.ready, img.decode().catch(() => undefined)]).then(() => (ready = true));
    const fallback = setTimeout(() => (ready = true), 4000);
    if (reducedMotion()) {
      setN(100);
      setOut(true);
      onDone();
      return () => clearTimeout(fallback);
    }
    let v = 0;
    const id = setInterval(() => {
      // run freely to 85, then wait for the fonts and the portrait
      v = Math.min(100, v + (v < 85 || ready ? 2 + Math.random() * 3 : 0));
      setN(Math.floor(v));
      if (v >= 100) {
        clearInterval(id);
        setTimeout(() => {
          setOut(true);
          onDone();
        }, 320);
      }
    }, 45);
    return () => {
      clearInterval(id);
      clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown = Math.min(rooms.length, Math.floor((n / 100) * (rooms.length + 1)));
  return (
    <div className={`pre${out ? ' out' : ''}`} aria-hidden="true">
      <p className="pre__brand">
        <b>{profile.name}</b> · Portfolio
      </p>
      <p className="pre__list">{rooms.map((r) => r.nav).join(' · ')}</p>
      <div className="pre__pills">
        <span className="pre__pill on" style={{ ['--c' as string]: '#262323' }}>
          {profile.name}
        </span>
        {rooms.map((r, i) => (
          <span key={r.slug} className={`pre__pill${i < shown ? ' on' : ''}`} style={{ ['--c' as string]: r.door }}>
            {r.title}
          </span>
        ))}
      </div>
      <div className="pre__count">
        <span className="caps">Opening up the work</span>
        <span className="tnum">{String(n).padStart(3, '0')}</span>
      </div>
    </div>
  );
}

/** Case study sheet: the long version of a project card. */
export function ProjectSheet({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [last, setLast] = useState<Project | null>(null);
  useEffect(() => {
    if (project) setLast(project);
  }, [project]);
  useOverlay(!!project, onClose);
  const p = project ?? last;
  const d = p?.detail;

  return (
    <div className={`sheet${project ? ' on' : ''}`} aria-hidden={!project} {...inertIf(!project)} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet__panel" role="dialog" aria-modal="true" aria-labelledby="sheetTitle" data-lenis-prevent>
        {p && d && (
          <>
            <button className="chip sheet__x" onClick={onClose}>
              <Cross />
              Close
            </button>
            <div className="sheet__head">
              <p className="caps">{p.meta}</p>
              <h2 id="sheetTitle">{p.title}</h2>
              <p className="sheet__lead">{d.lead}</p>
              <div className="card__links">
                {p.links.map((l) => (
                  <a key={l.href} className="pill pill--outline pill--sm" href={l.href} target="_blank" rel="noreferrer">
                    <span className="pill__in">
                      {l.label} <ArrowOut />
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {d.gallery && (
              <div className="sheet__gallery">
                {d.gallery.map((g) => (
                  <figure key={g.src} className={g.phone ? 'is-phone' : ''}>
                    <div className="sheet__shot">
                      <img src={g.src} alt={g.alt} loading="lazy" decoding="async" />
                    </div>
                    <figcaption>{g.cap}</figcaption>
                  </figure>
                ))}
              </div>
            )}

            <div className="sheet__cols">
              {d.sections.map((s) => (
                <section key={s.h}>
                  <h3>{s.h}</h3>
                  <ul>
                    {s.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <section className="sheet__stack">
              <h3>Technology</h3>
              <dl>
                {d.stack.map((s) => (
                  <div key={s.layer}>
                    <dt className="caps">{s.layer}</dt>
                    <dd>{s.items}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export function Credits({ open, onClose }: { open: boolean; onClose: () => void }) {
  useOverlay(open, onClose);
  return (
    <div className={`modal${open ? ' on' : ''}`} aria-hidden={!open} {...inertIf(!open)} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal__panel credits" role="dialog" aria-modal="true" aria-labelledby="crTitle">
        <button className="x-btn" onClick={onClose} aria-label="Close">
          <Cross />
        </button>
        <div className="mhead">
          <p className="eyebrow">Privacy & credits</p>
          <h2 id="crTitle">The small print.</h2>
        </div>
        <h3>Privacy</h3>
        <p>
          This site sets no cookies and runs no analytics or trackers. Your light or dark preference is kept in your browser's local storage. The contact form
          sends only what you type into it.
        </p>
        <h3>Credits</h3>
        <p>
          Designed and built by {profile.name} with React, TypeScript and Vite. Smooth scrolling by Lenis. Typeface: Onest (SIL Open Font License). The doors
          concept and interaction design are inspired by the portfolio of Rishi Thakor (therishithakor.com). Project screenshots are captures of my own
          deployed work.
        </p>
      </div>
    </div>
  );
}
