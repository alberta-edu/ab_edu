// Small drawings for Grade 3 symbol cards (g3ss-symbol-cards), each on a 100 × 100 canvas.
// They are simple pictures of each symbol, not copies of any official artwork.
// Sources for what each shows: Government of Alberta, "Emblems of Alberta" (alberta.ca/emblems);
// Métis Nation of Alberta and the Gabriel Dumont Institute (the sash and the Red River cart).

const shield = (x: number, y: number, w: number) => {
  const s = w / 40;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <clipPath id="g3ss-sa-clip"><path d="M0 0 H40 V26 Q40 44 20 46 Q0 44 0 26 Z"/></clipPath>
    <g clip-path="url(#g3ss-sa-clip)">
      <rect width="40" height="46" fill="#5aa7e0"/>
      <rect width="40" height="9" fill="#fff"/><rect x="17" width="6" height="9" fill="#c8102e"/><rect y="3" width="40" height="3" fill="#c8102e"/>
      <polygon points="0,24 9,13 15,20 22,11 30,21 35,15 40,21 40,30 0,30" fill="#f4f4f4" stroke="#8aa" stroke-width="0.5"/>
      <path d="M0 27 Q10 21 20 26 T40 25 V33 H0 Z" fill="#3f8a3f"/>
      <rect y="32" width="40" height="5" fill="#b9d77e"/>
      <rect y="37" width="40" height="10" fill="#e8b830"/>
      <g stroke="#b88a10" stroke-width="0.7">${[4, 9, 14, 19, 24, 29, 34].map((v) => `<line x1="${v}" y1="38" x2="${v}" y2="45"/>`).join('')}</g>
    </g>
    <path d="M0 0 H40 V26 Q40 44 20 46 Q0 44 0 26 Z" fill="none" stroke="#1c1b24" stroke-width="1"/>
  </g>`.replace(/\s+</g, '<');
};

export const ART: Record<string, string> = {
  'tipi-ring': `<polygon points="50,14 26,66 74,66" fill="#e9d3a8" stroke="#7a5a2a" stroke-width="2"/><line x1="50" y1="14" x2="44" y2="4" stroke="#7a5a2a" stroke-width="2"/><line x1="50" y1="14" x2="56" y2="4" stroke="#7a5a2a" stroke-width="2"/><path d="M44 66 L50 50 L56 66 Z" fill="#7a5a2a"/>${Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return `<ellipse cx="${(50 + Math.cos(a) * 40).toFixed(1)}" cy="${(76 + Math.sin(a) * 13).toFixed(1)}" rx="4.5" ry="3.2" fill="#8d8d8d" stroke="#5a5a5a"/>`;
  }).join('')}`,
  'standing-bear': `<g fill="#7a4b2a"><ellipse cx="50" cy="58" rx="17" ry="24"/><circle cx="50" cy="27" r="12"/><circle cx="41" cy="17" r="4.5"/><circle cx="59" cy="17" r="4.5"/><path d="M36 48 Q22 38 20 24 L27 22 Q31 34 40 40 Z"/><path d="M64 48 Q78 38 80 24 L73 22 Q69 34 60 40 Z"/><rect x="37" y="76" width="9" height="18" rx="4"/><rect x="54" y="76" width="9" height="18" rx="4"/></g><ellipse cx="50" cy="31" rx="5" ry="3.5" fill="#c9a27a"/><circle cx="50" cy="30" r="1.6" fill="#1c1b24"/><circle cx="45.5" cy="25" r="1.4" fill="#1c1b24"/><circle cx="54.5" cy="25" r="1.4" fill="#1c1b24"/><line x1="10" y1="95" x2="90" y2="95" stroke="#7a5a2a" stroke-width="2"/>`,
  sash: `<g transform="rotate(-20 50 50)"><rect x="6" y="38" width="88" height="24" rx="3" fill="#c8102e"/>${Array.from({ length: 11 }, (_, i) => `<polyline points="${10 + i * 8},38 ${14 + i * 8},50 ${10 + i * 8},62" fill="none" stroke="${['#1d4ed8', '#f2b01e', '#187a50', '#fff'][i % 4]}" stroke-width="2.4"/>`).join('')}${Array.from({ length: 6 }, (_, i) => `<line x1="${6 + i * 1.5}" y1="${40 + i * 4}" x2="${-6 + i * 1.5}" y2="${42 + i * 4}" stroke="#c8102e" stroke-width="1.6"/><line x1="${94 - i * 1.5}" y1="${40 + i * 4}" x2="${106 - i * 1.5}" y2="${42 + i * 4}" stroke="#c8102e" stroke-width="1.6"/>`).join('')}</g>`,
  'red-river-cart': `<rect x="22" y="34" width="56" height="22" fill="#b07a3c" stroke="#6b4517" stroke-width="2"/><line x1="78" y1="48" x2="98" y2="54" stroke="#6b4517" stroke-width="3"/><line x1="22" y1="48" x2="2" y2="54" stroke="#6b4517" stroke-width="3"/>${[50].map((cx) => `<circle cx="${cx}" cy="64" r="26" fill="none" stroke="#6b4517" stroke-width="4"/>${Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return `<line x1="${cx}" y1="64" x2="${(cx + Math.cos(a) * 25).toFixed(1)}" y2="${(64 + Math.sin(a) * 25).toFixed(1)}" stroke="#8a5a26" stroke-width="2"/>`;
  }).join('')}<circle cx="${cx}" cy="64" r="5" fill="#6b4517"/>`).join('')}`,
  'wild-rose': `${Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return `<circle cx="${(50 + Math.cos(a) * 20).toFixed(1)}" cy="${(48 + Math.sin(a) * 20).toFixed(1)}" r="18" fill="#f49ac1" stroke="#d6649b" stroke-width="1.5"/>`;
  }).join('')}<circle cx="50" cy="48" r="10" fill="#f2c230"/><g fill="#c98a00">${Array.from({ length: 8 }, (_, i) => `<circle cx="${(50 + Math.cos(i) * 6).toFixed(1)}" cy="${(48 + Math.sin(i) * 6).toFixed(1)}" r="1.4"/>`).join('')}</g><path d="M50 72 Q48 86 40 96" stroke="#3f8a3f" stroke-width="3" fill="none"/>`,
  'blue-gold': `<rect x="8" y="22" width="40" height="56" rx="6" fill="#1f4fa3"/><rect x="52" y="22" width="40" height="56" rx="6" fill="#e8b830"/><text x="28" y="92" font-size="10" text-anchor="middle" fill="currentColor">sky</text><text x="72" y="92" font-size="10" text-anchor="middle" fill="currentColor">prairie</text>`,
  motto: `<path d="M6 40 H94 L86 52 L94 64 H6 L14 52 Z" fill="#e8b830" stroke="#9a6a00" stroke-width="1.5"/><text x="50" y="57" font-size="11" font-weight="700" font-style="italic" text-anchor="middle" fill="#1c1b24">Fortis et liber</text>`,
  'ab-flag': `<rect x="4" y="25" width="92" height="46" fill="#1f3f8f"/>${shield(38, 29, 24)}`,
  shield: shield(22, 6, 56),
};

/** The picture for a card: a drawing from ART, or an emoji in large type. */
export function artFor(key: string): string {
  const inner = ART[key] ?? `<text x="50" y="66" font-size="52" text-anchor="middle">${key}</text>`;
  return `<svg viewBox="0 0 100 100" class="g3ss-sc-art" aria-hidden="true">${inner}</svg>`;
}
