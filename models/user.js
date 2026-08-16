require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);
const userSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    name: String,
    password: String,
});

module.exports = mongoose.model("user", userSchema);
