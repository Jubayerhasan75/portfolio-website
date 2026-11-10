import { Arrow, useApp, useClock, useInView } from '../lib/app';
import { profile } from '../data/profile';
import { rooms } from '../data/projects';
import './footer.css';

export function Footer() {
  const { openContact, go, enterRoom, openCredits, scrollTo } = useApp();
  const clock = useClock(profile.timeZone);
  const [ref, seen] = useInView<HTMLElement>(0.25);

  return (
    <div className="sfw">
      <footer id="contact-footer" className={`sf${seen ? ' in' : ''}`} ref={ref} aria-labelledby="sfTitle">
        <div className="shell sf__in">
          <p className="caps sf__eye">
            <i />
            Open to collaboration
          </p>
          <h2 id="sfTitle" className="sf__h">
            <span className="line">
              <span>Have something to build?</span>
            </span>
            <span className="line">
              <span className="soft">Let's talk about it.</span>
            </span>
          </h2>
          <p className="sf__p">
            I build full-stack web applications and AI workflow automation. Tell me what you are working on and I will get back to you by email.
          </p>
          <div className="sf__cta">
            <button className="pill pill--dark pill--arrow" onClick={openContact}>
              <span className="pill__in">
                Get in touch
                <span className="pill__badge">
                  <Arrow />
                </span>
              </span>
            </button>
            <a className="pill pill--outline" href={profile.cv} target="_blank" rel="noreferrer">
              <span className="pill__in">Download CV</span>
            </a>
          </div>

          <div className="sf__cols">
            <div>
              <p className="caps">Work</p>
              <ul className="sf__work">
                {rooms.map((r) => (
                  <li key={r.slug}>
                    <button onClick={() => enterRoom(r.slug)}>{r.title}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="caps">Navigate</p>
              <ul>
                <li>
                  <button onClick={() => go('home')}>Home</button>
                </li>
                <li>
                  <button onClick={() => go('about')}>My story</button>
                </li>
                <li>
                  <button onClick={openContact}>Contact</button>
                </li>
              </ul>
            </div>
            <div>
              <p className="caps">Elsewhere</p>
              <ul>
                <li>
                  <a href={profile.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </li>
              </ul>
            </div>
            <div>
              <p className="caps">Status</p>
              <ul className="sf__status">
                <li>{profile.location}</li>
                <li>
                  Dhaka time <span className="tnum">{clock.time}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="sf__bot">
            <span>
              © {new Date().getFullYear()} {profile.name}.
            </span>
            <button onClick={openCredits}>Privacy & credits</button>
            <button onClick={() => scrollTo(0)}>Back to top ↑</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
