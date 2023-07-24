import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const deleteMeetingDto = z.object({
  cancel: z.string().nullable().optional(),
});

export class DeleteMeetingDto extends createZodDto(deleteMeetingDto) {}
