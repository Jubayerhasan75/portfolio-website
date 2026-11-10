import { useEffect, useRef, useState } from 'react';
import { ArrowOut, clamp, reducedMotion, useApp, useInView, useScrollFrame } from '../lib/app';
import type { Project, Room as RoomData, Shot, Stage } from '../data/projects';
import { Footer } from './Footer';
import './room.css';

/** src plus, when a 4K sibling exists, a srcset so large and high-density screens get it. */
const pic = (s: Shot, sizes = '(max-width: 900px) 92vw, 46vw') =>
  s.hi ? { src: s.src, srcSet: `${s.src} 1920w, ${s.src.replace('.webp', '-4k.webp')} 3840w`, sizes } : { src: s.src };

/** Plays a muted loop only while its card is on screen. */
function Clip({ video, active }: { video: { src: string; poster: string; label: string }; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active && !reducedMotion()) v.play().catch(() => undefined);
    else v.pause();
  }, [active]);
  return <video ref={ref} src={video.src} poster={video.poster} muted loop playsInline preload="metadata" aria-label={video.label} />;
}

/** Crossfades through real screenshots while the card is on screen. */
function Slides({ shots, active }: { shots: Shot[]; active: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active || shots.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % shots.length), 3400);
    return () => clearInterval(id);
  }, [active, shots.length]);
  return (
    <>
      {shots.map((s, k) => (
        <img key={s.src} {...pic(s)} alt={k === i ? s.alt : ''} aria-hidden={k !== i} className={k === i ? 'on' : ''} loading="lazy" decoding="async" />
      ))}
      {shots.length > 1 && (
        <span className="slides__dots">
          {shots.map((s, k) => (
            <i key={s.src} className={k === i ? 'on' : ''} />
          ))}
        </span>
      )}
    </>
  );
}

function Monitor({ shots, active, video, zoom }: { shots: Shot[]; active: boolean; zoom?: boolean; video?: { src: string; poster: string; label: string } }) {
  return (
    <div className="mon">
      <div className="mon__body">
        <div className={`mon__screen${video ? ' mon__screen--clip' : ''}${zoom ? ' mon__screen--zoom' : ''}`}>
          {video ? <Clip video={video} active={active} /> : <Slides shots={shots} active={active} />}
        </div>
      </div>
      <div className="mon__neck" />
      <div className="mon__foot" />
    </div>
  );
}

function StageView({ stage, active }: { stage: Stage; active: boolean }) {
  switch (stage.kind) {
    case 'monitor':
      return <Monitor shots={stage.shots} active={active} video={stage.video} zoom={stage.zoom} />;
    case 'phones':
      return (
        <div className="phones">
          {stage.shots.map((s) => (
            <div className="phone phone--solo" key={s.src}>
              <div className="phone__screen">
                <img {...pic(s, '(max-width: 900px) 42vw, 16vw')} alt={s.alt} loading="lazy" decoding="async" />
              </div>
            </div>
          ))}
        </div>
      );
    case 'gallery':
      return (
        <div className="poster">
          <Slides shots={stage.shots} active={active} />
        </div>
      );
    case 'phone':
      return (
        <div className="phone phone--solo">
          <div className="phone__screen" style={{ background: stage.bg }}>
            <img {...pic(stage.shot, '(max-width: 900px) 60vw, 20vw')} alt={stage.shot.alt} style={{ objectFit: stage.fit ?? 'cover', objectPosition: stage.fit === 'contain' ? 'center' : undefined }} loading="lazy" decoding="async" />
          </div>
        </div>
      );
    case 'image':
      return (
        <figure className="plate-img">
          <img {...pic(stage.shot, '(max-width: 900px) 80vw, 30vw')} alt={stage.shot.alt} loading="lazy" decoding="async" />
        </figure>
      );
    case 'duo':
      return (
        <div className="duo">
          <Monitor shots={stage.shots} active={active} />
          <div className="phone">
            <div className="phone__screen">
              <img src={stage.phone} alt="The same site on a phone" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      );
    case 'window':
      return (
        <div className="win">
          <div className="win__bar">
            <i />
            <i />
            <i />
            <span>{stage.title}</span>
          </div>
          <img src={stage.shot.src} alt={stage.shot.alt} loading="lazy" decoding="async" />
        </div>
      );
    case 'repo':
      return (
        <div className="win win--code" role="img" aria-label={`Files in the ${stage.repo} repository`}>
          <div className="win__bar">
            <i />
            <i />
            <i />
            <span>{stage.repo}</span>
          </div>
          <ol className="tree">
            {stage.lines.map((l, k) => {
              const cut = l.lastIndexOf('/');
              return (
                <li key={l} style={{ ['--k' as string]: k }}>
                  <span className="tree__n tnum">{String(k + 1).padStart(2, '0')}</span>
                  <span className="tree__d">{cut >= 0 ? l.slice(0, cut + 1) : ''}</span>
                  {l.slice(cut + 1)}
                </li>
              );
            })}
          </ol>
        </div>
      );
    case 'flow':
      return (
        <figure className="flow">
          <ol>
            {stage.steps.map((s, k) => (
              <li key={s} style={{ ['--k' as string]: k }}>
                <span className="tnum">{String(k + 1).padStart(2, '0')}</span>
                {s}
              </li>
            ))}
          </ol>
          <figcaption className="caps">{stage.caption}</figcaption>
        </figure>
      );
    case 'paper':
      return (
        <div className="paper">
          <p className="caps">{stage.venue}</p>
          <p className="paper__t">{stage.title}</p>
          <p className="paper__a">{stage.authors}</p>
          <div className="paper__lines" aria-hidden="true">
            {Array.from({ length: 7 }, (_, k) => (
              <i key={k} />
            ))}
          </div>
          <p className="paper__d">
            {stage.date} · DOI {stage.doi}
          </p>
        </div>
      );
  }
}

