// Number names in words, as taught in Alberta: "and" marks the decimal point, and the
// decimal part is read as a whole number followed by the place of its last digit
// (0.125 → "one hundred twenty-five thousandths").

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function under1000(n: number): string {
  const parts: string[] = [];
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (h) parts.push(`${ONES[h]} hundred`);
  if (r) parts.push(r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? `-${ONES[r % 10]}` : ''));
  return parts.join(' ');
}

export function wholeWords(n: number): string {
  if (n === 0) return 'zero';
  const parts: string[] = [];
  const m = Math.floor(n / 1_000_000);
  const t = Math.floor((n % 1_000_000) / 1000);
  const r = n % 1000;
  if (m) parts.push(`${under1000(m)} million`);
  if (t) parts.push(`${under1000(t)} thousand`);
  if (r) parts.push(under1000(r));
  return parts.join(' ');
}

const DEC_PLACE = ['', 'tenth', 'hundredth', 'thousandth'];

/** "3 456.07" → "three thousand four hundred fifty-six and seven hundredths". Accepts spaces as group separators. */
export function numberWords(raw: string): string {
  const s = raw.replace(/[\s  ,]/g, '');
  const m = /^(\d+)(?:\.(\d{1,3}))?$/.exec(s);
  if (!m) throw new Error(`Not a number this tool can read: ${raw}`);
  const whole = Number(m[1]);
  const dec = m[2];
  if (!dec) return wholeWords(whole);
  const decValue = Number(dec);
  const place = DEC_PLACE[dec.length] + (decValue === 1 ? '' : 's');
  const decWords = `${wholeWords(decValue)} ${place}`;
  return whole ? `${wholeWords(whole)} and ${decWords}` : decWords;
}
