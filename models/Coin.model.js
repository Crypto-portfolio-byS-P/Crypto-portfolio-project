const { Schema, model } = require("mongoose");

const coinSchema = new Schema(
  {
    name: {
      type: String,
    },
    owned: {
      type: Number,
    },
    currentPrice: {
      type: Number,
    },
    personalValue: {
    type: Number,
    default: function() {
      return this.owned * this.currentPrice
    }
  },
    
  }
);

const Coin = model("Coin", coinSchema);

module.exports = Coin;
