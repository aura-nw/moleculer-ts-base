/* eslint-disable no-console */

import Queue from 'bull';

import Redis from 'ioredis';

console.log('hello');

// const REDIS_URL = 'redis://127.0.0.1:6379';
// const redisOpts: RedisOptions = {
//   maxRetriesPerRequest: null,
//   enableReadyCheck: false
// };
// const client = new Redis(REDIS_URL, redisOpts);
// const subscriber = new Redis(REDIS_URL, redisOpts);
//
// const opts = {
//   createClient(type: string) {
//     console.log(`createClient ${type}`);
//     switch (type) {
//       case 'client':
//         return client;
//       case 'subscriber':
//         return subscriber;
//       default:
//         return new Redis(REDIS_URL, redisOpts);
//     }
//   }
// };

async function isRedisReady(client: Redis): Promise<void> {
  return new Promise((resolve, reject) => {
    function handleReady() {
      client.removeListener('end', handleEnd);
      client.removeListener('error', handleError);
      resolve();
    }

    let lastError: Error;
    function handleError(err: Error) {
      lastError = err;
    }

    function handleEnd() {
      client.removeListener('ready', handleReady);
      client.removeListener('error', handleError);
      reject(lastError);
    }

    if (client.status === 'ready') {
      resolve();
    } else {
      client.once('ready', handleReady);
      client.on('error', handleError);
      client.once('end', handleEnd);
    }
  });
}
// const queueFoo = new Queue('foobar', opts);
async function main() {
  const queueFoo = new Queue('aaa', {
    redis: {
      host: 'localhost',
      port: 1234,
      retryStrategy: undefined,
      // retryStrategy: (t: number) => { console.log(t); if (t > 3) return null; return t-1; },
    },
  });
  // queueFoo.on('error');
  await isRedisReady(queueFoo.client);
}
//
// queueFoo.process((job, done) => {
//   console.log('in the handler', job.data);
//   done();
// });

// queueFoo.add({ data: 'hello' });
main().then(console.log);
