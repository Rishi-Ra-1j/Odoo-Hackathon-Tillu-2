const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
email: { type: String, required: true, unique: true, trim: true, lowercase: true },
username: { type: String, required: true, minlength: 3, maxlength: 30 },
password: { type: String, required: true, select: false },
});
userSchema.methods.toJSON = function () {
const obj = this.toObject({ virtuals: true });
delete obj.password;
delete obj.__v;
return obj;
};
const User = mongoose.model("User", userSchema);
module.exports = User;