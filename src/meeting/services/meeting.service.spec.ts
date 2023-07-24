import { Test, TestingModule } from '@nestjs/testing';
import { MeetingService } from './meeting.service';
import { PrismaService } from '../../common/services/prisma.service';
import { MeetingCommonService } from './meeting-commons.service';
import { Meeting, Prisma, PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { MeetingEventService } from './meeting-event.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../../common/config/config';
import { prismaMeetingCreateResponse } from '../mocks/meeting-service-response.mock';

describe('MeetingService', () => {
  let service: MeetingService;
  let prismaService: PrismaService;
  let commonsService: MeetingCommonService;
  let eventService: MeetingEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [config],
        }),
        EventEmitterModule.forRoot(),
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
      providers: [
        MeetingService,
        MeetingCommonService,
        PrismaService,
        MeetingEventService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<MeetingService>(MeetingService);
    commonsService = module.get<MeetingCommonService>(MeetingCommonService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(commonsService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  it('should create meeting and return  name, email, location, date, id, day', () => {
    const serviceCreateSpy = jest
      .spyOn(prismaService.meeting, 'create')
      .mockResolvedValueOnce({} as Meeting);
  });
});
