import bcrypt from 'bcryptjs';

const SEPARATOR = '(!@#$%)';

export function parseLoginInput(input) {
  const idx = input.lastIndexOf(SEPARATOR);
  if (idx === -1) return null;
  return {
    username: input.substring(0, idx),
    password: input.substring(idx + SEPARATOR.length),
  };
}

export async function verifyPassword(inputPassword, hashedPassword) {
  return bcrypt.compare(inputPassword, hashedPassword);
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}
