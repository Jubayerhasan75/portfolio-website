import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Arrow, reducedMotion, useApp } from '../lib/app';
import { profile, roles } from '../data/profile';
import './hero.css';

const HOLES = Array.from({ length: 12 });
const Holes = () => (
  <span className="cal__holes" aria-hidden="true">
    {HOLES.map((_, i) => (
      <i key={i} />
    ))}
  </span>
);

/**
 * Desk flip calendar. The top leaf swings up and over the rings to uncover the
 * next role; the block resizes to fit each word.
 */
function FlipCalendar({ onRole }: { onRole: (i: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [width, setWidth] = useState<number>();
  const measure = useRef<HTMLSpanElement>(null);
  const next = (idx + 1) % roles.length;
  const no = (i: number) => `${String(i + 1).padStart(2, '0')} / ${String(roles.length).padStart(2, '0')}`;

  // The page is sized once, to the longest role, so it never changes size between flips.
  useLayoutEffect(() => {
    const calc = () => {
      const el = measure.current;
      if (!el) return;
      let max = 0;
      for (const r of roles) {
        el.textContent = r.word;
        max = Math.max(max, el.getBoundingClientRect().width);
      }
      setWidth(max);
    };
    calc();
    document.fonts?.ready.then(calc);
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  useEffect(() => {
    const reduce = reducedMotion();
    const hold = setTimeout(() => {
      if (reduce) {
        setIdx(next);
        onRole(next);
        return;
      }
      setFlipping(true);
      onRole(next);
    }, 2600);
    return () => clearTimeout(hold);
  }, [idx, next, onRole]);

  useEffect(() => {
    if (!flipping) return;
    const done = setTimeout(() => {
      setIdx(next);
      setFlipping(false);
    }, 900);
    return () => clearTimeout(done);
  }, [flipping, next]);

  return (
    <span className="cal-line">
      <span className="cal rv" style={{ ['--d' as string]: '520ms' }}>
        <span className="cal__body" style={{ width: width ? `calc(${width}px + 1.9em)` : undefined }}>
          <span className="cal__stand" />
          <span className="cal__stack">
            <span className="cal__back" />
            <span className="cal__page">
              <Holes />
              <span className="cal__word">{roles[next].word}</span>
              <span className="cal__no tnum">{no(next)}</span>
            </span>
            <span className={`cal__leaf${flipping ? ' flip' : ''}`} key={idx}>
              <span className="cal__face">
                <Holes />
                <span className="cal__word">{roles[idx].word}</span>
                <span className="cal__no tnum">{no(idx)}</span>
              </span>
              <span className="cal__rear" />
            </span>
          </span>
          <span className="cal__rings" aria-hidden="true">
            {HOLES.map((_, i) => (
              <i key={i} />
            ))}
          </span>
        </span>
        <span className="cal__measure" ref={measure} aria-hidden="true" />
      </span>
    </span>
  );
}

/**
 * Cut-out portrait. It sits in black and white; the colour version is revealed
 * through a soft circle that follows the pointer (tap toggles it on touch).
 */
function Figure() {
  const { openCard } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);
  const srcset = '/img/figure-900.webp 773w, /img/figure-1600.webp 1373w, /img/figure-2880.webp 2472w';
  const sizes = '(max-width: 900px) 78vw, 40vw';

  const move = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const r = ref.current!.getBoundingClientRect();
    ref.current!.style.setProperty('--mx', `${e.clientX - r.left}px`);
    ref.current!.style.setProperty('--my', `${e.clientY - r.top}px`);
    setLit(true);
  };

  return (
    <div
      className={`fig rv${lit ? ' lit' : ''}`}
      ref={ref}
      style={{ ['--d' as string]: '300ms' }}
      onPointerMove={move}
      onPointerLeave={(e) => e.pointerType !== 'touch' && setLit(false)}
      onClick={(e) => {
        if ((e.nativeEvent as PointerEvent).pointerType === 'touch') {
          const r = ref.current!.getBoundingClientRect();
          ref.current!.style.setProperty('--mx', `${e.clientX - r.left}px`);
          ref.current!.style.setProperty('--my', `${e.clientY - r.top}px`);
          setLit((v) => !v);
        }
      }}
    >
      <img className="fig__base" src="/img/figure-1600.webp" srcSet={srcset} sizes={sizes} alt={`Portrait of ${profile.name}`} width={1374} height={1600} decoding="async" {...{ fetchpriority: 'high' }} />
      <img className="fig__color" src="/img/figure-1600.webp" srcSet={srcset} sizes={sizes} alt="" aria-hidden="true" width={1374} height={1600} decoding="async" />
      <button
        className="fig__card"
        onClick={(e) => {
          e.stopPropagation();
          openCard();
        }}
      >
        My ability card
      </button>
    </div>
  );
}

export function Hero() {
  const { openContact, go } = useApp();
  const [role, setRole] = useState(0);
  const sentence = `Hi, I'm ${profile.shortName}. I am a software engineer, full-stack developer and AI automation developer.`;

  return (
    <section id="home" className="hero">
      <div className="hero__vig" aria-hidden="true" />
      <div className="hero__stage">
        <Figure />
      </div>
      <div className="shell hero__content">
        <div className="hero__left">
          <p className="eyebrow rv" style={{ ['--d' as string]: '200ms' }}>
            Software Engineer
          </p>
          <h1 className="h1">
            <span className="sr-only">{sentence}</span>
            <span aria-hidden="true">
              <span className="line">
                <span style={{ ['--d' as string]: '250ms' }}>Hi, I'm {profile.shortName}.</span>
              </span>
              <span className="line">
                <span className="soft" style={{ ['--d' as string]: '370ms' }}>
                  I am {roles[role].article}
                </span>
              </span>
              <FlipCalendar onRole={setRole} />
            </span>
          </h1>
          <div className="ctas rv" style={{ ['--d' as string]: '750ms' }}>
            <button className="pill pill--dark pill--arrow" onClick={openContact}>
              <span className="pill__in">
                Get in touch
                <span className="pill__badge">
                  <Arrow />
                </span>
              </span>
            </button>
            <button className="pill pill--outline" onClick={() => go('works')}>
              <span className="pill__in">See my work</span>
            </button>
          </div>
        </div>
      </div>
      <div className="shell hero__bar rv" style={{ ['--d' as string]: '900ms' }}>
        <span>Open to collaboration</span>
        <span className="mid">Narayanganj, Bangladesh · Remote</span>
        <button className="scroll" onClick={() => go('works')}>
          Scroll to explore <span aria-hidden="true">↓</span>
        </button>
      </div>
    </section>
  );
}
