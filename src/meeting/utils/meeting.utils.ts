import { HtmlUtils } from 'src/common/types/htmlUtils.model';
import { MeetingLocations } from '../../common/types/z.schema';
import { MeetingEvent, getMailSubject } from './meeting-common.utils';

export const toMinutes = (time: string) => {
  const [hourStr, minuteStr, period] = time.split(/:| /);
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);
  const pmOffset = shouldAddPMOffset(hour, period) ? 12 * 60 : 0;
  const totalMinutes = hour * 60 + minute + pmOffset;
  return totalMinutes;
};

const shouldAddPMOffset = (hour: number, period?: string) => {
  return period && period.toLowerCase() === 'pm' && hour !== 12;
};

export const dayList = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
export const holidays = ['Saturday', 'Sunday'];

export const style = `
<style>
/* CSS styles for the invitation layout */
body {
  background-color: #f9f9f9;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  background-color: #007bff;
  color: #fff;
  padding: 20px;
  text-align: center;
}

.content {
  padding: 20px;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 10px;
}

.event-details p {
  margin-top: 0;
  margin-bottom: 5px;
}

.attendees ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.attendees li {
  margin-bottom: 5px;
}

.additional-notes p {
  margin: 0;
}

.footer {
  background-color: #f9f9f9;
  padding: 20px;
  border-top: 1px solid #ddd;
  text-align: center;
}

</style>
`;

export const toHtml = (htmUtils: HtmlUtils) => {
  const {
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
  } = htmUtils;
  let locationLink = '';
  switch (location) {
    case MeetingLocations.Office:
      locationLink = 'Office Location';
      break;
    case MeetingLocations.GoogleMeet:
      locationLink = 'Google Meet Location';
  }
  return `
  <html>
    <head>
    ${style}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${getMailSubject(event)}</h1>
        </div>

        <div class="content">
          <div class="section">
            <h2 class="section-title">Event Details</h2>
            <p><strong><h2>What</h2></strong> 30-Minute Meeting between Organization and ${name}</p>
            <p><strong><h2>When</h2></strong>${day}</p>
            <p><strong><h2>Where</h2></strong><a href=${locationLink}> ${location}</a></p>
            <p><strong><h2>Description</h2></strong>A 30 minute meeting</p>
          </div>

          <div class="section">
            <h3 class="section-title">Attendees</h3>
            <ul>
              <li>Yarsa Labs - Organizer</li>
              <li>${name} - Guest &lt;${email}&gt;</li>
              <li>Other Attendee - Yarsa Labs Attendee</li>
              ${guestList ?? ''}
            </ul>
          </div>

          ${
            notes
              ? `<div class="section">
            <h3 class="section-title">Additional Notes</h3>
            <p>${notes}</p>
          </div>`
              : ''
          }

          ${
            event === MeetingEvent.reschedule && reason
              ? `<div class="section"><h3 class="section-title">Reason for Reschedule</h3><p>${reason}</p></div>`
              : ''
          }

          ${
            event === MeetingEvent.cancel && reason
              ? `<div class="section"><h3 class="section-title">Reason for Cancellation</h3><p>${reason}</p></div>`
              : ''
          }
        </div>

        ${
          event === MeetingEvent.create || event === MeetingEvent.reschedule
            ? `<div class="footer"><p>Need to make a change? <a href="${
                process.env.CLIENT_BASE_URL + '/meeting'
              }">Reschedule</a> or <a href="${
                process.env.CLIENT_BASE_URL + '/meeting/' + meetingId
              }">Cancel</a></p> </div>`
            : ''
        }
      </div>
    </body>
  </html>
`;
};
