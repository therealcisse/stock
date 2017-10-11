import { MONETARY_UNIT } from 'vars';

export default function parseMoney(value) {
  const n = value ? parseFloat(value.replace(/,/g, '.').replace(/\s+/g, '')) : 0;

  return n && !Number.isNaN(n)
    ? Math.trunc(n * MONETARY_UNIT) / MONETARY_UNIT
    : 0;
}
