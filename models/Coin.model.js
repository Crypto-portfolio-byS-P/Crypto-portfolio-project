const { Schema, model } = require("mongoose");

const coinSchema = new Schema({
  name: {
    type: String,
  },
  owned: {
    type: Number,
  },
  coinId: {
    type: String,
  },
  addedBy: {
    type: String,
  },
  purchasedAt: {
    type: Number,
  },
  image: {
    type: String,
  },
});

const Coin = model("Coin", coinSchema);

module.exports = Coin;
