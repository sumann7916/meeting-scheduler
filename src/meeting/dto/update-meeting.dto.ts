import { extendApi } from '@anatine/zod-openapi';
import { zMeetingCreateObj } from './create-meeting.dto';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const zUpdateMeetingDto = extendApi(
  zMeetingCreateObj.pick({
    time: true,
    location: true,
    date: true,
  }),
  {
    description: 'The schema for meeting update',
  },
)
  .extend({
    reason: z.string().nullable().optional(),
  })
  .partial({
    location: true,
  });

export class UpdateMeetingDto extends createZodDto(zUpdateMeetingDto) {}
