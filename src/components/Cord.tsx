import { useEffect, useRef } from 'react';
import { reducedMotion, useApp } from '../lib/app';

const N = 16; // points along the rope
const GRAVITY = 0.6;
const DAMPING = 0.982;
const STRETCH = 90; // how far past its resting length the cord can be pulled, in px
const PULL = 36; // pull distance that flips the lights

interface P {
  x: number;
  y: number;
  px: number;
  py: number;
}

/**
 * The lamp pull cord, simulated as a rope: a chain of points joined by fixed-length
 * links (Verlet integration), hanging from the top of the page with a weighted bead
 * on the end. Grab the bead and it follows the pointer in any direction; let go and
 * the rope swings and settles by itself. A firm pull, a click or Enter switches
 * between the light and dark themes. The loop sleeps once the rope is at rest.
 */
export function Cord() {
  const { toggleTheme, theme } = useApp();
  const wrap = useRef<HTMLDivElement>(null);
  const rope = useRef<SVGPathElement>(null);
  const twist = useRef<SVGPathElement>(null);
  const shade = useRef<SVGPathElement>(null);
  const bead = useRef<SVGGElement>(null);
  const hit = useRef<HTMLButtonElement>(null);
  const toggle = useRef(toggleTheme);
  toggle.current = toggleTheme;

  const sim = useRef({
    pts: [] as P[],
    rest: 150,
    seg: 10,
    len: 10, // current link length; longer than `seg` while the cord is stretched
    drag: false,
    tx: 0,
    ty: 0,
    ax: 0, // anchor position on screen
    moved: 0,
    downX: 0,
    downY: 0,
    still: 0,
    raf: 0,
  });

  useEffect(() => {
    const s = sim.current;

    const layout = () => {
      s.rest = window.matchMedia('(max-width: 900px)').matches ? 96 : 150;
      s.seg = s.len = s.rest / (N - 1);
      s.pts = Array.from({ length: N }, (_, i) => ({ x: 0, y: i * s.seg, px: 0, py: i * s.seg }));
      wrap.current?.style.setProperty('--rest', `${s.rest}px`);
      // let the rope find its hanging shape before it is first shown, so it does not shift when touched
      for (let i = 0; i < 240; i++) tick();
      draw();
    };

    const draw = () => {
      const p = s.pts;
      if (!p.length) return;
      // a smooth curve through the midpoints of the links
      let d = `M${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
      for (let i = 1; i < N - 1; i++) {
        const mx = (p[i].x + p[i + 1].x) / 2;
        const my = (p[i].y + p[i + 1].y) / 2;
        d += `Q${p[i].x.toFixed(1)} ${p[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      const e = p[N - 1];
      d += `L${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
      rope.current?.setAttribute('d', d);
      twist.current?.setAttribute('d', d);
      shade.current?.setAttribute('d', d);
      const a = (Math.atan2(e.y - p[N - 3].y, e.x - p[N - 3].x) * 180) / Math.PI - 90;
      bead.current?.setAttribute('transform', `translate(${e.x.toFixed(1)} ${e.y.toFixed(1)}) rotate(${a.toFixed(1)})`);
      if (hit.current) hit.current.style.transform = `translate(${(e.x - 22).toFixed(1)}px, ${(e.y - 8).toFixed(1)}px)`;
    };

    /** One physics step. Returns how much the rope moved. */
    const tick = () => {
      const p = s.pts;
      let energy = 0;
      for (let i = 1; i < N; i++) {
        const q = p[i];
        const vx = (q.x - q.px) * DAMPING;
        const vy = (q.y - q.py) * DAMPING;
        q.px = q.x;
        q.py = q.y;
        q.x += vx;
        q.y += vy + GRAVITY;
        energy += Math.abs(vx) + Math.abs(vy);
      }
      // the stretched cord springs back to its natural length
      if (!s.drag) s.len += (s.seg - s.len) * 0.3;

      for (let k = 0; k < 14; k++) {
        p[0].x = 0;
        p[0].y = 0;
        if (s.drag) {
          p[N - 1].x = s.tx;
          p[N - 1].y = s.ty;
        }
        for (let i = 0; i < N - 1; i++) {
          const a = p[i];
          const b = p[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const diff = (dist - s.len) / dist;
          // the anchor never moves, a held bead never moves, and a free bead is heavy
          const aFixed = i === 0;
          const bFixed = s.drag && i + 1 === N - 1;
          const bHeavy = !s.drag && i + 1 === N - 1;
          const wa = aFixed ? 0 : bFixed ? 1 : bHeavy ? 0.8 : 0.5;
          const wb = bFixed ? 0 : aFixed ? 1 : bHeavy ? 0.2 : 0.5;
          a.x += dx * diff * wa;
          a.y += dy * diff * wa;
          b.x -= dx * diff * wb;
          b.y -= dy * diff * wb;
        }
      }
      return energy;
    };

    const step = () => {
      const energy = tick();
      draw();
      // once it is hanging still, stop asking for frames
      s.still = !s.drag && energy < 0.4 && Math.abs(s.len - s.seg) < 0.02 ? s.still + 1 : 0;
      s.raf = s.still > 30 ? 0 : requestAnimationFrame(step);
    };

    const wake = () => {
      s.still = 0;
      if (!s.raf) s.raf = requestAnimationFrame(step);
    };

    const tug = () => {
      toggle.current();
      if (reducedMotion()) return;
      // a short, sharp pull: stretch the cord and let it snap back with a little sideways swing
      s.len = s.seg * 1.22;
      for (let i = N - 4; i < N; i++) s.pts[i].px -= 1.6;
      wake();
    };

    const el = hit.current!;
    const onDown = (e: PointerEvent) => {
      if (reducedMotion()) return;
      const r = wrap.current!.getBoundingClientRect();
      s.ax = r.left + r.width / 2;
      s.drag = true;
      s.moved = 0;
      s.downX = e.clientX;
      s.downY = e.clientY;
      const end = s.pts[N - 1];
      s.tx = end.x;
      s.ty = end.y;
      el.setPointerCapture(e.pointerId);
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (!s.drag) return;
      s.moved = Math.max(s.moved, Math.hypot(e.clientX - s.downX, e.clientY - s.downY));
      let x = e.clientX - s.ax;
      let y = Math.max(6, e.clientY);
      // the cord gives a little, then holds
      const max = s.rest + STRETCH;
      const dist = Math.hypot(x, y);
      if (dist > max) {
        x *= max / dist;
        y *= max / dist;
      }
      s.tx = x;
      s.ty = y;
      s.len = Math.max(s.seg, dist > max ? max / (N - 1) : dist / (N - 1));
    };
    const onUp = () => {
      if (!s.drag) return;
      s.drag = false;
      const pulled = Math.hypot(s.tx, s.ty) - s.rest;
      if (s.moved < 5) tug();
      else if (pulled > PULL) toggle.current();
      wake();
    };
    // keyboard and assistive-technology activation arrive as a click with no pointer
    const onClick = (e: MouseEvent) => {
      if (e.detail === 0 || reducedMotion()) tug();
    };

    layout();
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('click', onClick);
    window.addEventListener('resize', layout);
    return () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('click', onClick);
      window.removeEventListener('resize', layout);
    };
  }, []);

  return (
    <div className="cord" ref={wrap}>
      <svg className="cord__svg" width="2" height="2" aria-hidden="true">
        <defs>
          <radialGradient id="cordBead" cx="35%" cy="28%" r="80%">
            <stop offset="0" stopColor="#c98a5a" />
            <stop offset=".45" stopColor="#8a4f2c" />
            <stop offset="1" stopColor="#4b2715" />
          </radialGradient>
        </defs>
        <path ref={shade} className="cord__shade" />
        <path ref={rope} className="cord__rope" />
        <path ref={twist} className="cord__twist" />
        <g ref={bead}>
          <ellipse className="cord__shade" cx="4" cy="17" rx="7.5" ry="13.5" />
          <ellipse cx="0" cy="12" rx="7.5" ry="13.5" fill="url(#cordBead)" />
        </g>
      </svg>
      <button
        ref={hit}
        className="cord__bead"
        aria-label={theme === 'light' ? 'Pull the cord to turn the lights off' : 'Pull the cord to turn the lights on'}
        aria-pressed={theme === 'dark'}
      />
    </div>
  );
}
