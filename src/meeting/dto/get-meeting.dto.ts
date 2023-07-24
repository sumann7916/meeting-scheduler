import { zMeetingCreateObj } from './create-meeting.dto';
import { meeting, zUUID } from '../../common/types/z.schema';
import { createZodDto } from '@anatine/zod-nestjs';

export const getMeetingDto = zMeetingCreateObj.extend({
  id: zUUID(meeting),
});

export class GetMeetingDto extends createZodDto(getMeetingDto) {}
