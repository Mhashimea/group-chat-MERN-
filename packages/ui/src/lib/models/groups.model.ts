import { MessageI } from './message.model';

export interface GroupsI {
  name: string;
  admin_user_id: string;
  last_message: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage: MessageI;
  _id: string;
}
