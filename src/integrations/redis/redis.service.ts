import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import { REDIS_URL } from 'src/config/env.config';

@Injectable()
export class RedisService {
  private readonly client;

  constructor() {
    this.client = createClient({
      url: REDIS_URL || 'redis://localhost:6379',
    });
    this.client.connect();
  }

  getClient() {
    return this.client;
  }
}
