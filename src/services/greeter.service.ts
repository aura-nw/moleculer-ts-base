/* eslint-disable */
/* eslint-disable @typescript-eslint/no-var-requires */
import { inspect, inspect as _inspect } from 'util';
import { Service as MService, ServiceBroker, Context } from 'moleculer';

import { Action, Service as ServiceD, Event } from '@ourparentcenter/moleculer-decorators-extended';

@ServiceD()
export default class GreeterService extends MService {
    public constructor(public broker: ServiceBroker) {
        // console.log('before super', inspect(broker), broker.callMiddlewareHook, broker instanceof ServiceBroker);
        super(broker);

        console.log('after super', inspect(broker), broker.callMiddlewareHook, broker instanceof ServiceBroker);
        // this.parseServiceSchema({
        //     name: 'greeter',
        //     actions: {
        //         hello: {
        //             rest: {
        //                 method: 'GET',
        //                 path: '/hello',
        //             },
        //             async handler(): Promise<string> {
        //                 return this.ActionHello();
        //             },
        //         },
        //
        //         welcome: {
        //             rest: '/welcome',
        //             params: {
        //                 name1: 'string',
        //             },
        //             async handler(ctx: Context<{ name: string }>): Promise<string> {
        //                 return this.ActionWelcome(ctx.params.name);
        //             },
        //         },
        //     },
        // });
    }

    @Action({
        skipHandler: false, // Any options will be merged with the mixin's action.
    })
    public ActionHello(): string {
        this.broker.emit<string>("eventHandler_greet", "hello")
        return 'Hello Moleculer';

    }

    @Action({
        skipHandler: false, // Any options will be merged with the mixin's action.
    })
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
        skipHandler: false,
    })
    public add(ctx: Context<{ a: number, b: number }>) {
        return ctx.params.a + ctx.params.b;
    }

    /**
     * eventHandler_greet
     */
    @Event({
        // group: 'group_name'
        context: false
    })
    'eventHandler_greet.nocontext'(payload: any, sender: string, eventName: string) {
        console.log(`payload is ${JSON.stringify(payload)}`)
        console.log(`sender is ${JSON.stringify(sender)}`)
        console.log(`eventName is ${JSON.stringify(eventName)}`)
    }
    @Event({
        // group: 'group_name'
        context: true
    })
    'eventHandler_greet.context'(ctx: Context<any>) {
        //TODO: try to find a way to avoid COntext<any
        console.log(`context is ${JSON.stringify(ctx)}`)
    }
    //
    //
    // private add() {
    //
    // }
}
