import { OnEvent } from '@nestjs/event-emitter';
import { MeetingCommonService } from './meeting-commons.service';
import {
  MeetingCancelEvent,
  MeetingCreatedEvent,
  MeetingEventTypes,
  MeetingUpdatedEvent,
} from '../../common/types/events';
import { MeetingEvent } from '../utils/meeting-common.utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeetingEventService {
  constructor(private meetingCommonService: MeetingCommonService) {}

  @OnEvent(MeetingEventTypes.CREATE_MEETING)
  handleMeetingCreated(event: MeetingCreatedEvent) {
    this.meetingCommonService.sendMail(
      event,
      event.meetingId,
      MeetingEvent.create,
    );
  }

  @OnEvent(MeetingEventTypes.UPDATE_MEETING)
  handleMeetingUpdated(event: MeetingUpdatedEvent) {
    this.meetingCommonService.sendMail(
      event,
      event.meetingId,
      MeetingEvent.reschedule,
      event.reason,
    );
  }

  @OnEvent(MeetingEventTypes.CANCEL_MEETING)
  handleMeetingCancelled(event: MeetingCancelEvent) {
    this.meetingCommonService.sendMail(
      event,
      event.meetingId,
      MeetingEvent.cancel,
      event.reason,
    );
  }
}
