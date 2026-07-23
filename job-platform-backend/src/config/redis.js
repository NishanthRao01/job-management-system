const { createClient } = require("redis");

const isProductionRedis =
  process.env.REDIS_URL && process.env.REDIS_URL.startsWith("rediss://");

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    ...(isProductionRedis ? { tls: true, rejectUnauthorized: false } : {}),
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        return new Error("Redis retry attempts exhausted");
      }
      return 300;
    },
    connectTimeout: 3000,
  },
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
  }
};

module.exports = {
  redis,
  connectRedis,
};