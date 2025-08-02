import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  file: String, // base64 строка
  email: String,
  username: String
}, { timestamps: true });

export default mongoose.model('Post', PostSchema);