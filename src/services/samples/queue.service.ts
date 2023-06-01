/* eslint-disable no-console */
import { ServiceBroker } from 'moleculer';
import { Action, Service } from '@ourparentcenter/moleculer-decorators-extended';
//
// TODO: Not very happy with relative import,
//  but ts-node loader does not support yet with type alias for ESM project, will try to fix later
import { QueueHandler } from '@aura-nw/aura-ts-toolkit';
import BullableService from '../../base/BullableService';

@Service()
export default class QueueSampleService extends BullableService {
  _count = 0;

  public static instanceCreation: any[] = [];

  public constructor(public broker: ServiceBroker) {
    super(broker);
  }

  @Action()
  public addJob1(): string {
    const queueName = 'tuanbass';
    const jobName = 'hello';
    this.createJob(queueName, jobName, { msg: 'It is a good day...' });
    return 'Job schduled';
  }

  @Action()
  public addJob2(): string {
    const qName = 'QueueSampleService'; // QueueSampleService
    const jType = QueueSampleService.prototype.defaultHandler.name; // defaultHandler
    console.log(`${qName}, ${jType}`);
    this.createJob(qName, jType, {
      data: 'Handler without specify queue option',
    });
    return 'Job schduled';
  }

  @QueueHandler({
    queueName: 'tuanbass',
    jobName: 'hello',
    concurrency: 3,
    // prefix: '__testprefix',
  })
  /**
   * declare a queue handler
   * Redis configuration should be set in environment : export QUEUE_JOB_REDIS="redis://localhost:6380
   * if not set, it will default to localost: 6379
   * @param _payload -
   */
  private async jobHandler(_payload: object): Promise<void> {
    console.log(`job handler: printing something to test.. ${JSON.stringify(_payload)}`);
    console.log(`now I can access to this.name: ${this.name}`);
    if (this._count++ % 3 === 0) {
      throw new Error(`This is a custom error ${this._count}`);
    }
  }

  /**
   * If queue option is omitted, default queueName and jobType will be generated using
   * class and method name
   */
  @QueueHandler({})
  private async defaultHandler(_payload: object): Promise<void> {
    console.log(_payload);
  }

  async started() {
    // do some initialization here
  }
}
