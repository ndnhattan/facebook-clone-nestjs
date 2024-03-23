import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InvalidConversationIdException } from './exceptions/InvalidConversationId';
import { IConversationsService } from './conversations';
import { ConversationNotFoundException } from './exceptions/ConversationNotFound';
import { Services } from 'src/utils/constants';

@Injectable()
export class ConversationsGuard implements CanActivate {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private conversationService: IConversationsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { id: userId } = req.user;
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new InvalidConversationIdException();
    const isReadable = await this.conversationService.hasAccess({ id, userId });
    console.log(isReadable);
    if (isReadable) return true;
    else throw new ConversationNotFoundException();
  }
}
