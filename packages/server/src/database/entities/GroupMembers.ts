import { mongooseFunc, schemaModel } from "../index";

const schema = schemaModel();
const mongoose = mongooseFunc();

const groupMemebersSchema = new schema({
  group_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  status: {
    type: Boolean,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("GroupMembers", groupMemebersSchema);
