require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI).catch(err => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
});
const userSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    name: String,
    password: String,
});

module.exports = mongoose.model("user", userSchema);
