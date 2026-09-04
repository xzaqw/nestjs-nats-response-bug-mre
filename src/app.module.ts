import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import {
  createNestNatsClient,
  NatsService,
  NEST_NATS_CLIENT,
} from './nats.service.js';

@Module({
  controllers: [AppController],
  providers: [
    NatsService,
    {
      provide: NEST_NATS_CLIENT,
      useFactory: createNestNatsClient,
    },
  ],
})
export class AppModule {}
