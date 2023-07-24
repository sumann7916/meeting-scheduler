import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import {
  MeetingLocations,
  meeting,
  zDay,
  zEmail,
  zEnum,
  zMeetingDate,
  zName,
  zString,
  zTime,
  zUUID,
  zUniqueEmails,
} from '../../common/types/z.schema';
import { extendApi } from '@anatine/zod-openapi';

export const zMeetingCreateObj = z.object({
  name: zName(meeting, 30),
  email: zEmail(meeting),
  location: zEnum(meeting, 'location', MeetingLocations),
  notes: zString(meeting, 100, 'notes').optional().nullable(),
  guests: zUniqueEmails(meeting, 'guests').nullable(),
  time: zTime(meeting),
  date: zMeetingDate,
});

export const zMeetingCreate = zMeetingCreateObj.refine(
  (schema) => !schema.guests || !schema.guests.includes(schema.email),
  {
    message: "The organizer's email should not be included in the guests list",
  },
);
export const createdMeetingDto = zMeetingCreateObj
  .omit({
    notes: true,
    guests: true,
    time: true,
  })
  .extend({
    id: zUUID(meeting),
    day: z.string(),
    time: extendApi(z.string(), { example: '11:30' }),
  });

export class CreateMeetingDto extends createZodDto(zMeetingCreate) {}
export class CreatedMeetingDto extends createZodDto(createdMeetingDto) {}
