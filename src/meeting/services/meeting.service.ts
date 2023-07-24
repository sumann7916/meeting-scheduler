import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMeetingDto } from '../dto/create-meeting.dto';
import { PrismaService } from '../../common/services/prisma.service';
import { Meeting } from '@prisma/client';
import { UpdateMeetingDto } from '../dto/update-meeting.dto';
import {
  toExtendMeetingDto,
  toGetMeetingDto,
  getDayAndStartDate,
  extendCreateMeetingDto,
  toCreatedMeetingDto,
} from '../utils/meeting-common.utils';
import { UpdateMeetingOptions } from 'src/common/types/update-meeting.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MeetingEventTypes } from '../../common/types/events';
import { DeleteMeetingDto } from '../dto/delete-meeting.dto';

@Injectable()
export class MeetingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createMeetingDto: CreateMeetingDto) {
    const extendedMeetingDto = extendCreateMeetingDto(createMeetingDto);

    const { name, email, location, guests, notes, start } = extendedMeetingDto;

    const meeting = await this.prismaService.meeting.create({
      data: {
        name,
        email,
        start,
        location,
        guests: guests ?? [],
        notes,
      },
      select: {
        id: true,
        name: true,
        start: true,
        email: true,
        location: true,
        guests: true,
        notes: true,
      },
    });
    this.eventEmitter.emit(MeetingEventTypes.CREATE_MEETING, {
      ...extendedMeetingDto,
      meetingId: meeting.id,
    });

    return toCreatedMeetingDto(meeting as Meeting);
  }

  async update(id: string, updateMeetingDto: UpdateMeetingDto) {
    const meeting = await this.findOne(id);
    if (!meeting || meeting.cancelled === true) {
      throw new NotFoundException(
        `Meeting with id ${id} not found or has already been cancelled`,
      );
    }

    const data = this.buildUpdateData(updateMeetingDto);
    const updatedMeeting = await this.prismaService.meeting.update({
      where: {
        id,
      },
      data,
    });
    const extendedMeeting = toExtendMeetingDto(updatedMeeting);
    this.eventEmitter.emit(MeetingEventTypes.UPDATE_MEETING, {
      ...extendedMeeting,
      meetingId: id,
      reason: updateMeetingDto.reason,
    });
    return toGetMeetingDto(updatedMeeting)(updateMeetingDto.reason);
  }

  private buildUpdateData(
    updateMeetingDto: UpdateMeetingDto,
  ): UpdateMeetingOptions {
    const data: UpdateMeetingOptions = {};
    if (updateMeetingDto.location !== undefined) {
      data.location = updateMeetingDto.location;
    }
    const { start } = getDayAndStartDate(
      updateMeetingDto.date,
      updateMeetingDto.time,
    );
    data.start = start;
    return data;
  }

  async get(id: string) {
    const meeting = await this.findOne(id);
    //TODO FIX LATER
    return meeting ? toGetMeetingDto(meeting)(null) : null;
  }

  async remove(id: string, deleteMeetingDto: DeleteMeetingDto) {
    const meeting = await this.findOne(id);
    if (!meeting || meeting.cancelled === true) {
      throw new NotFoundException(
        `Meeting with id ${id} not found or has already been cancelled`,
      );
    }
    const extendedMeeting = toExtendMeetingDto(meeting);
    const removedMeeting = await this.prismaService.meeting.update({
      where: {
        id,
      },
      data: { cancelled: true },
    });

    this.eventEmitter.emit(MeetingEventTypes.CANCEL_MEETING, {
      ...extendedMeeting,
      meetingId: id,
      ...deleteMeetingDto,
    });

    return toGetMeetingDto(removedMeeting)(deleteMeetingDto.cancel);
  }

  async findOne(id: string): Promise<Meeting | null> {
    return ((await this.prismaService.meeting.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        start: true,
        location: true,
        notes: true,
        cancelled: true,
      },
    })) ?? null) as Meeting;
  }
}
