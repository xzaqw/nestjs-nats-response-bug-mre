import { Controller, Get } from '@nestjs/common';
import type { AlertPayload } from './constants.js';
import { NatsService } from './nats.service.js';

@Controller('alerts')
export class AppController {
  constructor(private readonly natsService: NatsService) {}

  @Get('via-nats-client')
  requestViaNatsClient(): Promise<AlertPayload> {
    return this.natsService.requestWithNatsClient();
  }

  @Get('via-nest-client-proxy')
  requestViaNestClientProxy(): Promise<AlertPayload> {
    return this.natsService.requestWithNestClientProxy();
  }
}
