var app = angular.module('Twitter', ['ngResource', 'ngSanitize', 'chart.js', 'angularMoment']);

app.controller('Stat', function($scope, $resource, $timeout) {

    function add(arr, lang) {
        var found = arr.some(function (el) {
            return el.code === lang;
        });
        if (!found) {
            arr.push({code: lang, count: 1});
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].code === lang) {
                    arr[i].count++;
                }
            }
        }
    }

    function addDate(arr, date) {
        // console.log(date);
        var found = arr.some(function (el) {
            var current = moment(el.created_at);
            console.log('dd');
            return moment(el.created_at) === date;
        });
        // if (!found) {
        //     arr.push({date: date, count: 1});
        // } else {
        //     for (var i = 0; i < arr.length; i++) {
        //         if (arr[i].date === date) {
        //             arr[i].count++;
        //         }
        //     }
        // }
    }

    function getStat () {
        $scope.tweets = $resource('/tweets/stat');
        $scope.tweets.query( { }, function (res) {
            var languages = [];
            angular.forEach(res, function(tweet) {
               var tweetLang = tweet.metadata.iso_language_code;
               add(languages, tweetLang);
            });

            var labels = [];
            var data = [];
            for (var i = 0; i < languages.length; i++) {
               labels.push(languages[i]['code']);
               data.push(languages[i]['count']);
            }

            $scope.data = data;
            $scope.labels = labels;

        });
    }

    function getStatByHour () {
        $scope.tweets = $resource('/tweets/stat');

        $scope.tweets.query( { }, function (res) {
            var tweets = [];
            var now = moment();
            angular.forEach(res, function(tweet) {
                var tweetDate = tweet.created_at;
                console.log(moment(tweetDate).minutes());
                addDate(tweets, now);
            });
            // console.log(tweets);
            var labels = [];
            var data = [];
            // for (var i = 0; i < languages.length; i++) {
            //     labels.push(languages[i]['code']);
            //     data.push(languages[i]['count']);
            // }
            //
            // $scope.data = data;
            // $scope.labels = labels;

        });
    }

    function getRetweets () {
        $scope.retweets = $resource('/tweets/retweets');
        $scope.retweets.query({}, function (res) {
            $scope.retweetsResult = res;
            var retweetLabels = [];
            var retweetData = [];
            angular.forEach(res, function (retweet) {
                retweetLabels.push(retweet.user.screen_name);
                retweetData.push(retweet.retweet_count);
            });

            $scope.retweetData = [retweetData];
            $scope.retweetLabels = retweetLabels;
        });
    }

    $scope.getImport = function() {
        $resource('/tweets/import').query( {}, function(err,res) {
            if(err) {
                console.log(err);
            }
        });
    };

    getStat();
    getRetweets();
    getStatByHour();

});