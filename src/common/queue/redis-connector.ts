// TODO: add logic to inject redis information here instead of get from environment
import IORedis, { RedisOptions } from 'ioredis';

// let path = process.env.BULL_REDIS_URL
// const redisConnection = getRedisConnection(path);
// export default redisConnection;

export function getRedisConnection(path?: string): IORedis {
  return getIORedisInstance(path);
}

let _ioRedis: IORedis;
function getIORedisInstance(path?: string): IORedis {
  if (_ioRedis) return _ioRedis;

  // no redisconnection, create one
  const opt: RedisOptions = { maxRetriesPerRequest: null };
  _ioRedis = path ? new IORedis(path, opt) : new IORedis(opt);
  return _ioRedis;
}
