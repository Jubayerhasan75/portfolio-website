import { useInView } from '../lib/app';
import { stack } from '../data/stack';
import './techstack.css';

/**
 * The key rack: every technology hangs from a rail as a tagged key, one rail per
 * group. The tags drop in when the section scrolls into view, sway slightly on
 * their hooks and swing when the pointer brushes them.
 */
export function TechStack() {
  const [ref, seen] = useInView<HTMLElement>(0.15);
  let n = 0;

  return (
    <section id="stack" className={`rack${seen ? ' in' : ''}`} ref={ref} aria-labelledby="rackTitle">
      <div className="shell rack__in">
        <header className="rack__head">
          <p className="eyebrow">Tech stack</p>
          <h2 id="rackTitle" className="rack__h">
            A key for every door.
          </h2>
          <p className="rack__p">The languages and tools behind the work, hung where I can reach them.</p>
        </header>

        <div className="rack__rails">
          {stack.map((g) => (
            <div className="rail" key={g.group}>
              <h3 className="caps rail__label">{g.group}</h3>
              <ul className="rail__keys">
                {g.items.map((it) => {
                  const i = n++;
                  return (
                    <li className="slot" key={it.name} style={{ ['--i' as string]: i }}>
                      <div
                        className="key"
                        style={{
                          ['--i' as string]: i,
                          ['--c' as string]: it.color ?? 'var(--ink)',
                          // a different phase and swing per key, so the rack never moves in unison
                          ['--sway' as string]: `${2.2 + ((i * 7) % 5) * 0.5}s`,
                          ['--phase' as string]: `${-((i * 13) % 10) * 0.37}s`,
                        }}
                      >
                        <span className="key__hook" aria-hidden="true" />
                        <span className="key__tag">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d={it.path} />
                          </svg>
                          <span>{it.name}</span>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
