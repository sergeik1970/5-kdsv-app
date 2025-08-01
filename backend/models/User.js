import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;
