const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please enter your name!"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      unique: true,
      lowercase: true,
    },

    phone: String,
    profileImage: String,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

    password: {
      type: String,
      required: [true, "Please enter your password!"],
      minlength: [6, "Your password must be longer than 6 characters!"],
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hash password
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
