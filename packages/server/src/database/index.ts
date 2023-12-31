import mongoose from "mongoose";

export const connectDB = async (url: string) => {
  mongoose
    .connect(url)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
};

export const schemaModel = () => mongoose.Schema;

export const mongooseFunc = () => mongoose;
