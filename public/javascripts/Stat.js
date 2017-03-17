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
        var found = arr.some(function (el) {
            // var current = moment(el.created_at);
            return el.label == date;
        });
        if (found) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].label === date.toString()) {
                    arr[i].count++;
                }
            }
        }
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
            var now = moment('2017-03-16');
            var hours = [
                {
                    label: '00',
                    count: 0
                }, {
                    label: '01',
                    count: 0
                }, {
                    label: '02',
                    count: 0
                }, {
                    label: '03',
                    count: 0
                }, {
                    label: '04',
                    count: 0
                }, {
                    label: '05',
                    count: 0
                }, {
                    label: '06',
                    count: 0
                }, {
                    label: '07',
                    count: 0
                }, {
                    label: '08',
                    count: 0
                }, {
                    label: '09',
                    count: 0
                }, {
                    label: '10',
                    count: 0
                }, {
                    label: '11',
                    count: 0
                }, {
                    label: '12',
                    count: 0
                }, {
                    label: '13',
                    count: 0
                }, {
                    label: '14',
                    count: 0
                }, {
                    label: '15',
                    count: 0
                }, {
                    label: '16',
                    count: 0
                }, {
                    label: '17',
                    count: 0
                }, {
                    label: '18',
                    count: 0
                }, {
                    label: '19',
                    count: 0
                }, {
                    label: '20',
                    count: 0
                }, {
                    label: '21',
                    count: 0
                }, {
                    label: '22',
                    count: 0
                }, {
                    label: '23',
                    count: 0
                }
             ]
            ;
            angular.forEach(res, function(tweet) {
                var current = moment(tweet.created_at);
                if (current.isSame(now, 'day')) {
                    addDate(hours, current.hours());
                }
            });
            console.log(hours);
            var labels = [];
            var data = [];
            for (var i = 0; i < hours.length; i++) {
                labels.push(hours[i]['label']);
                data.push(hours[i]['count']);
            }

            $scope.hoursData = [data];
            $scope.hoursLabels = labels;

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