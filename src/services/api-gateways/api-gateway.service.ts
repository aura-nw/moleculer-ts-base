/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * API Gateway class
 * Just receive request from client, parse param and forward to coresponding bussiness Service(s)
 * PLEASE DONT PUT BUSINESS LOGIC HERE
 */

import ApiGateway from 'moleculer-web';
import { ServiceBroker } from 'moleculer';

import { Service } from '@ourparentcenter/moleculer-decorators-extended';
import BaseService from '../../base/BaseService';

@Service({
  mixins: [ApiGateway],
  settings: {
    routes: [
      {
        path: '/api',
        autoAliases: true, // allow generate rest info (GET/PUT/POST...) in the services
        mappingPolicy: 'restrict', // allow action called with exact method
        // aliases: {
        //   'GET /api/openapi/openapi.json': 'openapi.generateDocs', // swagger scheme
        //   'GET /ui': 'openapi.ui', // ui
        //   'GET /api/openapi/assets/:file': 'openapi.assets', // js/css files
        //   'GET /hello1': 'openapi.ui', // js/css files
        // },
      },
    ],
  },
})
export default class ApiService extends BaseService {
  public constructor(public broker: ServiceBroker) {
    super(broker);
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
}
