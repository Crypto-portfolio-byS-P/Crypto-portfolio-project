const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
    coinName : {
        type: String,
        required: true,
    },

    coinId : {
        type:String,
        required: true,
    },
    createdAt : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Watchlist", WatchlistSchema);