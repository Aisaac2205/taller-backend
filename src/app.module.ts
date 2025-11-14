import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@infrastructure/http/http.module';
import { RecordatoriosScheduler } from '@infrastructure/schedulers/recordatorios.scheduler';
import { PersistenceModule } from '@infrastructure/persistence/persistence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    PersistenceModule,
    HttpModule,
  ],
  providers: [RecordatoriosScheduler],
})
export class AppModule {}

