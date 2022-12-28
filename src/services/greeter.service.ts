/* eslint-disable @typescript-eslint/no-var-requires */
import { ServiceBroker, Context } from 'moleculer';

import { Action, Service, Event } from 'moleculer-decorators';
// import BaseService from 'src/base/BaseService';
// TODO: Not very happy with relative import,
//  but ts-node loader does not support yet with type alias for ESM project, will try to fix later
import BaseService from '../base/BaseService';

@Service()
export default class GreeterService extends BaseService {
  public constructor(public broker: ServiceBroker) {
    super(broker);
  }

  @Action()
  public ActionHello(): string {
    this.broker.emit<string>('eventHandler_greet', 'hello');
    return 'Hello Moleculer';
  }

  @Action()
  public ActionWelcome(ctx: Context<{ name: string }>): string {
    return `Welcome, ${JSON.stringify(ctx.params.name)}`;
  }

  // TODO: Try to eliminate duplicate declaration of params (a,b)
  @Action({
    cache: false,
    params: {
      a: 'number',
      b: 'number',
    },
  })
  public add(ctx: Context<{ a: number; b: number }>) {
    return ctx.params.a + ctx.params.b;
  }

  /**
   * eventHandler_greet
   */
  @Event({
    // group: 'group_name'
    context: false, // Auto spread event payload to method params , without passing Context object to method
  })
  // run in CLI:
  //    mol$ emit eventHandler_greet_nocontext --abc=1 --def=2
  eventHandler_greet_nocontext(
    payload: string,
    sender: string,
    eventName: string
  ) {
    this.logger.info(`payload is ${JSON.stringify(payload)}`);
    this.logger.info(`sender is ${JSON.stringify(sender)}`);
    this.logger.info(`eventName is ${JSON.stringify(eventName)}`);
  }

  @Event({
    // group: 'group_name'
    context: true, // pass full context object to event method
  })
  'eventHandler_greet.context'(ctx: Context<any>) {
    // TODO: try to find a way to avoid COntext<any
    this.logger.info(`context is ${JSON.stringify(ctx)}`);
  }
}
