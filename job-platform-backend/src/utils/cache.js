const redis = require("../config/redis");

const DEFAULT_TTL = 60;

//Get Cache Safely
exports.getCache = async (key) => {
    try{
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    }catch(err){
        console.error("Cache GET error:", err.message);
        return null;
    }
};

//Set Cache Safely
exports.setCache = async (key, value, ttl = DEFAULT_TTL) => {
    try{
        await redis.set(key, JSON.stringify(value), {
            EX: ttl,
        });
    }catch (err) {
        console.error("Cache SET error:", err.message);
    }
};

//Delete Cache Safely
exports.deleteCache = async (pattern) => {
    try{
        const keys = await redis.keys(pattern);
        if(keys.length){
            await redis.del(keys);
        }
    }catch (err) {
        console.error("Cache DEL error:",err.message);
    }
};