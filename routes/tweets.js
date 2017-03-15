var express = require('express');
var router = express.Router();
var Twit = require('twit');
var config = require('../config');
var Tweet = require('../models/tweet');

// instantiate Twit module
var twitter = new Twit(config.twitter);

var TWEET_COUNT = 100;
var TWEETS_SEARCH_URL = 'search/tweets';

/**
 * GET tweets json.
 */
router.get('/stat', function(req, res) {
    var query = Tweet.find({});

    query.exec(function (error, tweets) {
        if (error) {
            console.log(error);
        } else {
            res.send(tweets);
        }
    });
});

router.get('/import', function(req, res) {
    console.log('Import');
    var tweets = [], max_id = 0;

    params = {
        q: 'Emma Watson',
        count: TWEET_COUNT,
        max_id: max_id
    };

    for(var i = 0; i < 10; i++) {

        // request data
        twitter.get(TWEETS_SEARCH_URL, params, function (err, data, resp) {

            if (err) {
                console.log(err);
            }
            tweets = data;

            var len = tweets.statuses.length;

            params.max_id = tweets.search_metadata.max_id;
            console.log(tweets.search_metadata.max_id);

            for (var j = 0; j < len; j++) {

                var tweetMongo = new Tweet(tweets.statuses[j]);
                tweetMongo.save(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }
});

module.exports = router;
