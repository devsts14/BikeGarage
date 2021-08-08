const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    active: { type: Boolean,default: false },

    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true, select: false },

    profilePicUrl: { type: String },

    unreadNotification: { type: Boolean, default: false },

    role: { type: String, default: "user", enum: ["user", "root"] },

    temporaryToken: {type:String},

    resetToken: { type: String },

    expireToken: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
