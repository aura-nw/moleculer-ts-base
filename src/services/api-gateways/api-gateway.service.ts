/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * API Gateway class
 * Just receive request from client, parse param and forward to coresponding bussiness Service(s)
 * PLEASE DONT PUT BUSINESS LOGIC HERE
 *  to list : curl localhost:3000/api/ApiService/list-aliases | jq '.[] | select(.actionName| contains("PersonService.sayWelcome"))'
 */

import ApiGateway from 'moleculer-web';
import { Context, ServiceBroker } from 'moleculer';
import { Service } from '@ourparentcenter/moleculer-decorators-extended';

import * as permission from './site-permission';
import BaseService from '../../base/BaseService';

// Could export it to a separate file if there is complex logic, or a long list, or changed frequently
// also support regex
// You also need to ensure that an action is not exposed to both public and private route
// const publicApi = ['GreeterService.sayHello', 'PersonService.a*', /^Per/];
// const adminApi = ['GreeterService.sayWelcome'];
// const openApi = ['openapi.*'];

@Service({
  mixins: [ApiGateway],
  settings: {
    routes: [
      {
        // Route for Swagger UI
        path: '/api', // this path must be api, otherwise swagger will not work
        autoAliases: true, // allow generate rest info (GET/PUT/POST...) in the services
        mappingPolicy: 'restrict', // allow action called with exact method
        whitelist: permission.openApi(),
      },
      {
        // Route for public API
        path: '/public',
        autoAliases: true, // allow generate rest info (GET/PUT/POST...) in the services
        mappingPolicy: 'restrict', // allow action called with exact method
        whitelist: permission.publicApi(),
      },
      {
        // Route for private API
        path: '/admin',
        autoAliases: true, // allow generate rest info (GET/PUT/POST...) in the services
        mappingPolicy: 'restrict', // allow action called with exact method
        whitelist: permission.adminApi(),

        // authorization: 'customAuthorization',  // you can also define a custom method to check authorization here.
        authorization: true,
        authentication: true,
      },
      {
        path: '/upload',

        // You should disable body parsers
        bodyParsers: {
          json: false,
          urlencoded: false,
        },
        // authorization: true,
        // authentication: true,
        aliases: {
          // File upload from HTML form
          'POST /photos': 'multipart:v1.file.save',
        },

        // https://github.com/mscdex/busboy#busboy-methods
        busboyConfig: {
          limits: {
            files: 1,
            fileSize: 10000000,
          },
        },

        mappingPolicy: 'restrict',
      },
    ],
    // empty cors object will have moleculer to generate handler for preflight request and CORS header which allow all origin
    cors: {},
  },
})
export default class ApiService extends BaseService {
  public constructor(public broker: ServiceBroker) {
    super(broker);
  }

  async authorize(_ctx: Context<any>, _route: any, _req: any, _res: any) {
    console.log('authorizing...');

    // query user from _ctx.meta.user and check if user has permission to access this route
    // eslint-disable-next-line @typescript-eslint/dot-notation
    const _user = _ctx.meta['user'];

    if (_user.id !== 1) {
      throw new Error('Unauthorized');
    } // allow access})
  }

  async authenticate(_ctx: Context<any>, _route: any, _req: any, _res: any) {
    // It should check the header and return the user object. The returned user object will be available in `ctx.meta.user`.
    console.log('authenticating...');
    const auth = _req.headers.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }
    // query user information and return
    return { id: 1, name: 'John Doe' };
  }
  /**
   * call it with curl  --request PUT 'http://0.0.0.0:3000/api/svc/add?a=8&b=2'
   * Schema for validattion
   */
  // @Put('/add', {
  //   params: {
  //     a: 'number',
  //     b: { type: 'number', default: 0 }
  //   },
  // })
  // public add(ctx: Context<{ a: number; b: number }>) {
  //   // TODO: find solution to get action name : 'MathService.add' instead of string hardcode
  //   return this.broker.call('MathService.add', { a: ctx.params.a, b: ctx.params.b });
  // }

  // customAuthorization (){
  //   // do something
  // }
}
