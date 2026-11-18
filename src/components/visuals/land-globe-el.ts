// The land-globe custom element. Kept in its own module so the page bundles it, and the heavy globe
// code (d3-geo and the land outline) loads only when the globe scrolls into view.
type Site = { id: string; name: string; icon: string; where: string; lat: number; lon: number; what: string; meaning: string };

class LandGlobe extends HTMLElement {
  private sites: Site[] = [];
  private globe: ReturnType<typeof import('./land-globe.ts')['createLandGlobe']> | null = null;
  private spinning = true;

  connectedCallback() {
    this.sites = JSON.parse(this.dataset.sites!);
    this.querySelectorAll<HTMLButtonElement>('[data-lg-site]').forEach((b) => b.addEventListener('click', () => this.choose(b.dataset.lgSite!)));
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        io.disconnect();
        this.init();
      }
    }, { rootMargin: '200px' });
    io.observe(this);
  }

  private part(name: string) {
    return this.querySelector<HTMLElement>(`[data-lg="${name}"]`)!;
  }

  private async init() {
    const [mod, land] = await Promise.all([import('./land-globe.ts'), fetch(this.dataset.src!).then((r) => r.json())]);
    const canvas = this.querySelector<HTMLCanvasElement>('.g6e-lg-canvas')!;
    canvas.hidden = false;
    this.querySelector('.g6e-lg-static')?.remove();
    this.globe = mod.createLandGlobe(canvas, land, this.sites);
    this.globe.resize();
    new ResizeObserver(() => this.globe!.resize()).observe(canvas);
    this.bind(canvas);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) this.spin();
  }

  private bind(canvas: HTMLCanvasElement) {
    const g = this.globe!;
    let drag: { x: number; y: number; lon: number; lat: number; moved: boolean } | null = null;
    canvas.addEventListener('pointerdown', (e) => {
      this.spinning = false;
      canvas.setPointerCapture(e.pointerId);
      drag = { x: e.clientX, y: e.clientY, lon: g.state.lon, lat: g.state.lat, moved: false };
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const k = 180 / canvas.getBoundingClientRect().width;
      if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 4) drag.moved = true;
      g.state.lon = drag.lon - (e.clientX - drag.x) * k;
      g.state.lat = Math.max(-60, Math.min(60, drag.lat + (e.clientY - drag.y) * k));
      g.draw();
    });
    canvas.addEventListener('pointerup', (e) => {
      if (drag && !drag.moved) {
        const id = g.siteAt(e.clientX, e.clientY);
        if (id) this.choose(id);
      }
      drag = null;
    });
  }

  private spin() {
    let last = performance.now();
    const tick = (now: number) => {
      if (!this.spinning || !this.globe) return;
      this.globe.state.lon += (now - last) * 0.006;
      last = now;
      this.globe.draw();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  private choose(id: string) {
    const s = this.sites.find((x) => x.id === id);
    if (!s) return;
    this.spinning = false;
    this.querySelectorAll('[data-lg-site]').forEach((b) => b.setAttribute('aria-pressed', String((b as HTMLElement).dataset.lgSite === id)));
    this.part('name').textContent = `${s.icon} ${s.name}`;
    this.part('where').innerHTML = s.where;
    this.part('what').innerHTML = s.what;
    this.part('meaning').innerHTML = s.meaning;
    this.part('card').hidden = false;
    if (this.globe) {
      this.globe.state.active = id;
      this.globe.flyTo(s.lon, s.lat);
    }
  }
}
customElements.define('land-globe', LandGlobe);
