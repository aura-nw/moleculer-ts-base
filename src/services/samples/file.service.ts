/* eslint-disable @typescript-eslint/no-explicit-any */
import { Errors } from 'moleculer';
import { Service, Post } from '@ourparentcenter/moleculer-decorators-extended';
// import {
//   ERROR_CODE,
//   ErrorMessage,
//   ResponseDto,
//   RestOptions,
// } from '../../types';
import BaseService from '../../base/BaseService';

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
@Service({
  name: 'file',
  version: 1,
  mixins: [],
})
export default class OffchainTokenService extends BaseService {
  // protected s3Client = new S3Service().connectS3();

  @Post('/save', {
    openapi: {
      summary: 'upload file',
      // security: [
      //   { BearerAuth: [] }, // use the same name as above
      // ],
    },
  })
  private async save(): Promise<any> {
    try {
      return {
        data: { x: 'xxxxxxx' },
        // data: { linkS3 },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.logger.error('upload photos error:', error);
      throw new Errors.MoleculerError(
        error.message ?? '',
        error.statusCode ?? error.code ?? 500,
        error.type,
        error.data
      );
    }
  }
}
