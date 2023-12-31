export interface chatModel {
  senderId: number;
  roomId: number;
  message: string;
}

export interface MessageListParams {
  groupId: string;
  page: number;
  limit: number;
}
