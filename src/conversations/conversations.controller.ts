import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/utils/Guards';
import { Routes, Services } from '../utils/constants';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { IConversationsService } from './conversations';
import { CreateConversationDto } from './dtos/CreateConversation.dto';
import { ConversationsGuard } from './conversations.guard';

@SkipThrottle()
@Controller(Routes.CONVERSATIONS)
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
    private readonly events: EventEmitter2,
  ) {}
  @Get('test/endpoint/check')
  test() {
    return;
  }

  @Post()
  async createConversation(
    @AuthUser() user: User,
    @Body() createConversationPayload: CreateConversationDto,
  ) {
    console.log('createConversation');
    const conversation = await this.conversationsService.createConversation(
      user,
      createConversationPayload,
    );
    this.events.emit('conversation.create', conversation);
    return conversation;
  }

  @Get()
  async getConversations(@AuthUser() { id }: User) {
    return this.conversationsService.getConversations(id);
  }

  @Get(':id')
  @UseGuards(ConversationsGuard)
  async getConversationById(@Param('id') id: number) {
    console.log('asdfsdfds ', id);
    return this.conversationsService.findById(id);
  }
}
