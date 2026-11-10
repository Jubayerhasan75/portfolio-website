import { useEffect, useRef, useState } from 'react';
import { Arrow, Cross, useOverlay, inertIf } from '../lib/app';
import { profile } from '../data/profile';

const TOPICS = ['A job or internship opportunity', 'A web application to build', 'An automation workflow (n8n, AI agents)', 'A collaboration or research idea', 'Something else'];
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
const STEPS = 3;

type Status = 'idle' | 'sending' | 'sent' | 'mail' | 'error';

/**
 * Three-step contact questionnaire. With VITE_FORM_ENDPOINT set it posts JSON to
 * that endpoint; without it, it opens the visitor's email app with the message
 * filled in, so the form always does something real.
 */
export function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [trap, setTrap] = useState(''); // honeypot
  const [error, setError] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const panel = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>('input:not([tabindex="-1"]), textarea')?.focus(), 350);
    return () => clearTimeout(t);
  }, [open, step]);

  useEffect(() => {
    if (open || status === 'idle') return;
    // reset once the closing animation has finished
    const t = setTimeout(() => {
      setStep(1);
      setStatus('idle');
      setTopic('');
      setMessage('');
      setName('');
      setEmail('');
      setError('');
    }, 500);
    return () => clearTimeout(t);
  }, [open, status]);

  const validate = () => {
    if (step === 1 && !topic) return 'Pick the option that fits best.';
    if (step === 2 && message.trim().length < 20) return 'A sentence or two helps me reply properly (20 characters or more).';
    if (step === 3) {
      if (!name.trim()) return 'Please add your name.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return 'That email address does not look right.';
    }
    return '';
  };

  const submit = async () => {
    if (trap) return setStatus('sent'); // bots get a quiet success
    const subject = `Portfolio enquiry: ${topic}`;
    const body = `${message.trim()}\n\n${name.trim()}\n${email.trim()}`;
    if (!ENDPOINT) {
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return setStatus('mail');
    }
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ subject, topic, message: message.trim(), name: name.trim(), email: email.trim() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate();
    setError(msg);
    if (msg) return;
    if (step < STEPS) {
      setDir(1);
      setStep(step + 1);
    } else void submit();
  };
  const back = () => {
    setError('');
    setDir(-1);
    setStep(step - 1);
  };

  const done = status === 'sent' || status === 'mail';

  return (
    <div className={`modal${open ? ' on' : ''}`} aria-hidden={!open} {...inertIf(!open)} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal__panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby="mTitle">
        <button className="x-btn" onClick={onClose} aria-label="Close">
          <Cross />
        </button>

        {!done ? (
          <>
            <div className="mhead">
              <p className="eyebrow">Get in touch</p>
              <h2 id="mTitle">Tell me what you have in mind.</h2>
              <small>Three quick questions. I reply by email.</small>
            </div>
            <form className="mform" onSubmit={next} noValidate>
              <div className="qz__top" aria-hidden="true">
                <span className="tnum">
                  {step} of {STEPS}
                </span>
                <span className="qz__bar">
                  <i style={{ transform: `scaleX(${step / STEPS})` }} />
                </span>
              </div>
              <label className="mform__hp" aria-hidden="true">
                Leave this empty
                <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
              </label>

              <div className="qz__steps">
                {step === 1 && (
                  <fieldset className="qz" key="1" style={{ ['--dir' as string]: dir }}>
                    <legend>What is this about?</legend>
                    {TOPICS.map((t) => (
                      <label className="qc" key={t}>
                        <input type="radio" name="topic" value={t} checked={topic === t} onChange={() => (setTopic(t), setError(''))} />
                        <span>{t}</span>
                      </label>
                    ))}
                  </fieldset>
                )}
                {step === 2 && (
                  <fieldset className="qz" key="2" style={{ ['--dir' as string]: dir }}>
                    <legend>Tell me a little about it.</legend>
                    <label className="qf">
                      <span>Your message</span>
                      <textarea rows={6} maxLength={1500} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What you need, any deadline, and links if you have them." />
                    </label>
                  </fieldset>
                )}
                {step === 3 && (
                  <fieldset className="qz" key="3" style={{ ['--dir' as string]: dir }}>
                    <legend>Last step: how do I reach you?</legend>
                    <label className="qf">
                      <span>Name</span>
                      <input type="text" maxLength={80} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                    </label>
                    <label className="qf">
                      <span>Email</span>
                      <input type="email" maxLength={120} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
                    </label>
                  </fieldset>
                )}
              </div>

              <p className="qz__err" role="alert">
                {status === 'error' ? `That did not send. Please email ${profile.email} instead.` : error}
              </p>
              <div className="qz__foot">
                {step > 1 ? (
                  <button type="button" className="qz__back" onClick={back}>
                    ← Back
                  </button>
                ) : (
                  <small>{ENDPOINT ? 'Your details are only used to reply.' : 'Sending opens your email app.'}</small>
                )}
                <button className="pill pill--dark pill--arrow" type="submit" disabled={status === 'sending'}>
                  <span className="pill__in">
                    {step < STEPS ? 'Next' : status === 'sending' ? 'Sending…' : 'Send'}
                    <span className="pill__badge">
                      <Arrow />
                    </span>
                  </span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="msuccess">
            <div className="msuccess__badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </div>
            <h2 id="mTitle">{status === 'sent' ? 'Message sent.' : 'Your email app has the draft.'}</h2>
            <p>
              {status === 'sent'
                ? `Thanks, ${name.trim().split(' ')[0]}. I will reply to ${email.trim()}.`
                : 'Press send there and it will reach me. If nothing opened, write to me directly:'}
            </p>
            {status === 'mail' && (
              <p className="msuccess__alt">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </p>
            )}
            <button className="pill pill--dark" onClick={onClose}>
              <span className="pill__in">Done</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
