const { createClient } = require("redis");

const redis = createClient({
    url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
    console.error("Redis Error:", err.message);
});

const connectRedis = async () => {
    try {
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