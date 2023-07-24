import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { MeetingService } from '../services/meeting.service';
import { CreateMeetingDto, CreatedMeetingDto } from '../dto/create-meeting.dto';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { GetMeetingDto } from '../dto/get-meeting.dto';
import { UpdateMeetingDto } from '../dto/update-meeting.dto';
import { DeleteMeetingDto } from '../dto/delete-meeting.dto';

@ApiTags('meeting')
@ApiProduces('application/json')
@Controller('meeting')
@UsePipes(ZodValidationPipe)
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CreatedMeetingDto,
    description: 'Meeting Created Successfully',
  })
  @Post()
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingService.create(createMeetingDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: GetMeetingDto,
    description: 'The following meeting was found. (Empty if none found)',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.meetingService.get(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMeetingdto: UpdateMeetingDto,
  ) {
    return this.meetingService.update(id, updateMeetingdto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Meeting Cancelled Successfully' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() deleteMeetingDto: DeleteMeetingDto,
  ) {
    return this.meetingService.remove(id, deleteMeetingDto);
  }
}
