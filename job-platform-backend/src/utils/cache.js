const { redis } = require("../config/redis");

const DEFAULT_TTL = 60;

// Get Cache Safely
exports.getCache = async (key) => {
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error("Cache GET error:", err.message);
        return null;
    }
};

// Set Cache Safely
exports.setCache = async (key, value, ttl = DEFAULT_TTL) => {
    try {
        await redis.set(key, JSON.stringify(value), {
            EX: ttl,
        });
    } catch (err) {
        console.error("Cache SET error:", err.message);
    }
};

// Delete Cache Safely using SCAN
exports.deleteCache = async (pattern) => {
    try {

        let keysToDelete = [];

        for await (const key of redis.scanIterator({
            MATCH: pattern,
            COUNT: 100,
        })) {

            keysToDelete.push(key);

            // delete in batches
            if (keysToDelete.length >= 100) {
                await redis.del(keysToDelete);
                keysToDelete = [];
            }
        }

        // delete remaining keys
        if (keysToDelete.length > 0) {
            await redis.del(keysToDelete);
        }

    } catch (err) {
        console.error("Cache DEL error:", err.message);
    }
};