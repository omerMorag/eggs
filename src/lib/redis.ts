import { Redis } from "@upstash/redis";

/**
 * לקוח Upstash Redis (REST) — קורא אוטומטית את UPSTASH_REDIS_REST_URL
 * ו-UPSTASH_REDIS_REST_TOKEN ממשתני הסביבה.
 */
export const redis = Redis.fromEnv();
