/* eslint-disable no-console */
import { ServiceBroker } from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import { inspect as _inspect} from 'util';
//
// TODO: Not very happy with relative import,
//  but ts-node loader does not support yet with type alias for ESM project, will try to fix later
import BullableService, { QueueHandler } from '../base/BullableService';

@Service()
export default class QueueSampleService extends BullableService {
  public static instanceCreation: any[] = [];

  public constructor(public broker: ServiceBroker) {
    super(broker);
  }

  public hello = 'hello';

  @Action()
  public addJob1(): string {
    const queueName = 'tuanbass';
    const jobType = 'hello';
    this.scheduleJob(queueName, jobType, 'It\'s a good day...');
    return 'Hello Moleculer';
  }

  @Action()
  public addJob2(): string {
    const qName = this.name;
    const jType = this.defaultHandler.name;
    console.log(`${qName}, ${jType}`);
    this.scheduleJob(qName, jType, 'Handler without specify queue option');
    return 'Hello Moleculer';
  }

  @QueueHandler({
    queueName: 'tuanbass',
    jobType: 'hello',
  })
  private async jobHandler(_payload: string): Promise<void> {
    console.log(`job handler: printing something to test.. ${_payload}`);
    console.log(' Do not access to `this` inside this handler, it\'s a limitation for the moment ');
    // console.log(this.name) => IT WILL FAIL
  }


  /**
  * If queue option is omitted, default queueName and jobType will be generated using
  * class and method name
  */
  @QueueHandler()
  private async defaultHandler(_payload: string): Promise<void> {
    console.log(_payload);
  }
}
