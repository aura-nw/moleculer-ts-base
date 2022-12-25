/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Bull from 'bull';
import { inspect } from 'util';

// If you have the default Redis credentials
// (username, password, host, port)

export default class QueueManager {
  private _queues = {};

  static INSTANCE: QueueManager = new QueueManager();

  // private constructor() {
  //     // private construct for singleton pattern
  // }

  public static getInstance(): QueueManager {
    return QueueManager.INSTANCE;
  }

  /**
   * setHandler
   */
  public async setHandler(
    queueName: string,
    jobName: string,
    fn: (payload: any) => Promise<void>
  ) {
    // TODO: avoid use any for fn here

    const queue = this.getQueue(queueName);

    // console.log("Before queue.process");
    queue.process(jobName, async (job: any, done: any) => {
      // TODO: Also need to write some preparation here. Let it for now
      await fn(job.data);
      await done();
    });
    // console.log("After queue.process");
  }

  public addQueue(name: string, url?: string, opt?: Bull.QueueOptions) {
    const args: any[] = [name];
    if (url) args.push(url);
    if (opt) args.push(opt);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- yes, use spread here need disable typecheck
    const queue = new Bull(...args);
    this._queues[name] = queue;
  }

  public getQueue(queueName: string): Bull.Queue {
    if (!this._queues[queueName]) {
      this.addQueue(queueName);
    }

    return this._queues[queueName];
  }

  public async createJob(
    queueName: string,
    jobName: string,
    payload?: any,
    opts?: Bull.JobOptions
  ): Promise<Bull.Job<any>> {
    if (opts) return this.getQueue(queueName).add(jobName, payload, opts);
    if (payload) return this.getQueue(queueName).add(jobName, payload);
    return this.getQueue(queueName).add(jobName);
  }
}

// eslint-disable-next-line max-len
// export const QueueHandler = (options: QueueOptions = {}) => function(target: any, key: string, descriptor: PropertyDescriptor) {
//     console.log(`call decorator factory ${JSON.stringify(options)}`);
//     return (target: any, key: string, descriptor: PropertyDescriptor) => {
//         console.log(`call decorator, ${target}, ${key}, ${descriptor} `);
//         // eslint-disable-next-line no-param-reassign
//         descriptor.enumerable = true;
//     };
// };
