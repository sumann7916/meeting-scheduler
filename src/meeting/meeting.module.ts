import { Module } from '@nestjs/common';
import { MeetingController } from './controller/meeting.controller';
import { MeetingService } from './services/meeting.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/services/prisma.service';
import { MeetingCommonService } from './services/meeting-commons.service';
import { MeetingEventService } from './services/meeting-event.service';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('smtp.server'),
          auth: {
            user: 'apikey',
            pass: configService.get<string>('smtp.passkey'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MeetingController],
  providers: [
    MeetingService,
    PrismaService,
    MeetingCommonService,
    MeetingEventService,
  ],
})
export class MeetingModule {}
