import { Module } from '@nestjs/common';
import { createClient } from 'redis';
import { REDIS_CLIENT } from '../shared/constants/redis.constants';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async () => {
        const client = createClient({
          url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        });

        await client.connect();

        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
