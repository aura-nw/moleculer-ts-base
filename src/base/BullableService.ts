/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServiceBroker } from 'moleculer';
import { QueueManager, JobOption, QueueOptions } from '@aura-nw/aura-ts-toolkit';
import _ from 'underscore';

import BaseService from './BaseService';

// const BULL_REDIS_KEY = process.env.BULL_REDIS_KEY || 'BULL_REDIS_KEY';

export default class BullableService extends BaseService {
  private qm?: QueueManager;

  public constructor(public broker: ServiceBroker) {
    super(broker);
    this.getQueueManager().bindQueueOwner(this);
  }

  public createJob(queueName: string, jobType?: string, payload?: object, opts?: JobOption): Promise<void> {
    return this.getQueueManager().createJob(queueName, jobType, opts, payload);
  }

  // listHandler to save all from decorator
  private listHandler?: {
    opts: QueueOptions;
    fn: (payload: any) => Promise<void>;
  }[];

  public async setHandler(opts: QueueOptions, fn: (payload: any) => Promise<void>): Promise<void> {
    // comment this because not want register job now
    // this.getQueueManager().registerQueueHandler(opts, fn);

    // just put it in a list, and start it in _start life cycle
    if (!this.listHandler) this.listHandler = [];
    this.listHandler?.push({ opts, fn });
  }

  getQueueManager(): QueueManager {
    if (!this.qm) this.qm = QueueManager.getInstance();
    return this.qm;
  }

  // //////////////////////////////////////// life cycle handler

  _start(): Promise<void> {
    // register queue here
    if (this.listHandler && this.listHandler.length > 0) {
      this.listHandler?.forEach((element: any) => {
        this.getQueueManager().registerQueueHandler(element.opts, element.fn);
      });
    }
    return super._start();
  }

  async stopped() {
    super.stopped();
    try {
      this.getQueueManager().stopAll();
    } catch (e) {
      this.logger.warn('Unable to stop redis queuegracefully.', e);
    }
  }
}
