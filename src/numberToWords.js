const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function twoDigits(n) {
  if (n < 20) return ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return `${TENS[tens]}${ones ? " " + ONES[ones] : ""}`.trim();
}

function threeDigits(n) {
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  const parts = [];
  if (hundred) parts.push(`${ONES[hundred]} Hundred`);
  if (rest) parts.push(twoDigits(rest));
  return parts.join(" ");
}

function rupeesToWords(value) {
  if (value === 0) return "Zero";

  const crore = Math.floor(value / 10000000);
  const lakh = Math.floor((value % 10000000) / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const remainder = value % 1000;

  const parts = [];
  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (remainder) parts.push(threeDigits(remainder));
  return parts.join(" ");
}

export function numberToIndianWords(amount) {
  const n = Number(amount) || 0;
  const rupees = Math.floor(n + 1e-9);
  const paise = Math.round((n - rupees) * 100);

  if (rupees === 0 && paise === 0) return "Zero Rupees only";

  let text = `${rupeesToWords(rupees)} Rupees`;
  if (paise) text += ` and ${twoDigits(paise)} Paisa`;
  return `${text} only`;
}
