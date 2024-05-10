import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import dbConfig from './adapters/persistence/db.config';
import { PersistenceModule } from './adapters/persistence/persistence.module';
import { AuthModule } from './application/auth/auth.module';
import { AutGuard } from './application/auth/guard/auth.guard';
import { UserModule } from './application/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [dbConfig],
      isGlobal: true,
    }),
    PersistenceModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AutGuard,
    },
  ],
})
export class AppModule {}
