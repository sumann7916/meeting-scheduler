import { Meeting } from '@prisma/client';
import { dayList } from './meeting.utils';
import { CreateMeetingDto } from '../dto/create-meeting.dto';
import { ExtendMeetingDto } from 'src/common/types/extended-meeting.model';

export const toCreatedMeetingDto = (meeting: Meeting) => ({
  id: meeting.id,
  name: meeting.name,
  date: meeting.start.toLocaleDateString(),
  email: meeting.email,
  location: meeting.location,
  day: dayList[meeting.start.getDay()],
  notes: meeting.notes,
  time: getTimeFromDateObj(meeting.start),
});

export const toGetMeetingDto =
  (meeting: Meeting) => (reason?: string | null) => ({
    ...toCreatedMeetingDto(meeting),
    cancelled: meeting.cancelled,
    reason,
  });

export const mergeTimeAndDate = (date: Date) => (time: string) => {
  const { hour, minute } = splitHourAndMin(time);
  const start = new Date(date);
  start.setHours(hour, minute);
  return start;
};

export const getTimeFromDateObj = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const time = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
  return time;
};
export const splitHourAndMin = (time: string) => {
  const [hourStr, minuteStr] = time.split(':');
  return {
    hour: parseInt(hourStr),
    minute: parseInt(minuteStr),
  };
};

const getMeetingEndTime = (start: Date, duration = 30): Date => {
  const endTime = new Date(start.toString());
  endTime.setMinutes(start.getMinutes() + duration);
  return endTime;
};

export const getDayAndStartDate = (date: Date, time: string) => {
  const start = mergeTimeAndDate(date)(time);
  const end = getMeetingEndTime(start);
  return { day: dayList[date.getDay()], start, end };
};

export const extendCreateMeetingDto = (
  createMeetingDto: CreateMeetingDto,
): ExtendMeetingDto => {
  const { day, start, end } = getDayAndStartDate(
    createMeetingDto.date,
    createMeetingDto.time,
  );
  const { time, date, ...exceptTimeAndDate } = createMeetingDto;
  return { ...exceptTimeAndDate, day, start, end };
};

export const toExtendMeetingDto = (meeting: Meeting): ExtendMeetingDto => {
  const end = getMeetingEndTime(meeting.start);
  const day = dayList[meeting.start.getDay()];
  return { ...meeting, end, day };
};

export enum MeetingEvent {
  'create' = 'create',
  'reschedule' = 'reschedule',
  'cancel' = 'cancel',
}

export const getMailSubject = (event: MeetingEvent) => {
  switch (event) {
    case MeetingEvent.create: {
      return 'Meeting Invitation';
    }
    case MeetingEvent.reschedule: {
      return 'Meeting Reschedule';
    }
    case MeetingEvent.cancel: {
      return 'Meeting Cancellation';
    }
  }
};
