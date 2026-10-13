/*
 * Website analytics (Umami) with a visible on/off switch.
 *
 * Why there is no consent banner: Umami's script sets no cookies and writes
 * nothing to the visitor's device (it only READS one key, `umami.disabled`,
 * which is its own off switch). Under PECR's "statistical purposes" exception
 * that is allowed without prior consent provided the visitor is told clearly
 * (the Cookie Policy) and has a simple, free way to object (the switch below).
 * The switch is in the footer of every page and on the Cookie Policy page.
 *
 *   umami.disabled = "1"   written ONLY when the visitor turns analytics off
 *
 * A browser Global Privacy Control signal is treated as "off" for that visit.
 * When off, the Umami script is never loaded, so nothing is sent anywhere.
 * Everything fails safe: if storage is unavailable, the switch still works
 * for the current page view.
 */

const OFF_KEY = 'umami.disabled';

function storedOff(): boolean {
  try {
    return localStorage.getItem(OFF_KEY) === '1';
  } catch {
    return false;
  }
}

function storeOff(off: boolean): void {
  try {
    if (off) localStorage.setItem(OFF_KEY, '1');
    else localStorage.removeItem(OFF_KEY);
  } catch {
    /* storage unavailable: applies to this page view only */
  }
}

function loadScript(config: HTMLElement): void {
  const { websiteId, scriptSrc, enabled } = config.dataset;
  // dev builds never load it (see BaseLayout), and never twice
  if (enabled !== 'true' || !websiteId || !scriptSrc) return;
  if (document.getElementById('umami-script')) return;

  const script = document.createElement('script');
  script.id = 'umami-script';
  script.defer = true;
  script.src = scriptSrc;
  script.dataset.websiteId = websiteId;
  document.head.appendChild(script);
}

export function initAnalytics(): void {
  const config = document.getElementById('analytics-config');
  if (!config) return;

  const live = document.querySelector<HTMLElement>('[data-analytics-live]');
  const toggles = document.querySelectorAll<HTMLElement>('[data-analytics-toggle]');
  const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;

  let on = !(storedOff() || gpc === true);

  const render = () =>
    toggles.forEach((toggle) => {
      toggle.textContent = on ? (config.dataset.labelOn ?? '') : (config.dataset.labelOff ?? '');
    });

  render();
  if (on) loadScript(config);

  toggles.forEach((toggle) =>
    toggle.addEventListener('click', () => {
      on = !on;
      storeOff(!on);
      if (on) loadScript(config);
      render();
      if (live) {
        live.textContent = (on ? config.dataset.announceOn : config.dataset.announceOff) ?? '';
      }
    })
  );
}
