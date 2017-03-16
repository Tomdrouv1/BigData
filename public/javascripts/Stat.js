var app = angular.module('Twitter', ['ngResource', 'ngSanitize']);

app.controller('Stat', function($scope, $resource, $timeout) {

    function getStat () {
        $scope.tweets = $resource('/tweets/stat');
        console.log('Query ok front stat');

        $scope.tweets.query( { }, function (res) {
            console.log(res.length);
            $scope.tweetsResult = res;
        });
    }

    $scope.getImport = function() {
        console.log('GetImport ok');
        $resource('/tweets/import').query( {}, function(err,res) {
            if(err) {
                console.log(err);
            }
        });
    };

    getStat();
});