import { BadRequestException, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SnapshotsRepository {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createSnapshot(data: any): Promise<any> {
    const snapshotId = uuidv4();
    const snapshot = { id: snapshotId, ...data };
    return await this.knex.table('balance_snapshots').insert(snapshot).returning('*');
  }

  async getLastSnapshot(userId: string): Promise<any> {
    return await this.knex('balance_snapshots')
        .where({ user_id: userId }) // Use object form for parameter binding
        .orderBy('created_at', 'desc')
        .first();
}
}
