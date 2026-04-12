import Redis from "ioredis";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT || 6379);

if (Number.isNaN(redisPort)) {
  throw new Error(
    "REDIS_PORT is invalid. Please set a valid numeric port in .env",
  );
}

export const pubClient = new Redis({
  host: redisHost,
  port: redisPort,
  lazyConnect: true,
});

export const subClient = pubClient.duplicate();
