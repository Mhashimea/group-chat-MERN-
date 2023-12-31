import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const messageTypes = {
  system: 'system',
  user: 'user',
};

export const messageActions = {
  member_added: 'MEMBER_ADDED',
  memeber_removed: 'MEMBER_REMOVED',
};
