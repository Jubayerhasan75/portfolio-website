import { useEffect, useRef, useState } from 'react';
import { clamp, reducedMotion, useApp, useScrollFrame } from '../lib/app';
import { rooms } from '../data/projects';
import './doors.css';

/**
 * The wall of doors. Nothing opens by itself: hovering a door pushes it ajar and
 * shows its summary; clicking swings it open and the view travels through it
 * into the room. On touch screens the wall is a swipeable, snapping row.
 */
export function Doors() {
  const { enterRoom } = useApp();
  const section = useRef<HTMLElement>(null);
  const wall = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLUListElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const tour = -1; // doors only react to the pointer; nothing opens on scroll
  const [hover, setHover] = useState(-1);
  const [entering, setEntering] = useState(-1);
  const [swipe, setSwipe] = useState(0); // active door in the mobile swipe row
  const [seen, setSeen] = useState(false);
  const n = rooms.length;

  useScrollFrame(() => {
    const el = section.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.75) setSeen(true);
  });

  // mobile: track which door is centred in the swipe row
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const on = () => {
      const unit = el.firstElementChild as HTMLElement | null;
      if (!unit) return;
      const step = unit.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0');
      setSwipe(clamp(Math.round(el.scrollLeft / step), 0, n - 1));
    };
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, [n]);

  const enter = (i: number, target: HTMLElement) => {
    if (entering >= 0) return;
    setEntering(i);
    setHover(-1);
    const w = wall.current;
    if (w && !reducedMotion()) {
      const wr = w.getBoundingClientRect();
      const dr = target.getBoundingClientRect();
      w.style.transformOrigin = `${dr.left + dr.width / 2 - wr.left}px ${dr.top + dr.height * 0.55 - wr.top}px`;
    }
    setTimeout(() => enterRoom(rooms[i].slug), reducedMotion() ? 0 : 950);
  };

  const active = hover >= 0 ? hover : tour;
  const info = active >= 0 ? active : swipe;
  const mode = entering >= 0 ? 'entering' : tour >= 0 && hover < 0 ? 'tour' : 'wall';

  return (
    <section id="works" className={`doors doors--${mode}${seen ? ' in' : ''}`} ref={section} aria-labelledby="doorsTitle" style={{ ['--n' as string]: n }}>
      <div className="doors__pin">
        <div className="doors__wall" ref={wall}>
          <div className="shell doors__inner">
            <h2 className="sr-only" id="doorsTitle">
              My work, one door per skill
            </h2>
            <p className="paint" aria-hidden="true">
              Magic happens <br className="mbr" />
              behind the doors
            </p>
            <p className="doors__hint" aria-hidden="true">
              Swipe along the wall
            </p>

            <ul className="doors__row" ref={row}>
              {rooms.map((room, i) => {
                const isActive = active === i;
                const open = entering === i ? 'open' : isActive ? 'ajar' : '';
                return (
                  <li
                    key={room.slug}
                    className={`unit ${open}${hover < 0 && tour >= 0 && tour !== i ? ' dim' : ''}${i >= n / 2 ? ' unit--right' : ''}`}
                    style={{ ['--i' as string]: i, ['--door' as string]: room.door, ['--door-dk' as string]: room.doorDark }}
                  >
                    <button
                      className="doorway"
                      aria-label={`Open the ${room.plate} door`}
                      aria-description={`${room.tagline}: ${room.points.join(', ')}`}
                      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(i)}
                      onPointerLeave={() => setHover(-1)}
                      onPointerMove={(e) => {
                        if (e.pointerType !== 'mouse' || !cursor.current) return;
                        cursor.current.style.transform = `translate3d(${e.clientX + 16}px, ${e.clientY + 14}px, 0)`;
                      }}
                      onFocus={() => setHover(i)}
                      onBlur={() => setHover(-1)}
                      onClick={(e) => enter(i, e.currentTarget)}
                    >
                      <span className="casing" />
                      <span className="opening">
                        <span className="room" />
                        <span className="door">
                          <span className="door__flute" />
                          <span className="plate">{room.plate}</span>
                          <span className="handle">
                            <span className="handle__lever" />
                            <span className="handle__lock" />
                          </span>
                          <span className="door__shade" />
                        </span>
                        <span className="sill" />
                      </span>
                      <span className="pool" />
                    </button>
                    <div className={`dinfo${isActive && entering < 0 ? ' on' : ''}`} aria-hidden="true">
                      <h3 className="dinfo__h">{room.title}</h3>
                      <p className="dinfo__t">{room.tagline}</p>
                      <ul className="dinfo__p">
                        {room.points.map((p, k) => (
                          <li key={p} style={{ ['--k' as string]: k }}>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* mobile summary + dots */}
            <div className="minfo" aria-live="polite">
              <h3 className="dinfo__h">{rooms[info].title}</h3>
              <p className="dinfo__t">{rooms[info].tagline}</p>
              <p className="doors__dots" aria-hidden="true">
                {rooms.map((r, i) => (
                  <i key={r.slug} className={i === swipe ? 'on' : ''} />
                ))}
              </p>
            </div>
          </div>
          <div className="doors__base" aria-hidden="true" />
          <div className="doors__floor" aria-hidden="true" />
        </div>
      </div>
      <div className={`door-cursor${hover >= 0 && entering < 0 ? ' on' : ''}`} ref={cursor} aria-hidden="true">
        Click to enter
      </div>
    </section>
  );
}
