import { bundle } from '@remotion/bundler';
import path from 'path';

// Cache the bundle so we don't rebuild on every request
let bundlePromise = null;

export const getRemotionBundle = async () => {
  if (!bundlePromise) {
    const entry = path.join(process.cwd(), 'remotion', 'Root.jsx');
    bundlePromise = bundle(entry); // bundle once
  }
  return bundlePromise;
};
