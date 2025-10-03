import { stripHexPrefix } from "@ethereumjs/util";

const bufferToHex = (buf: Buffer | Uint8Array, nozerox = false): string =>
  nozerox
    ? Buffer.from(buf).toString("hex")
    : `0x${Buffer.from(buf).toString("hex")}`;
const hexToBuffer = (hex: string): Buffer =>
  Buffer.from(
    stripHexPrefix(hex).length % 2 === 1
      ? `0${stripHexPrefix(hex)}`
      : stripHexPrefix(hex),
    "hex",
  );


export {
  bufferToHex,
  hexToBuffer,
}