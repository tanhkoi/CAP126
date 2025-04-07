let mongoose = require("mongoose");
let menuSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("menu", menuSchema);
