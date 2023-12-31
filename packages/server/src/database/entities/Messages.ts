import { mongooseFunc, schemaModel } from "../index";

const schema = schemaModel();
const mongoose = mongooseFunc();

const messageSchema = new schema({
  group_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  message_type: {
    type: String,
    required: true,
  },
  sender_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Messages", messageSchema);
