const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'super_admin'], default: 'user' },
    resetLink: { data: String },
    biography: { type: String },
    bookmarkedPosts: [{ type: ObjectId, ref: 'Post' }],
    likedPosts: [{ type: ObjectId, ref: 'Post' }],
    avatar: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.virtual('avatarUrl').get(function () {
  if (!this.avatar) return null;

  // If it's already a full URL (Cloudinary), return as is
  if (this.avatar.startsWith('http')) {
    return this.avatar;
  }

  // Otherwise, it's a local path
  return `${process.env.SERVER_URL}/${this.avatar}`;
});

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.avatarUrl = this.avatarUrl;
  delete obj.password;
  return obj;
};

module.exports = {
  UserModel: mongoose.model('User', UserSchema),
};
