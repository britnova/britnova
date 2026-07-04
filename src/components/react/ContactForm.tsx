import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    service: 'AI & Machine Learning',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const servicesList = [
    'AI & Machine Learning',
    'DevOps & MLOps',
    'Web & Software Development',
    'Cloud Services',
    'Consulting / Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', service: 'AI & Machine Learning', message: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error || 'Failed to submit the form. Please try again.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMessage('A network error occurred. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="bg-bg-card border border-border-subtle p-8 md:p-10 rounded-2xl relative overflow-hidden">
      {status === 'success' ? (
        <div className="text-center py-12 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-brand-accent mb-6 stroke-[1.5]" />
          <h3 className="font-display text-2xl font-bold text-text-light mb-3">Message Sent!</h3>
          <p className="text-text-muted text-sm max-w-sm leading-relaxed mb-8">
            Thank you for reaching out. We have received your query and our team will get back to
            you within 24 hours.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-xs font-mono uppercase tracking-wider text-brand-accent border-b border-brand-accent pb-0.5 hover:text-text-light hover:border-text-light transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {status === 'error' && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="font-mono text-xs text-text-muted uppercase tracking-wider"
              >
                Your Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="px-4 py-3 rounded-xl bg-bg-dark border border-border-subtle focus:border-brand-accent focus:outline-none text-text-light text-sm transition-all duration-300"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-mono text-xs text-text-muted uppercase tracking-wider"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="px-4 py-3 rounded-xl bg-bg-dark border border-border-subtle focus:border-brand-accent focus:outline-none text-text-light text-sm transition-all duration-300"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Service interested in */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="service"
              className="font-mono text-xs text-text-muted uppercase tracking-wider"
            >
              Project Scope / Interest
            </label>
            <select
              id="service"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="px-4 py-3 rounded-xl bg-bg-dark border border-border-subtle focus:border-brand-accent focus:outline-none text-text-light text-sm transition-all duration-300 appearance-none cursor-pointer"
            >
              {servicesList.map((service) => (
                <option key={service} value={service} className="bg-bg-card">
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="message"
              className="font-mono text-xs text-text-muted uppercase tracking-wider"
            >
              Tell us about your project
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="px-4 py-3 rounded-xl bg-bg-dark border border-border-subtle focus:border-brand-accent focus:outline-none text-text-light text-sm transition-all duration-300 resize-none"
              placeholder="Provide a brief description of what you are building..."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className={`w-full py-4 rounded-xl font-semibold tracking-wide uppercase text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
              status === 'loading'
                ? 'bg-border-subtle text-text-muted cursor-not-allowed'
                : 'bg-brand-accent text-bg-dark hover:bg-brand-accent/90 shadow-[0_4px_15px_rgba(108,92,231,0.2)]'
            }`}
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
}
