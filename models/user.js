const mongoose = require("mongoose");
const { Schema } = mongoose;
// using Passport for authentication  (see npm passport-local-mongoose Documentation)
// passport-local-mongoose will automatically defines username and password in the userSchema

const passportLocalMongoose =
  require("passport-local-mongoose").default ||
  require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
});

// plugins add fields (like username, hash, and salt) and helper methods directly onto the Schema
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
