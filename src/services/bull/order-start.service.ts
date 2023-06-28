import { Service } from '@ourparentcenter/moleculer-decorators-extended';
import { ServiceBroker } from 'moleculer';
import { QueueHandler } from '@aura-nw/aura-ts-toolkit';
import BullableService from '../../base/BullableService';

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
    this.logger.info('running job');
  }

  async delay(time: any) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async _start(): Promise<void> {
    await this.delay(20000);
    this.logger.info('sleep done');
    this.createJob(
      'QueueA',
      'JobA',
      { data: { key: 'value ', count: 1 } },
      {
        removeOnComplete: true,
        removeOnFail: {
          count: 3,
        },
        repeat: {
          every: 1000,
        },
      }
    );
    return super._start();
  }
}
