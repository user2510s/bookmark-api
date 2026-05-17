import { hash, compare } from "bcryptjs";

export async function createHash(data: string): Promise<string> {
  return hash(data, 10);
}

export async function verifyHash(data: string, hash: string): Promise<boolean> {
  return compare(data, hash);
}
