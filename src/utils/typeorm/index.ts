import { User } from './entities/User';
import { Conversation } from './entities/Conversation';
import { Message } from './entities/Message';
import { Group } from './entities/Group';
import { GroupMessage } from './entities/GroupMessage';
import { FriendRequest } from './entities/FriendRequest';
import { Friend } from './entities/Friend';
import { Profile } from './entities/Profile';
import { MessageAttachment } from './entities/MessageAttachment';
import { GroupMessageAttachment } from './entities/GroupMessageAttachment';
import { UserPresence } from './entities/UserPresence';
import { Peer } from './entities/Peer';

const entities = [
  User,

  Conversation,
  Message,
  Group,
  GroupMessage,
  FriendRequest,
  Friend,
  Profile,
  MessageAttachment,
  GroupMessageAttachment,
  UserPresence,
  Peer,
];

export default entities;

export {
  User,
  Conversation,
  Message,
  Group,
  GroupMessage,
  FriendRequest,
  Friend,
  Profile,
  MessageAttachment,
  GroupMessageAttachment,
  UserPresence,
  Peer,
};
