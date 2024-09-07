/*  id string pk
  username string
  email string
  fullName string
  avatar string
  coverImage string
  watchHistory ObjectId[] videos
  password string
  refreshToken string
  createdAt Date
  updatedAt Date*/

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: {
         type: String,
          ref: "Video"
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async (next) =>  {

  if(!this.modified("password")) return next()

  this.password = bcrypt.hash(this.password, 10)

  next();
})

userSchema.methods.isPasswordCorrect = async (password) => {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async () => {
  // short lived access token

  jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    fullname:this.fullname
  },
   process.env.REFRESH_TOKEN_SECRED,
  { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
}
userSchema.methods.generateRefreshToken = async () => {
  // short lived access token

  jwt.sign({
    _id: this._id,

  },
   process.env.ACCESS_TOKEN_SECRED,
  { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
}



// userSchema.plugin(mongooseAggregatePaginate);

export const User = mongoose.model("User", userSchema);
