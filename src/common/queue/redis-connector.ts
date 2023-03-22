// TODO: add logic to inject redis information here instead of get from environment
import IORedis from 'ioredis';

// let path = process.env.BULL_REDIS_URL
// const redisConnection = getRedisConnection(path);
// export default redisConnection;

export default function getRedisConnection(path?: string): IORedis {
  return getIORedisInstance(path);
}

let _ioRedis: IORedis;
function getIORedisInstance(path?: string): IORedis {
  if (_ioRedis) return _ioRedis;

  _ioRedis = path ? new IORedis(path) : new IORedis();
  return _ioRedis;
}
