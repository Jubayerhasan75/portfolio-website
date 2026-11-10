import { useEffect, useRef, useState } from 'react';
import { Cross, reducedMotion, useOverlay, inertIf } from '../lib/app';
import { profile, skills } from '../data/profile';

/** Slow embers drifting behind the card. Drawn on a 2D canvas; stops when the overlay closes. */
function useEmbers(canvas: React.RefObject<HTMLCanvasElement>, run: boolean) {
  useEffect(() => {
    const cv = canvas.current;
    if (!cv || !run || reducedMotion()) return;
    const ctx = cv.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const size = () => {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener('resize', size);
    const count = Math.round(Math.min(90, (w * h) / 16000));
    const ps = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.2 + 0.4,
      vy: Math.random() * 0.28 + 0.06,
      vx: (Math.random() - 0.5) * 0.18,
      ph: Math.random() * Math.PI * 2,
    }));
    let id = 0;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= p.vy;
        p.x += p.vx + Math.sin(t / 1400 + p.ph) * 0.12;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        const a = 0.35 + 0.45 * Math.sin(t / 700 + p.ph);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, ${150 + Math.round(p.r * 20)}, 70, ${Math.max(0.08, a)})`;
        ctx.shadowColor = 'rgba(255,150,60,.8)';
        ctx.shadowBlur = p.r * 4;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      id = requestAnimationFrame(draw);
    };
    id = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', size);
    };
  }, [canvas, run]);
}

/**
 * The "ability card": a foil trading card in CSS 3D. It tilts towards the
 * pointer, can be dragged around its vertical axis and flips on tap. Rotation is
 * eased in a requestAnimationFrame loop that only runs while the card is open.
 */
export function AbilityCard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const card = useRef<HTMLButtonElement>(null);
  const [pct, setPct] = useState(0);
  const [shown, setShown] = useState(false);
  const m = useRef({ rx: 0, ry: 0, tx: 0, ty: 0, base: 0, drag: false, moved: 0, sx: 0, startBase: 0, px: 50, py: 50, handled: false });
  useOverlay(open, onClose);
  useEmbers(canvas, open);

  // short loader while the portrait decodes
  useEffect(() => {
    if (!open) {
      setShown(false);
      setPct(0);
      m.current.base = 0;
      return;
    }
    let p = 0;
    let loaded = false;
    const img = new Image();
    img.onload = img.onerror = () => (loaded = true);
    img.src = '/img/card-portrait.webp';
    const id = setInterval(() => {
      p = Math.min(100, p + (loaded ? 9 : p < 80 ? 4 : 0));
      setPct(p);
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => setShown(true), 180);
      }
    }, 40);
    return () => clearInterval(id);
  }, [open]);

  useEffect(() => {
    if (!open || !shown) return;
    const st = m.current;
    const el = card.current!;
    const ease = reducedMotion() ? 1 : 0.1;
    let id = 0;
    const loop = () => {
      const targetY = st.base + (st.drag ? 0 : st.tx);
      st.ry += (targetY - st.ry) * ease;
      st.rx += ((st.drag ? 0 : st.ty) - st.rx) * ease;
      el.style.transform = `rotateX(${st.rx.toFixed(2)}deg) rotateY(${st.ry.toFixed(2)}deg)`;
      el.style.setProperty('--px', `${st.px}%`);
      el.style.setProperty('--py', `${st.py}%`);
      el.style.setProperty('--ang', `${(st.ry * 2.2).toFixed(1)}deg`);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [open, shown]);

  const onMove = (e: React.PointerEvent) => {
    const st = m.current;
    if (st.drag) {
      const dx = e.clientX - st.sx;
      st.moved = Math.max(st.moved, Math.abs(dx));
      st.base = st.startBase + dx * 0.6;
      return;
    }
    if (e.pointerType === 'touch') return;
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    st.tx = nx * 34;
    st.ty = -ny * 24;
    st.px = 50 + nx * 120;
    st.py = 50 + ny * 120;
  };
  const onDown = (e: React.PointerEvent) => {
    const st = m.current;
    st.drag = true;
    st.moved = 0;
    st.sx = e.clientX;
    st.startBase = st.base;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onUp = () => {
    const st = m.current;
    if (!st.drag) return;
    st.drag = false;
    st.handled = true;
    // a tap flips; a drag settles on whichever face is nearer
    st.base = st.moved < 6 ? Math.round(st.base / 180) * 180 + 180 : Math.round(st.base / 180) * 180;
  };

  return (
    <div className={`holo${open ? ' on' : ''}`} role="dialog" aria-modal="true" aria-label={`${profile.name}: ability card`} aria-hidden={!open} {...inertIf(!open)} onPointerMove={onMove}>
      <canvas ref={canvas} className="holo__cv" aria-hidden="true" />
      <p className="holo__tag">
        <b>{profile.name}</b>
        <i>Ability card</i>
      </p>

      <div className={`holo__ld${shown ? ' off' : ''}`}>
        <p className="cl__name">{profile.name}</p>
        <div className="cl__line">
          <i style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <p className="cl__row">
          <span>Loading the card</span>
          <span className="tnum">{pct}%</span>
        </p>
      </div>

      <div className={`holo__stage${shown ? ' on' : ''}`}>
        <button
          className="hc"
          ref={card}
          aria-label="Ability card. Press to flip."
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onClick={() => {
            // keyboard and assistive clicks arrive without pointer events
            if (!m.current.handled) m.current.base += 180;
            m.current.handled = false;
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') m.current.base -= 180;
            if (e.key === 'ArrowRight') m.current.base += 180;
          }}
        >
          <span className="hc__face hc__front">
            <span className="hc__name">
              <b>{profile.name}</b>
              <i>CSE</i>
            </span>
            <span className="hc__art">
              <img src="/img/card-portrait.webp" alt="" draggable={false} />
            </span>
            <span className="hc__type">Software Engineer — Full-Stack · AI Automation</span>
            <span className="hc__rows">
              {skills.slice(0, 4).map((s) => (
                <span className="hc__row" key={s.group}>
                  <b>{s.group}</b>
                  <i>{s.items.slice(0, 5).join(' · ')}</i>
                </span>
              ))}
            </span>
            <span className="hc__foot">
              <i>Based in Bangladesh</i>
              <i>East West University</i>
            </span>
            <span className="hc__foil" />
          </span>
          <span className="hc__face hc__back">
            <svg viewBox="-100 -140 200 280" aria-hidden="true">
              <g fill="none" stroke="url(#gold)" strokeWidth="1.4">
                <defs>
                  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#f6e3a8" />
                    <stop offset=".5" stopColor="#c9a45a" />
                    <stop offset="1" stopColor="#8f6a2a" />
                  </linearGradient>
                </defs>
                <rect x="-86" y="-126" width="172" height="252" rx="10" />
                <rect x="-78" y="-118" width="156" height="236" rx="6" strokeWidth=".6" />
                <circle r="58" />
                <circle r="46" strokeWidth=".7" />
                <circle r="30" />
                {Array.from({ length: 24 }, (_, i) => {
                  const a = (i / 24) * Math.PI * 2;
                  return <line key={i} x1={Math.cos(a) * 46} y1={Math.sin(a) * 46} x2={Math.cos(a) * 58} y2={Math.sin(a) * 58} strokeWidth=".7" />;
                })}
                <path d="M0-30V30M-30 0H30M-21-21 21 21M21-21-21 21" strokeWidth=".6" />
              </g>
              <text y="7" textAnchor="middle" fontSize="20" fontWeight="700" fill="#e9d08f" letterSpacing="1">
                {profile.monogram}
              </text>
            </svg>
            <span className="hc__foil" />
          </span>
        </button>
      </div>

      <p className={`hc__hint${shown ? ' on' : ''}`}>
        <span>Move across the card</span>
        <span>Drag to turn it · tap to flip</span>
      </p>
      <button className="chip holo__x" onClick={onClose}>
        <Cross />
        Close
      </button>
    </div>
  );
}
