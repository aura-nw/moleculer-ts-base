import { Action, Service } from '@ourparentcenter/moleculer-decorators-extended';
import { ServiceBroker } from 'moleculer';
import { QueueEventsListener } from 'src/common/queue/queue-manager-types';
import BullableService, { QueueHandler } from '../../base/BullableService';

@Service()
export default class CrawlBlockService extends BullableService {
  public constructor(public broker: ServiceBroker) {
    super(broker);
  }

  @QueueHandler({
    queueName: 'QueueA',
    jobName: 'JobA',
  })
  private async jobHandler(_payload: any): Promise<void> {
    this.logger.info('handing job', _payload);
    const { count } = _payload.data;

    if (count % 2 === 1) throw new Error('error 123');
    else this.logger.info('jobHandler success');
  }

  @Action()
  public addJobWillFail(): string {
    const qName = 'QueueA';
    const jType = 'JobA';
    this.logger.info(`${qName}, ${jType}`);
    this.createJob(
      qName,
      jType,
      { data: { key: 'value ', count: 1 } },
      {
        // removeOnComplete: true,
        removeOnFail: {
          count: 300,
        },
        attempts: 7,
        backoff: 1000,
        // repeat: {
        //   every: 5000,
        // },
      }
    );
    return 'Job schduled';
  }

  @Action()
  public addJobWillSuccess(): string {
    const qName = 'QueueA';
    const jType = 'JobA';
    this.logger.info(`${qName}, ${jType}`);
    this.createJob(
      qName,
      jType,
      { data: { key: 'value ', count: 2 } },
      {
        // removeOnComplete: true,
        removeOnFail: {
          count: 300,
        },
        attempts: 7,
        backoff: 1000,
        // repeat: {
        //   every: 5000,
        // },
      }
    );
    return 'Job schduled';
  }

  async _start(): Promise<void> {
    // create job retry 5 times, every 1000ms, and remove job if count fail = 300
    // const queueEvents = new QueueEvents('QueueA', { connection: { host: 'localhost', port: 8888 } });
    const queueEvents = this.getQueueManager().getQueueEventsListener('QueueA') as QueueEventsListener;

    queueEvents.on('failed', (jobId, _err) => {
      this.logger.info('queue event failed', jobId);
    });
    //
    // cleaned: (jobs: string[], type: string) => void;
    // error: (err: Error) => void;
    // paused: () => void;
    // progress: (job: Job<DataType, ResultType, NameType>, progress: number | object) => void;
    // removed: (job: Job<DataType, ResultType, NameType>) => void;
    // resumed: () => void;
    // waiting: (job: Job<DataType, ResultType, NameType>) => void;

    // listen event completed success
    // this.getQueueManager()
    //   .getQueue('Job_A')
    //   .on('completed', (job) => {
    //     this.logger.info(`Job #${job.id} completed!, result: ${job.returnvalue}`);
    //   });
    //
    // // listen event failed is not work
    // this.getQueueManager()
    //   .getQueue('Job_A')
    //   .on('failed', (job) => {
    //     // so this line cannot log
    //     this.logger.error('Found error');
    //     this.logger.error(`Job #${job.id} failed!, error: ${job.failedReason}`);
    //   });
    //
    // // listen event progress not work because doesn't have job.progress function
    // // like that https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#jobprogress
    // this.getQueueManager()
    //   .getQueue('Job_A')
    //   .on('progress', (job) => {
    //     this.logger.info(`Job #${job.id} progress: ${job.progress()}%`);
    //   });
    return super._start();
  }
}
