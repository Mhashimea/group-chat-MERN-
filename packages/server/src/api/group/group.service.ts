import mongoose from "mongoose";
import GroupMembers from "../../database/entities/GroupMembers";
import Groups from "../../database/entities/Groups";
import MessageService from "../message/message.service";
import { UserService } from "../users/user.service";
import { GroupCreatePayload, GroupReqPayload } from "./model";
import Messages from "../../database/entities/Messages";
import SocketConnection from "../message/message.socket";
import ApiError from "../../middlewares/api-error";
import httpStatus from "http-status";

const userService = new UserService();
const messageService = new MessageService();
const socket = new SocketConnection();

export default class GroupService {
  /**
   * Create new group
   * @param params {GroupCreateModel}
   */
  public async create(params: GroupReqPayload, userId: string) {
    const { name, userIds } = params;

    const payload: GroupCreatePayload = {
      name: name,
      admin_user_id: userId,
    };

    // create new group
    const group = await Groups.create(payload);
    if (!group) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong"
      );
    }

    const groupId = group._id;

    // create new message for group that group is created
    const user = await userService.getUserById(userId);
    const message = {
      group_id: groupId,
      message: `${user?.name} created this group`,
      message_type: "system",
      sender_id: userId,
    };
    await Messages.create(message);

    // add group id to user
    const groupMembrs = [...userIds, userId];
    await this.assignUsersToGroup(groupId, groupMembrs, userId);

    return group;
  }

  /**
   * List of the groups of logged in user
   */
  public async list(userId: string) {
    const groups = await GroupMembers.aggregate([
      { $match: { user_id: userId } },
      {
        $lookup: {
          from: "groups",
          localField: "group_id",
          foreignField: "_id",
          as: "group",
        },
      },
      { $unwind: "$group" },
      {
        $lookup: {
          from: "messages",
          localField: "group_id",
          foreignField: "group_id",
          as: "message",
        },
      },
      { $unwind: "$message" },
      {
        $group: {
          _id: "$group._id",
          name: { $first: "$group.name" },
          admin_user_id: { $first: "$group.admin_user_id" },
          avatar: { $first: "$group.avatar" },
          createdAt: { $first: "$group.createdAt" },
          updatedAt: { $first: "$group.updatedAt" },
          lastMessage: { $last: "$message" },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);

    return groups;
  }

  /**
   *
   */
  public async getGroupDetails(groupId: any) {
    if (!groupId)
      throw new ApiError(httpStatus.BAD_REQUEST, "GroupId not found");

    // get the group details
    const group = await Groups.findOne({ _id: groupId }).lean();
    if (!group) throw new ApiError(httpStatus.BAD_REQUEST, "Group not found");

    const groupMembers = await this.getGroupMembers(groupId);

    return { ...group, groupMembers };
  }

  /**
   * Get the group memebers of group
   * @param groupId
   */
  public async getGroupMembers(groupId: any) {
    if (!groupId)
      throw new ApiError(httpStatus.BAD_REQUEST, "GroupId not found");

    // get the group members with user details of group id
    const groupMembers = await GroupMembers.aggregate([
      {
        $match: { group_id: new mongoose.Types.ObjectId(groupId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);

    return groupMembers;
  }

  /**
   * Assign users to group
   * @param groupId
   * @param userIds
   * @returns
   */
  public async assignUsersToGroup(
    groupId: any,
    userIds: string[],
    userId: string
  ) {
    if (!groupId || !userIds || !userIds.length) {
      return;
    }

    // check the user is already belongs to this group
    const memeber = await GroupMembers.find({
      group_id: groupId,
      user_id: { $in: userIds },
    }).lean();
    if (memeber.length) {
      throw new ApiError(
        httpStatus.UNPROCESSABLE_ENTITY,
        "User already belongs to this group"
      );
    }

    const groupMembers = userIds.map((id) => ({
      group_id: groupId,
      user_id: id,
    }));
    const response = await GroupMembers.insertMany(groupMembers);

    // create new message for group, that user added to the group
    if (response) {
      const totalMembers = userIds.filter((id) => id !== userId);
      totalMembers.forEach(async (userId) => {
        const user = await userService.getUserById(userId);
        const message = {
          group_id: groupId,
          message: `${user?.name} joined to the group`,
          message_type: "system",
        };
        await messageService.createMessage(message, userId);
      });
    }

    // broadcast to group that user added to the group
    socket.sendActionToGroup(groupId, { type: "MEMBER_ADDED" });

    return response;
  }

  /**
   * Left the group
   * @param groupId
   */
  public async leftGroup(groupId: any, userId: string) {
    if (!groupId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "GroupId not found");
    }

    // check that user is belongs to this group
    const group = await GroupMembers.findOne({
      group_id: groupId,
      user_id: userId,
    }).lean();
    if (!group) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "You are not belongs to this group"
      );
    }

    // create new message for group that user left the group
    const user = await userService.getUserById(userId);
    const message = {
      group_id: groupId,
      message: `${user?.name} left the group`,
      message_type: "system",
    };
    await messageService.createMessage(message, userId);

    // delete the group member
    const response = await GroupMembers.deleteOne({ _id: group._id });

    // broadcast to group that user added to the group
    socket.sendActionToGroup(groupId, { type: "MEMBER_REMOVED" });

    return response;
  }
}
