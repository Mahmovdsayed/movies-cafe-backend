import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      unique: true,
      maxlength: 20,
      tirm: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      tirm: true,
      lowercase: true,
    },
    secondName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      tirm: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      tirm: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    age: {
      type: Number,
      min: 10,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    banner:{
      type: String,
      default:"#d9d9d9"
    },
    image:{
      type: String,
      default:"https://res.cloudinary.com/dxvpvtcbg/image/upload/v1713493679/sqlpxs561zd9oretxkki.jpg"
    },    
    verifed: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
