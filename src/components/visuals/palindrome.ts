// Palindromes (LANENG6-OI3-GQ1-LO1, K3.2): a word or phrase that reads the same backward and forward.
// Spaces, punctuation and capitals are ignored, so "Never odd or even" counts.

/** The letters and digits of a phrase, in lower case, as a reader checks a palindrome. */
export const letters = (text: string): string[] => [...text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')].filter((c) => /[a-z0-9]/.test(c));

export function isPalindrome(text: string): boolean {
  const l = letters(text);
  return l.length > 1 && l.join('') === [...l].reverse().join('');
}
