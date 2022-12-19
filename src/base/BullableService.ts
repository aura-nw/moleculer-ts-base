/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServiceBroker } from 'moleculer';
import Bull from 'bull';
import QueueManager from '../common/bull/QueueManager';
import BaseService from './BaseService';


const DEFAULT_JOB_OTION: JobOptions = {
  removeOnComplete: true,
  removeOnFail: {
    count: 3,
  },
};

export default class BullableService extends BaseService {
  private qm?: QueueManager;

  public constructor(public broker: ServiceBroker) {
    super(broker);
  }

  public scheduleJob(queueName: string, jobType: string, payload?: any, opts?: any): Promise<Bull.Job<any>> {
    const jobOptions = { ...DEFAULT_JOB_OTION, ...opts };
    return this.getQueueManager().createJob(queueName, jobType, payload, jobOptions);
  }

  public async setHandler(queueName: string, jobName: string, fn: (payload: any) => Promise<void>): Promise<void> {
    this.getQueueManager().setHandler(queueName, jobName, fn);
  }

  getQueueManager(): QueueManager {
    if (!this.qm) this.qm = QueueManager.getInstance(); // TODO: consider should we use singleton instance here or not
    return this.qm;
  }
}


export interface JobOptions extends Bull.JobOptions { }
export interface QueueOptions {
  queueName?: string,
  jobType?: string,
}

export function QueueHandler(opt?: QueueOptions) {
  return (target: any, propertyKey: string, _descriptor: PropertyDescriptor) => {
    // eslint-disable-next-line no-param-reassign
    // console.log(target.setHandler);
    if (!target.setHandler) {
      // console.log('cannot setHandler');
      // console.log(` target: ${inspect(target)}, construct: ${inspect(target.constructor)}`);
      // console.log(`propertyKey:${propertyKey}, descriptor: ${inspect(descriptor)}`);
      // cannot apply decorator for class not extend from BullableService
      return;
    }

    // default queue name and job type from class and method name
    const qOpt = opt ?? {};
    const qName = qOpt.queueName ?? target.constructor.name;
    const jType = qOpt.jobType ?? propertyKey;
    console.log(`${qName}, ${jType}`);
    // target.setHandler(qName, jType, target[propertyKey].bind(target));
    target.setHandler(qName, jType, target[propertyKey]);
  };
}
