import { Injectable } from '@nestjs/common';
import ical from 'ical-generator';
import { toHtml } from '../utils/meeting.utils';
import { ExtendMeetingDto } from 'src/common/types/extended-meeting.model';
import { MeetingEvent, getMailSubject } from '../utils/meeting-common.utils';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { OrganizationDetailsConfig } from 'src/common/types/config.model';

@Injectable()
export class MeetingCommonService {
  readonly organizer = {
    name:
      this.configService.get<string>('organization.name') ??
      'Organization Name',
    email:
      this.configService.get<string>('organization.email') ??
      'organization@gmail.com',
  };
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendMail(
    extendedMeetingDto: ExtendMeetingDto,
    meetingId: string,
    event: MeetingEvent,
    reason?: string | null,
  ) {
    const { location, start, end } = extendedMeetingDto;
    const calendarFile = this.generateCalendarFile(location, start, end);
    const mailOptions = this.getMailOptions(
      extendedMeetingDto,
      calendarFile,
      meetingId,
      event,
      reason,
    );
    await this.mailerService.sendMail(mailOptions);
  }

  private generateCalendarFile(location: string, start: Date, end: Date) {
    const cal = ical();
    cal.createEvent({
      start,
      end,
      summary: 'Meeting With Organization',
      description: 'A 30 minute meeting',
      location,
      timezone: 'Asia/Kathmandu',
      organizer: {
        name: this.organizer.name,
        email: 'khadkasuman324@gmail.com',
      },
    });
    cal.save('meeting');
    return cal.toString();
  }

  private getMailOptions(
    extendMeetingDto: ExtendMeetingDto,
    calendarFile: string,
    meetingId: string,
    event: MeetingEvent,
    reason?: string | null,
  ) {
    const html = this.generateHTMLTemplate(
      extendMeetingDto,
      meetingId,
      event,
      reason,
    );
    const subject = getMailSubject(event);
    console.log(extendMeetingDto.guests);
    return {
      to: extendMeetingDto.email,
      from: 'khadkasuman324@gmail.com',
      subject,
      html,
      cc: extendMeetingDto.guests ?? [],
      alternatives: [
        {
          contentType: 'text/calendar',
          content: calendarFile,
        },
      ],
    };
  }

  private generateGuestListHTML(guests?: string[] | null) {
    return guests
      ? guests.map((guest) => `<li> ${guest} - Guest </li>`).join('')
      : undefined;
  }

  private generateHTMLTemplate(
    extendMeetingDto: ExtendMeetingDto,
    meetingId: string,
    event: MeetingEvent,
    reason?: string | null,
  ) {
    const { name, email, location, notes, day, start, guests } =
      extendMeetingDto;
    const guestList = this.generateGuestListHTML(guests);
    return toHtml({
      name,
      location,
      start,
      day,
      meetingId,
      event,
      guestList,
      notes,
      reason,
      email,
    });
  }
}
