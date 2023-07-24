import { MeetingEvent } from 'src/meeting/utils/meeting-common.utils';
import { MeetingLocations } from './z.schema';

export interface HtmlUtils {
  name: string;
  location: MeetingLocations | string;
  start: Date;
  email: string;
  day: string;
  meetingId: string;
  event: MeetingEvent;
  guestList?: string;
  notes?: string | null;
  reason?: string | null;
}
