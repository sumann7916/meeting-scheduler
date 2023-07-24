import { extendApi } from '@anatine/zod-openapi';
import {
  dayList,
  holidays,
  toMinutes,
} from '../../meeting/utils/meeting.utils';
import { EnumLike, date, z } from 'zod';
import { DateTime } from 'luxon';

export const meeting = 'meeting' as const;

export type MainResource = 'meeting';
export type EntityName = MainResource;

const MIN_ACPTD_TIME_IN_MIN = 630; //10:30 in minutes
const MAX_ACPTD_TIME_IN_MIN = 930; //15:30 in minutes

export enum MeetingLocations {
  'Office' = 'Office',
  'GoogleMeet' = 'GoogleMeet',
}

export const zDay = extendApi(z.enum(dayList), {
  description: `The day of the meeting`,
  example: 'Sunday',
});

export const zUUID = (entity: EntityName) =>
  extendApi(z.string().uuid(), {
    description: `The unique internal identity string for ${entity}`,
    type: 'string',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  });

export const zString = (
  entity: EntityName,
  maxLength: number,
  field = 'name',
) =>
  extendApi(z.string().min(1).max(maxLength), {
    description: `The ${field} of ${entity} creator`,
    type: 'string',
    minimum: 1,
    maximum: maxLength,
    example: field,
  });

export const zName = (
  entity: EntityName,
  maxLength: number,
  optional = false,
) =>
  extendApi(zString(entity, maxLength, 'name'), {
    example: 'John Doe',
  });

export const zEmail = (entity: EntityName) =>
  extendApi(z.string().email(), {
    description: `The email field of ${entity}`,
    type: 'string',
    example: 'johndoe@gmail.com',
  });

export const zLocations = extendApi(z.nativeEnum(MeetingLocations), {
  example: MeetingLocations.Office,
});
export const zUniqueEmails = (entity: EntityName, field = 'email') =>
  extendApi(
    z
      .array(z.string().email())
      .refine((guests) => new Set(guests).size === guests.length, {
        message: 'Guest email addresses must be unique',
      })
      .optional(),
    {
      description: `The ${field} of ${entity}`,
      type: 'array',
      example: ['user1@gmail.com', 'user2@gmail.com'],
    },
  );

export const zEnum = <T extends EnumLike>(
  entity: EntityName,
  field = '',
  type: T,
) => {
  return extendApi(z.nativeEnum(type), {
    description: `The enum value  ${field} of ${entity}`,
    type: 'string',
  });
};

export const zMeetingDate = z.string().transform((dateString, ctx) => {
  const [year, month, day] = dateString.split('/');
  if (!year || !month || !day) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `String must be in yyyy/mm/dd format`,
    });
  }
  const dateTime = DateTime.local(
    parseInt(year),
    parseInt(month),
    parseInt(day),
    { zone: 'Asia/Kathmandu' },
  );
  if (!dateTime.isValid) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid Date',
    });
  }
  return dateTime.toJSDate();
});

export const zTime = (entity: EntityName) =>
  extendApi(
    z.string().refine(
      (value) => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if (!timeRegex.test(value)) {
          return false;
        }
        const timeInMinutes = toMinutes(value);
        return !(
          timeInMinutes < MIN_ACPTD_TIME_IN_MIN ||
          timeInMinutes > MAX_ACPTD_TIME_IN_MIN
        );
      },
      { message: 'Time must be between 10:30 to 15:30' },
    ),
    {
      description: `The time of ${meeting}`,
      type: 'string',
      example: '11:00',
    },
  );
