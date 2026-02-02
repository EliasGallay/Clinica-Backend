const WINDOW_MS = 10 * 60 * 1000;

type Bucket = number[];

const attempts = new Map<string, Bucket>();

const prune = (bucket: Bucket, now: number) => {
  while (bucket.length > 0 && now - bucket[0] > WINDOW_MS) {
    bucket.shift();
  }
};

export const hitRateLimit = (key: string, limit: number): boolean => {
  const now = Date.now();
  const bucket = attempts.get(key) ?? [];
  prune(bucket, now);
  if (bucket.length >= limit) {
    attempts.set(key, bucket);
    return true;
  }
  bucket.push(now);
  attempts.set(key, bucket);
  return false;
};
