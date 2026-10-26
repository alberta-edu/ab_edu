// Divisibility facts for the hundred chart and the number tester (MAT5-OI1-GQ3-LO1).

export const digitSum = (n: number) => [...String(n)].reduce((s, d) => s + Number(d), 0);

/** Pattern description for the hundred chart, per divisor. */
export const PATTERNS: Record<number, string> = {
  0: 'Nothing lights up. Division by 0 is not possible: 12 ÷ 0 would need a number that makes 12 when multiplied by 0, and no number does.',
  1: 'Every number lights up. Every number is divisible by 1.',
  2: 'The lit numbers end in 0, 2, 4, 6 or 8. A number is divisible by 2 when its ones digit is even.',
  3: 'Look at the small digit sums. For every lit number, the digits add up to a multiple of 3 (3, 6, 9, 12, 15 or 18).',
  4: 'Investigate: every second even number lights up. Can you spot more patterns?',
  5: 'The lit numbers end in 0 or 5. A number is divisible by 5 when its ones digit is 0 or 5.',
  6: 'Investigate: the lit numbers are even, and their digit sums are multiples of 3. They pass the tests for 2 and for 3!',
  7: 'Investigate: the lit numbers make a diagonal pattern. There is no quick test, so divide to check.',
  8: 'Investigate: every fourth even number lights up.',
  9: 'Investigate: every lit number has a digit sum of 9 or 18.',
  10: 'The lit numbers end in 0. A number is divisible by 10 when its ones digit is 0.',
};

export interface TestLine {
  d: number;
  q: number;
  r: number;
  divisible: boolean;
  /** Why, using a divisibility test (for 2, 3 and 5). */
  why?: string;
}

export function testNumber(n: number): TestLine[] {
  const ones = n % 10;
  const sum = digitSum(n);
  const digits = [...String(n)].join(' + ');
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => {
    const line: TestLine = { d, q: Math.floor(n / d), r: n % d, divisible: n % d === 0 };
    if (d === 2) line.why = `the ones digit, ${ones}, is ${ones % 2 === 0 ? 'even' : 'odd'}`;
    if (d === 5) line.why = `the ones digit, ${ones}, ${ones === 0 || ones === 5 ? 'is' : 'is not'} 0 or 5`;
    if (d === 3) line.why = `the digit sum ${digits} = ${sum} ${sum % 3 === 0 ? 'is' : 'is not'} divisible by 3`;
    return line;
  });
}

export function factorPairs(n: number): [number, number][] {
  const pairs: [number, number][] = [];
  for (let a = 1; a * a <= n; a++) if (n % a === 0) pairs.push([a, n / a]);
  return pairs;
}
