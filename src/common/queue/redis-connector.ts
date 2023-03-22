// TODO: add logic to inject redis information here instead of get from environment

import { RedisOptions } from 'bullmq';

// let path = process.env.BULL_REDIS_URL
// const redisConnection = getRedisConnection(path);
// export default redisConnection;

export function getRedisConnection(path?: string): RedisOptions {
  return getIORedisInstance(path);
}

function getIORedisInstance(path?: string): RedisOptions {
  const _path = path ?? 'redis://localhost:6379';
  const url = new URL(_path);

  const res = {
    host: url.hostname || 'localhost',
    port: parseInt(url.port, 10) || 6379,
  };

  return res;
  // if (_ioRedis) return _ioRedis;
  //
  // // no redisconnection, create one
  // const opt: RedisOptions = { maxRetriesPerRequest: null , };
  // _ioRedis = path ? new IORedis(path, opt) : new IORedis(opt);
  // return _ioRedis;
}
