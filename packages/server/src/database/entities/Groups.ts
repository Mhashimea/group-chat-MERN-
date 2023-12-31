import { mongooseFunc, schemaModel } from "../index";

const schema = schemaModel();
const mongoose = mongooseFunc();

const groupSchema = new schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  admin_user_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  last_message_id: {
    type: mongoose.Schema.ObjectId,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Groups", groupSchema);
