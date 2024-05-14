import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get postgresConfig(): TypeOrmModuleOptions {
    const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];
    return {
      type: 'postgres',
      host: this.getString('POSTGRES_HOST'),
      port: this.getNumber('POSTGRES_PORT'),
      username: this.getString('POSTGRES_USERNAME'),
      password: this.getString('POSTGRES_PASSWORD'),
      database: this.getString('POSTGRES_DATABASE'),
      // synchronize: this.getBoolean('POSTGRES_SYNC'),
      migrations,
      migrationsRun: true,
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      logging: this.getBoolean('POSTGRES_LOGGING'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  get authConfig() {
    return {
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set');
    }
    console.log('for test');
    return value;
  }
}
