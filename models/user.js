import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 10
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  accessToken: {
    type: String,
    default: null
  }
});

export const User = mongoose.model("User", userSchema);

