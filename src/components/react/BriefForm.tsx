import { useState } from 'react';

/*
 * Homepage contact form.
 *
 * A React island because it needs submit state. Posts the same payload shape
 * as the /contact page's form to the existing Resend endpoint at
 * src/pages/api/contact.ts — the two are deliberately interchangeable.
 *
 * Styled to match the homepage's monochrome console register: mono labels,
 * sharp corners, hairline borders. No accent colour.
 */

type Status = 'idle' | 'loading' | 'success' | 'error';

const SERVICES = [
  'AI & Machine Learning',
  'DevOps & MLOps',
  'Web & Software Development',
  'Cloud Services',
  'Consulting / Other',
];

const labelClass = 'mb-2 block font-mono text-[11px] tracking-[0.2em] text-ink-300 uppercase';
const fieldClass =
  'w-full border border-ink-700 bg-ink-950 px-3.5 py-2.5 font-mono text-[15px] text-ink-100 placeholder:text-ink-300 focus:border-ink-400 focus:outline-none transition-colors disabled:opacity-50';

export default function BriefForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    service: SERVICES[0],
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', service: SERVICES[0], message: '' });
        return;
      }

      const data = await res.json().catch(() => ({}));
      setErrorMessage(data.error || 'Could not send the brief. Please try again.');
      setStatus('error');
    } catch {
      setErrorMessage('A network error occurred. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="border border-ink-800 bg-ink-900/60">
      <div className="flex items-center gap-2 border-b border-ink-800 px-4 py-3">
        <span className="h-2 w-2 rounded-full border border-ink-600" />
        <span className="h-2 w-2 rounded-full border border-ink-600" />
        <span className="h-2 w-2 rounded-full border border-ink-600" />
        <span className="ml-3 font-mono text-[11px] tracking-[0.14em] text-ink-300 uppercase">
          britnova — brief.sh
        </span>
      </div>

      <div className="p-6 md:p-7">
        {status === 'success' ? (
          <div className="py-10 font-mono text-[15px] leading-[2]">
            <p className="text-ink-300">
              <span className="text-ink-300">→</span> brief received
            </p>
            <p className="mt-4 text-paper">Thanks — we&apos;ll come back to you shortly.</p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-8 border-b border-ink-600 pb-1 font-mono text-[12px] tracking-[0.14em] text-ink-300 uppercase transition-colors hover:border-paper hover:text-paper"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {status === 'error' && (
              <p
                role="alert"
                className="border border-ink-600 px-3.5 py-2.5 font-mono text-[14px] text-ink-100"
              >
                <span className="text-ink-300">!</span> {errorMessage}
              </p>
            )}

            <div>
              <label htmlFor="brief-name" className={labelClass}>
                Name
              </label>
              <input
                id="brief-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                value={form.name}
                disabled={status === 'loading'}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="brief-email" className={labelClass}>
                Email
              </label>
              <input
                id="brief-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={form.email}
                disabled={status === 'loading'}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="brief-service" className={labelClass}>
                Project type
              </label>
              <select
                id="brief-service"
                name="service"
                value={form.service}
                disabled={status === 'loading'}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className={fieldClass}
              >
                {SERVICES.map((s) => (
                  <option key={s} value={s} className="bg-ink-950">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="brief-message" className={labelClass}>
                Message
              </label>
              <textarea
                id="brief-message"
                name="message"
                rows={4}
                required
                placeholder="What are you building?"
                value={form.message}
                disabled={status === 'loading'}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${fieldClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-1 self-start rounded-sm bg-paper px-8 py-4 font-mono text-[12px] tracking-[0.14em] text-ink-950 uppercase transition-colors hover:bg-ink-200 disabled:cursor-not-allowed disabled:bg-ink-300"
            >
              {status === 'loading' ? 'Sending…' : 'Send brief'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
