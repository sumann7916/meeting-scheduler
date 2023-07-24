import { MeetingLocations } from './z.schema';

export interface ExtendMeetingDto {
  name: string;
  email: string;
  location: MeetingLocations | string;
  notes?: string | null;
  guests?: string[] | null;
  day: string;
  start: Date;
  end: Date;
  cancelled?: boolean;
}
