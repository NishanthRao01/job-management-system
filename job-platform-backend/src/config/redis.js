const { createClient } = require("redis");

const isProductionRedis =
  process.env.REDIS_URL.startsWith("rediss://");

const redis = createClient({
  url: process.env.REDIS_URL,

  socket: isProductionRedis
    ? {
        tls: true,
        rejectUnauthorized: false,

        reconnectStrategy: (retries) => {
          if (retries > 5) {
            return new Error("Retry attempts exhausted");
          }

          return Math.min(retries * 100, 3000);
        },

        connectTimeout: 10000,
      }
    : undefined,
});

redis.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

const connectRedis = async () => {
  try {
    console.log("Connecting to Redis...");
    await redis.connect();
    console.log("Redis Connected");
  } catch (err) {
    console.error("Redis Connection Failed:", err.message);
    process.exit(1);
  }
};

module.exports = {
  redis,
  connectRedis,
};