
import { model, Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
      default: "Time Table",
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;
