import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUsersTable1756814400000 } from './database/migrations/1756814400000-create-users-table';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'wenlock'),
        password: config.get<string>('DB_PASSWORD', 'wenlock'),
        database: config.get<string>('DB_DATABASE', 'wenlock'),
        autoLoadEntities: true,
        charset: 'utf8mb4',
        synchronize: config.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
        migrations: [CreateUsersTable1756814400000],
        migrationsRun:
          config.get<string>('DB_RUN_MIGRATIONS', 'true') === 'true',
        logging: config.get<string>('DB_LOGGING', 'false') === 'true',
      }),
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
