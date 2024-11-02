import { Injectable, OnModuleInit } from '@nestjs/common';
import Redlock from 'redlock';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class LockService implements OnModuleInit {
  private redlock: Redlock;

  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    this.redlock = new Redlock(
      [this.redisService.getClient()],
      {
        retryCount: 10,
        retryDelay: 500,
        retryJitter: 100,
      }
    );
  }

  async acquireLock(resource: string, ttl: number) {
    return this.redlock.acquire([resource], ttl);
  }

  async releaseLock(lock) {
    await lock.release();
  }
}
