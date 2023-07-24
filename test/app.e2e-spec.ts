import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MeetingController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('should return meeting details', async () => {
    const res = await request(app.getHttpServer()).get(
      '/api/meeting/02957516-74f6-476e-a5ae-4ec5b5e72692',
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe('02957516-74f6-476e-a5ae-4ec5b5e72692');
  });

  it('should create meeting and return meeting id', async () => {
    const res = await request(app.getHttpServer()).post('/api/meeting').send({
      name: 'Hello World',
      email: 'khadkasuman324@gmail.com',
      location: 'Yarsa Labs Office, Kathmandu',
      day: 'Wednesday',
      time: '11:00 am',
      date: '2023/06/15',
      notes: 'Hello',
    });
    console.log(res.body);
    expect(res.status).toBe(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
