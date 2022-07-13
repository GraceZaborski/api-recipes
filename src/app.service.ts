import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}
  async getHello(): Promise<string> {
    const { db, collections, ok } = await this.connection.db.stats();
    return `Hello World! Connected to ${db} with ${collections} collections. Status: ${
      ok ? 'ok' : 'not ok'
    }`;
  }
}
