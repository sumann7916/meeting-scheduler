import { ExtendMeetingDto } from '../types/extended-meeting.model';

export const MeetingEventTypes = {
  UPDATE_MEETING: 'update_meeting',
  CREATE_MEETING: 'create_meeting',
  CANCEL_MEETING: 'cancel_meeting',
};

export interface MeetingCreatedEvent extends ExtendMeetingDto {
  meetingId: string;
}

export interface MeetingUpdatedEvent extends MeetingCreatedEvent {
  reason?: string | null;
}

export interface MeetingCancelEvent extends MeetingUpdatedEvent {}
