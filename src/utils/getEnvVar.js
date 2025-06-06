import dotenv from 'dotenv';

dotenv.config();

export function getEnvVar(name, defaultValue = undefined) {
  const value = process.env[name];

  if (typeof value === 'undefined' || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing: process.env['${name}'].`);
  }
  return value;
}
