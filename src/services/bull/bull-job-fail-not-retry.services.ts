import { Service } from '@ourparentcenter/moleculer-decorators-extended';
import { ServiceBroker } from 'moleculer';
import BullableService, { QueueHandler } from '../../base/BullableService';

@Service({
  name: 'bulljob',
  version: 1,
})
export default class CrawlBlockService extends BullableService {
  public constructor(public broker: ServiceBroker) {
    super(broker);
  }

  @QueueHandler({
    queueName: 'Job_A',
    jobType: 'Job_A',
    prefix: 'prefix-not-work',
  })
  private async jobHandler(_payload: any): Promise<void> {
    this.logger.info('handing job', _payload);
    // throw error here make nodejs stop, not retry as bull design
    throw new Error('error 123');
  }

  async _start(): Promise<void> {
    // create job retry 5 times, every 1000ms, and remove job if count fail = 300
    this.createJob(
      'Job_A',
      'Job_A',
      { data: { key: 'value ' } },
      {
        // removeOnComplete: true,
        removeOnFail: {
          count: 300,
        },
        attempts: 5,
        backoff: 1000,
        // repeat: {
        //   every: 5000,
        // },
      }
    );

    // listen event completed success
    this.getQueueManager()
      .getQueue('Job_A')
      .on('completed', (job) => {
        this.logger.info(
          `Job #${job.id} completed!, result: ${job.returnvalue}`
        );
      });

    // listen event failed is not work
    this.getQueueManager()
      .getQueue('Job_A')
      .on('failed', (job) => {
        // so this line cannot log
        this.logger.error('Found error');
        this.logger.error(`Job #${job.id} failed!, error: ${job.failedReason}`);
      });

    // listen event progress not work because doesn't have job.progress function
    // like that https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#jobprogress
    this.getQueueManager()
      .getQueue('Job_A')
      .on('progress', (job) => {
        this.logger.info(`Job #${job.id} progress: ${job.progress()}%`);
      });
    return super._start();
  }
}
