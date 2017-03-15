var express = require('express');
var router = express.Router();
var Twit = require('twit');
var config = require('../config');
var Tweet = require('../models/tweet');

// instantiate Twit module
var twitter = new Twit(config.twitter);

var TWEET_COUNT = 20;
var MAX_WIDTH = 305;
var OEMBED_URL = 'statuses/oembed';
var USER_TIMELINE_URL = 'statuses/user_timeline';
var TWEETS_SEARCH_URL = 'search/tweets';

/**
 * GET tweets json.
 */
router.get('/user_timeline/:user', function(req, res) {

  var oEmbedTweets = [], tweets = [],

  params = {
    screen_name: req.params.user, // the user id passed in as part of the route
    count: TWEET_COUNT // how many tweets to return
  };

  // the max_id is passed in via a query string param
  if(req.query.max_id) {
    params.max_id = req.query.max_id;
  }

  // request data
  twitter.get(USER_TIMELINE_URL, params, function (err, data, resp) {

    tweets = data;

    var i = 0, len = tweets.length;

    for(i; i < len; i++) {
      getOEmbed(tweets[i]);
    }
  });

  /**
   * requests the oEmbed html
   */
  function getOEmbed (tweet) {

    // oEmbed request params
    var params = {
      "id": tweet.id_str,
      "maxwidth": MAX_WIDTH,
      "hide_thread": true,
      "omit_script": true
    };

    // request data 
    twitter.get(OEMBED_URL, params, function (err, data, resp) {
      tweet.oEmbed = data;
      oEmbedTweets.push(tweet);

      // do we have oEmbed HTML for all Tweets?
      if (oEmbedTweets.length == tweets.length) {
        res.setHeader('Content-Type', 'application/json');
        res.send(oEmbedTweets);
      }
    });
  }
});

router.get('/search/:q', function(req, res) {
    console.log('route ok');
    var oEmbedTweets = [], tweets = [],

        params = {
            q: req.params.q, // the user id passed in as part of the route
            count: TWEET_COUNT // how many tweets to return
        };

    // the max_id is passed in via a query string param
    // if(req.query.max_id) {
    //     params.max_id = req.query.max_id;
    // }

    // request data
    twitter.get(TWEETS_SEARCH_URL, params, function (err, data, resp) {

        if(err) {
            console.log(err);
        }
        tweets = data;



        var i = 0, len = tweets.statuses.length;

        for (i; i < len; i++) {

            var tweetMongo = new Tweet(tweets.statuses[i]);
            tweetMongo.save(function(err, res) {
                if(err) {
                    console.log(err);
                }
            });
            getOEmbed(tweets.statuses[i]);
        }
    });

    function getOEmbed (tweet) {

        console.log('embed');
        // oEmbed request params
        var params = {
            "id": tweet.id_str,
            "maxwidth": MAX_WIDTH,
            "hide_thread": true,
            "omit_script": true
        };

        // request data
        twitter.get(OEMBED_URL, params, function (err, data, resp) {
            tweet.oEmbed = data;
            oEmbedTweets.push(tweet);

            // do we have oEmbed HTML for all Tweets?
            if (oEmbedTweets.length == tweets.statuses.length) {
                res.setHeader('Content-Type', 'application/json');
                res.send(oEmbedTweets);
            }
        });
    }
});

module.exports = router;
