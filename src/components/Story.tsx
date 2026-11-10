import { useRef, useState } from 'react';
import { ArrowOut, clamp, useScrollFrame } from '../lib/app';
import { story } from '../data/profile';
import './story.css';

const DIGITS = Array.from({ length: 10 }, (_, i) => i);

/** Four rolling digit columns, like a mechanical counter. */
function Odometer({ value }: { value: number }) {
  return (
    <div className="story__yr" aria-hidden="true">
      {String(value)
        .padStart(4, '0')
        .split('')
        .map((d, i) => (
          <span className="dg" key={i}>
            <span className="dg__c" style={{ ['--d' as string]: d, ['--i' as string]: i }}>
              {DIGITS.map((n) => (
                <i key={n}>{n}</i>
              ))}
            </span>
          </span>
        ))}
    </div>
  );
}

/** Concentric tick rings that turn backwards as you scroll into the past. */
function Dial() {
  const rings = [
    { r: 250, n: 96, len: 10 },
    { r: 195, n: 60, len: 14 },
    { r: 140, n: 36, len: 9 },
    { r: 88, n: 24, len: 7 },
  ];
  return (
    <svg className="story__dial" viewBox="-270 -270 540 540" aria-hidden="true">
      {rings.map((ring, k) => (
        <g key={k} className="ring" style={{ ['--k' as string]: k, ['--dir' as string]: k % 2 ? 1 : -1 }}>
          <circle r={ring.r} />
          {Array.from({ length: ring.n }, (_, i) => {
            const a = (i / ring.n) * Math.PI * 2;
            const long = i % (ring.n / 12) === 0;
            const r2 = ring.r - (long ? ring.len : ring.len / 2);
            return <line key={i} x1={Math.cos(a) * ring.r} y1={Math.sin(a) * ring.r} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} />;
          })}
        </g>
      ))}
    </svg>
  );
}

export function Story() {
  const section = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(false);

  useScrollFrame(() => {
    const el = section.current;
    const ol = list.current;
    if (!el || !ol) return;
    const vh = window.innerHeight;
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.7) setSeen(true);
    const focus = vh * 0.42;
    let idx = 0;
    const items = Array.from(ol.children) as HTMLElement[];
    items.forEach((li, i) => {
      if (li.getBoundingClientRect().top <= focus) idx = i;
    });
    setActive(idx);
    // progress of the rail and the dial
    const lr = ol.getBoundingClientRect();
    const p = clamp((focus - lr.top) / Math.max(1, lr.height));
    el.style.setProperty('--p', p.toFixed(4));
  });

  const ch = story[active];

  return (
    <section id="about" className={`story${seen ? ' in' : ''}`} ref={section} aria-labelledby="storyTitle">
      <div className="shell story__stage">
        <div className="story__clock">
          <Dial />
          <p className="eyebrow">My story</p>
          <h2 className="story__h" id="storyTitle">
            Let's go back in time.
          </h2>
          <Odometer value={seen ? ch.year : 0} />
          <p className="caps story__when" key={ch.when}>
            {ch.when}
          </p>
          <div className="story__meter" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v5h5" />
              <path d="M12 7v5l3 2" />
            </svg>
            <span className="tnum story__count">{String(active + 1).padStart(2, '0')}</span>
            <span className="tnum story__of">/ {String(story.length).padStart(2, '0')}</span>
            <i className="story__bar">
              <b style={{ transform: `scaleX(${(active + 1) / story.length})` }} />
            </i>
          </div>
        </div>

        <div className="story__line">
          <span className="story__rail" aria-hidden="true">
            <span className="story__fill" />
            <span className="story__dot" />
          </span>
          <ol className="story__list" ref={list}>
            {story.map((c, i) => (
              <li key={c.title} className={`ch${i === active ? ' on' : ''}${i < active ? ' past' : ''}`}>
                <p className="caps ch__date">{c.when}</p>
                <h3 className="ch__t">{c.title}</h3>
                <p className="ch__org">
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noreferrer">
                      {c.org} <ArrowOut />
                    </a>
                  ) : (
                    c.org
                  )}
                </p>
                {c.points.length > 0 && (
                  <ul className="ch__b">
                    {c.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
