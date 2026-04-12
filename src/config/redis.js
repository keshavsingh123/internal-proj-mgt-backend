import Redis from "ioredis";

export const pubClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  lazyConnect: true,
});

export const subClient = pubClient.duplicate();
