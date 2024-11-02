import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserRepository {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async create(data: any): Promise<any> {
    const userId = uuidv4(); // Generate a unique UUID
    const user = { id: userId, ...data };

    return await this.knex.table('users').insert(user).returning('*');
  }

  async findById(userId: string): Promise<any> {
    return await this.knex.table('users').where('id', userId).first();
  }

  async findByEmail(email: string): Promise<any> {
    return await this.knex.table('users').where({ email: email }).first();
  }

  async update(userId: string, updates): Promise<any> {
    return await this.knex.table('users').where({ id: userId }).update(updates).returning('*');
  }
}
