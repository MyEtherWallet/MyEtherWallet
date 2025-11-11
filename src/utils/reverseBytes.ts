export default function reverseBytes(input: Uint8Array): Uint8Array {
  const len = input.length;
  const out = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    out[i] = input[len - 1 - i];
  }
  return out;
}