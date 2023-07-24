export interface CreateMailOptions {
  email: string;
  name: string;
  location: string;
  start: Date;
  calendar: string;
  meetingId: string;
  notes?: string;
  cc?: string[];
}
