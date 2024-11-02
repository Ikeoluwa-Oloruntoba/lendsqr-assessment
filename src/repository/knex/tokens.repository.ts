import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokensRepository {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createToken(data: any): Promise<any> {

    const tokenId = uuidv4();
    const token = { id: tokenId, ...data };
    return await this.knex('tokens').insert(token).returning('*');
  }

  async revokeToken(tokenId: string): Promise<any> {
    return await this.knex('tokens').where({ id: tokenId }).update({ revoked_at: new Date() });
  }
}
