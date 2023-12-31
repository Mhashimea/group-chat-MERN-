import mongoose from "mongoose";
import GroupMembers from "../../database/entities/GroupMembers";
import Messages from "../../database/entities/Messages";
import SocketConnection from "./message.socket";
import ApiError from "../../middlewares/api-error";
import httpStatus from "http-status";

const socket = new SocketConnection();
export default class MessageService {
  /**
   * Send message to group
   * @param params
   * @param userId
   * @returns
   */
  public async createMessage(params: any, userId: string) {
    const { group_id, message, message_type } = params;

    if (!group_id || !message || !message_type) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid params");
    }

    // check that user is belongs to this group
    const group = await GroupMembers.findOne({
      group_id,
      user_id: userId,
    }).lean();
    if (!group) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You are not belongs to this group"
      );
    }

    // save message to db
    const payload = { group_id, message, message_type, sender_id: userId };
    const messageObj = await Messages.create(payload);

    // get the message and assosiated user data
    const messageDetails = await this.getMessageById(messageObj._id);

    // broadcast message to group
    socket.sendMessageToGroup(group_id, messageDetails[0] || {});
    return messageObj;
  }

  /**
   * List of the messages of group
   * @param params  {MessageListParams}
   * @param userId
   */
  public async list(params: any, userId: string) {
    const { group_id, page = 1, limit = 10 } = params;

    const skip = (page - 1) * Number(limit);

    if (!group_id) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid params");

    // check that user is belongs to this group
    const group = await GroupMembers.findOne({
      group_id,
      user_id: userId,
    }).lean();
    if (!group) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You are not belongs to this group"
      );
    }

    // get the data from messages  group it by date
    const messages = await Messages.aggregate([
      {
        $match: { group_id: new mongoose.Types.ObjectId(group_id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender_id",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          messages: { $push: "$$ROOT" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date, ascending
      { $skip: skip }, // Pagination: skip records
      { $limit: Number(limit) }, // Pagination: limit records per page
    ]);

    return { messages };
  }

  /**
   * Get message by id associated with userid
   * @param messageId
   */
  public async getMessageById(messageId: any) {
    const message = await Messages.aggregate([
      { $match: { _id: messageId } },
      {
        $lookup: {
          from: "users",
          localField: "sender_id",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },
    ]);

    return message;
  }
}
