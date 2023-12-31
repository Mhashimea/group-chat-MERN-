export interface GroupListI {
  name: string;
  admin_user_id: string;
  last_message_id: string;
  avatar: string;
  last_message: string;
}
export interface GroupCreatePayload {
  name: string;
  admin_user_id: string;
}

export interface GroupReqPayload {
  name: string;
  userIds: string[];
}
