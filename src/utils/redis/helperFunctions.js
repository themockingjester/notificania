const { exportedDIContainer } = require("../../exportedDiContainer")
var zlib = require('zlib');

class RedisHelperFunctions {
    client
    initClient() {
        this.client = exportedDIContainer.caching.redis.client;

    }
    async setCompressedKey(cacheName, key, json, expiryInSeconds) {
        // compressing the payload to reduce data transfer and memory usage in redis, thus better latency and performance
        const value = zlib.gzipSync(JSON.stringify(json)).toString('base64');

        if (expiryInSeconds) {
            this.client.set(this.constructKey(cacheName, key), value, 'EX', expiryInSeconds);
        } else {
            this.client.set(this.constructKey(cacheName, key), value);
        }
    };

    async getCompressedKey(cacheName, key) {
        const res = await this.client.get(this.constructKey(cacheName, key));
        // uncompressing the value from getKey
        return res ? JSON.parse(zlib.gunzipSync(Buffer.from(res, 'base64')).toString()) : null;
    };

    async setKey(cacheName, key, json, expiryInSeconds) {

        if (expiryInSeconds) {

            return await this.client.set(this.constructKey(cacheName, key), JSON.stringify(json), {
                EX: expiryInSeconds
            });

        } else {
            return await this.client.set(this.constructKey(cacheName, key), JSON.stringify(json));

        }
    };

    async getKey(cacheName, key) {
        const res = await this.client.get(this.constructKey(cacheName, key));
        return JSON.parse(res);
    };

    async getKeys(cacheName, keys, keyColumn) {
        const finalKeys = keys.map(k => this.constructKey(cacheName, k));
        const resArray = await this.client.mget(...finalKeys);
        const result = {};
        for (let i in resArray) {
            if (resArray[i] && resArray[i].length > 0) {
                const o = JSON.parse(resArray[i]);
                if (o && o[keyColumn]) {
                    result[o[keyColumn]] = o;
                }
            }
        }
        return result;
    };

    async deleteKey(cacheName, key) {
        return this.client.del(this.constructKey(cacheName, key));
    };

    async deleteUsingPattern(cacheName, pattern) {
        const patternKey = this.constructKey(cacheName, pattern);
        let cursor = '0';
        do {
            const [newCursor, keys] = await this.client.scan(cursor, 'MATCH', `*${patternKey}*`);
            if (keys.length) {
                keys.forEach(key => {
                    this.client.del(key);
                });
            }
            cursor = newCursor;
        } while (cursor !== '0');
    };

    async setList(listname, list) {
        await this.client.del(listname);
        const finalList = list.map(item => JSON.stringify(item));
        return this.client.lpush(listname, finalList);
    };

    async incr(cacheName, key) {
        return this.client.incr(this.constructKey(cacheName, key));
    };
    async decr(cacheName, key) {
        return this.client.decr(this.constructKey(cacheName, key));
    };

    async expire(cacheName, key, expiryInSeconds) {
        return this.client.expire(this.constructKey(cacheName, key), expiryInSeconds);
    };

    async getFromList(listName, limit, offset) {
        const result = await this.client.lrange(listName, offset, offset + limit - 1);
        return result.map(item => JSON.parse(item));
    };
    async getListLength(listName, limit, offset) {
        return this.client.llen(listName);
    };

    constructKey(cacheName, key) { return cacheName + '_' + key; }
    async setnx(cacheName, key, json, expiryInMiliSeconds) {
        const result = await this.client.set(this.constructKey(cacheName, key), JSON.stringify(json), 'PX', expiryInMiliSeconds, 'NX');
        return result;
    };
    async zadd({ cacheName, key, score, value }) {
        const result = await client.zadd(this.constructKey(cacheName, key), score, value);
        return result;
    };
    async zpopmin({ cacheName, key }) {
        const result = await this.client.zpopmin(this.constructKey(cacheName, key));
        return result;
    };
    async zrem({ cacheName, key, value }) {
        const result = await this.client.zrem(this.constructKey(cacheName, key), value);
        return result;
    };
    async rPopLPush(listOne, listTwo) { this.client.rpoplpush(listOne, listTwo); }

    async popFromList(listName, value, count) {
        if (count) {
            return this.client.lrem(listName, count, value);
        }
        return this.client.lrem(listName, 1, value);
    };
    async pushToList(listName, value) { this.client.lpushx(listName, value); }

    async circularListPopPush(listName) { rPopLPush(listName, listName); }

    async addKeyToSortedSet(setName, score, key) {
        return this.client.zadd(setName, score, key);
    };
    async removeKeyFromSortedSet(setName, key) { this.client.zrem(setName, key); }

    async addListToSortedSet(list, setName) {
        for (let index = 0; index < list.length; index++) {
            const { score, keyName } = list[index];
            await addKeyToSortedSet(setName, score, keyName);
        }
    };
    async zrange(setName, start = 0, stop = 0) { this.client.zrange(setName, start, stop); }
    async zcard(setName) { this.client.zcard(setName); }
    async zincrby(setName, incrBy, member) { this.client.zincrby(setName, incrBy, member); }
    async zscore(setName, member) { this.client.zscore(setName, member); }

    async exists(cacheName) { this.client.exists(cacheName); }
    async hset(cacheName, key, value) { this.client.hset(cacheName, key, value); }
    async hgetall(cacheName) { this.client.hgetall(cacheName); }
    async batchDeletionKeysByPattern(key) {
        let stream = this.client.scanStream({
            match: key + '*',
        });
        stream.on('data', resultKeys => {
            if (resultKeys.length) {
                this.client.unlink(resultKeys);
            }
        });
        stream.on('end', () => {
            console.log(`Done batchDeletionKeysByPattern ${key}`);
        });
    };
    async getOrSetCompressedCache(cacheName, key, value, hrs = 24) {
        const cacheNameString = `COMPRESSED_KEY_${cacheName}_${key}`;
        const cachedValue = await getCompressedKey(cacheNameString, key);
        if (cachedValue) {
            return cachedValue;
        }
        await setCompressedKey(cacheNameString, key, value, 60 * 60 * hrs);
        return value;
    };

    async getTimeToLive(cacheName, key) { this.client.ttl(this.constructKey(cacheName, key)); }


}

const obj = new RedisHelperFunctions()
module.exports = obj