function Card({ project, index, onOpen }: { project: Project; index: number; onOpen: (p: Project) => void }) {
  const [ref, seen] = useInView<HTMLElement>(0.25);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return (
    <article className={`card${index % 2 ? ' flip' : ''}${seen ? ' seen' : ''}`} ref={ref} style={{ ['--i' as string]: index }} aria-labelledby={`p-${project.id}`}>
      <div className="card__in">
        <div className="card__info">
          <p className="caps card__meta">{project.meta}</p>
          <h2 id={`p-${project.id}`}>{project.title}</h2>
          <p className="sub">{project.sub}</p>
          <p className="desc">{project.desc}</p>
          <ul className="tags">
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="card__links">
            {project.detail && (
              <button className="pill pill--dark pill--sm" onClick={() => onOpen(project)}>
                <span className="pill__in">Read the case study</span>
              </button>
            )}
            {project.links.map((l) => (
              <a key={l.href} className="pill pill--outline pill--sm" href={l.href} target="_blank" rel="noreferrer">
                <span className="pill__in">
                  {l.label} <ArrowOut />
                </span>
              </a>
            ))}
          </div>
          {project.note && <p className="note">{project.note}</p>}
        </div>
        <div className="stage">
          <StageView stage={project.stage} active={active} />
        </div>
      </div>
      <div className="card__dim" />
    </article>
  );
}

export function Room({ room, onOpen }: { room: RoomData; onOpen: (p: Project) => void }) {
  const { go } = useApp();
  const stack = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // As the next card slides over, the one underneath dims and settles back.
  useScrollFrame(() => {
    const cards = stack.current ? (Array.from(stack.current.children) as HTMLElement[]) : [];
    cards.forEach((c, i) => {
      const next = cards[i + 1];
      let cover = 0;
      if (next) {
        const r = c.getBoundingClientRect();
        cover = clamp(1 - (next.getBoundingClientRect().top - r.top) / r.height);
      }
      c.style.setProperty('--cover', cover.toFixed(3));
    });
  }, [room.slug]);

  return (
    <div className={`roomp${ready ? ' ready' : ''}`} style={{ ['--door' as string]: room.door }}>
      <div className="roomp__glow" aria-hidden="true" />
      <main id="main" className="shell roomp__wrap">
        <section className="intro">
          <h1 className="line">
            <span>{room.title}</span>
          </h1>
          <p className="rv" style={{ ['--d' as string]: '200ms' }}>
            {room.intro}
          </p>
        </section>
        <section className="stack" ref={stack} aria-label="Projects">
          {room.projects.map((p, i) => (
            <Card key={p.id} project={p} index={i} onOpen={onOpen} />
          ))}
        </section>
      </main>
      <Footer />
      <button className="chip backd" onClick={() => go('works')}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        Back to the doors
      </button>
    </div>
  );
}
