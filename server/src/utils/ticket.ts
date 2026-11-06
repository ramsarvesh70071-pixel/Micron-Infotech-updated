import crypto from "node:crypto";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L confusion

/** Cryptographically random, hard-to-guess ticket number, e.g. MIC-7K4Q9XZB. */
export const generateTicketNumber = (): string => {
  const bytes = crypto.randomBytes(8);
  let id = "";
  for (let i = 0; i < 8; i++) id += ALPHABET[bytes[i] % ALPHABET.length];
  return `MIC-${id}`;
};
