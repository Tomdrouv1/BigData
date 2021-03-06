var mongoose = require('mongoose');

var schema = mongoose.Schema({
    coordinates: Object,
    favorited: Boolean,
    truncated: Boolean,
    created_at: Date,
    id_str: {
        type: String,
        required: true,
        index: {unique: true}
    },
    in_reply_to_user_id_str: String,
    contributors: Array,
    text: String,
    metadata: {
        iso_language_code: String,
        result_type: String
    },
    retweet_count: Number,
    in_reply_to_status_id_str: String,
    geo: String,
    retweeted: Boolean,
    in_reply_to_user_id: String,
    place: Object,
    user: Object,
    in_reply_to_screen_name: String,
    source: String,
    in_reply_to_status_id: String
});

module.exports = mongoose.model("Tweet", schema);