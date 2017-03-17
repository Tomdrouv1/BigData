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
    var query = Tweet.find();

    query.exec(function (error, tweets) {
        if (error) {
            console.log(error);
        } else {
            res.send(tweets);
        }
    });
});

router.get('/retweets', function(req, res) {
    var query = Tweet.find().sort([['retweet_count', 'descending']]).limit(20);

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

    var params = {
        q: 'Emma Watson exclude:replies exclude:retweets',
        count: 100,
        since_id: ''
    };

    var getTweets = function(params) {
        var tweets = [];

        // request data
        twitter.get(TWEETS_SEARCH_URL, params, function (err, data, resp) {

            if (err) {
                console.log(err);
            }
            tweets = data;

            var len = tweets.statuses.length;

            //console.log(tweets);
            params.since_id = tweets.search_metadata.max_id;
            console.log(params);

            for (var j = 0; j < len; j++) {

                var tweetMongo = new Tweet(tweets.statuses[j]);
                tweetMongo.save(function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    };

    var schedule = require('node-schedule');
    var j = schedule.scheduleJob('*/1 * * * *', function(){
        getTweets(params);
        console.info('cron job completed');
    });
});

module.exports = router;
