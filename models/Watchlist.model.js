const { Schema, model } = require('mongoose');

const watchlistSchema = new Schema({
    watchCoinName : {
        type: String,
        required: true,
    },

    watchCoinId : {
        type:String,
        required: true,
    },
    watchAddedBy: {
        type: String,
      },
      watchPriceWhenAdded: {
        type: Number,
      },
      watchImage: {
        type: String,
      },
});


const Watchlist = model("Watchlist", watchlistSchema);

module.exports = Watchlist;