import { MeetingLocations } from './z.schema';

export interface UpdateMeetingOptions {
  location?: MeetingLocations;
  start?: Date;
}
