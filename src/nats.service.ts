import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import {
  connect,
  type NatsConnection,
  type Subscription,
} from '@nats-io/transport-node';
import { firstValueFrom } from 'rxjs';
import { ALERT_PAYLOAD, type AlertPayload, NATS_SUBJECT } from './constants.js';

export const NEST_NATS_CLIENT = Symbol('NEST_NATS_CLIENT');

export function createNestNatsClient(): ClientProxy {
  return ClientProxyFactory.create({
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_URL ?? 'nats://localhost:4222'],
    },
  });
}

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private connection?: NatsConnection;
  private responder?: Subscription;

  constructor(
    @Inject(NEST_NATS_CLIENT) private readonly nestClient: ClientProxy,
  ) {}

  async onModuleInit(): Promise<void> {
    this.connection = await connect({
      servers: process.env.NATS_URL ?? 'nats://localhost:4222',
    });

    this.responder = this.connection.subscribe(NATS_SUBJECT, {
      callback: (error, message) => {
        if (error) {
          throw error;
        }

        // Always return the same plain JSON object. In particular, this is not
        // a Nest transport response envelope.
        message.respond(JSON.stringify(ALERT_PAYLOAD));
      },
    });

    await this.connection.flush();
    await this.nestClient.connect();
  }

  async requestWithNatsClient(): Promise<AlertPayload> {
    const message = await this.getConnection().request(
      NATS_SUBJECT,
      JSON.stringify({}),
      { timeout: 2_000 },
    );

    return message.json<AlertPayload>();
  }

  requestWithNestClientProxy(): Promise<AlertPayload> {
    return firstValueFrom(
      this.nestClient.send<AlertPayload, Record<string, never>>(
        NATS_SUBJECT,
        {},
      ),
    );
  }

  async onModuleDestroy(): Promise<void> {
    this.nestClient.close();
    this.responder?.unsubscribe();
    await this.connection?.drain();
  }

  private getConnection(): NatsConnection {
    if (!this.connection) {
      throw new Error('NATS connection is not initialized');
    }

    return this.connection;
  }
}
