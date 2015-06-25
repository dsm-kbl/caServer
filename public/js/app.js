var app = angular.module('coffeeApp', ['ngRoute', 'ngResource']);

app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })

        .when('/user', {
            templateUrl: 'individualUser.html',
            controller: 'mainController'
        })

        .when('/admin', {
            templateUrl: 'admin.html',
            controller: 'addController'
        });
});

/*app.factory('userService', function($resource){
    return $resource('/api/users/');
});

app.factory('indUserService', function($resource){
    return  $resource('/api/users/:id', {id: '@_id'});
});

app.controller('mainController', function($scope, userService, indUserService){

         $scope.userData = userService.query();
         //console.log($scope.userData);

         $scope.individualUser = function($event, user){
            $scope.individualData = indUserService.query();
            console.log("individual data " + $scope.individualData);
         };
});*/

/*app.factory('api', ['$resource',
 function($resource) {
  return {
    userService: $resource('/api/users/:id'),
    indUserService:  $resource('/api/users/:id', {id: '@_id'})
  };
}]);*/

app.factory('userService', function($resource){
    return $resource('/api/users/:id');
});

app.controller('mainController', function($scope, userService){
         $scope.userData = userService.query();
         //console.log($scope.userData);
         $scope.getIndividualUser = function(userID){
            $scope.currentUser = userService.get({id : userID});
            console.log($scope.currentUser);
         };
});

app.controller('addController', function($scope, userService){
        $scope.userData = userService.query();
        $scope.newUser = {firstName: "", lastName: "", email: "", numOfCups: "", balance: "", totalNumOfCups: '', totalMoneySpent: ''};
        $scope.error_message = '';

         /*$scope.userData = [
            {username: "Johannes Folger", lastName: "Folger", firstName:"Johannes", numOfCups: 2, balance: 0.50},
            {username: "John Doe", lastName: "Doe", firstName:"John", numOfCups: 3, balance: 0.75}
        ];*/

        $scope.addUser = function(){
            $scope.newUser.totalNumOfCups = $scope.userData.numOfCups;
            $scope.newUser.totalMoneySpent = $scope.userData.balance;
            userService.save($scope.newUser, function(){
                $scope.userData = userService.query();
                $scope.newUser = {firstName: "", lastName: "", email: "", numOfCups: "", balance: "", totalNumOfCups: '', totalMoneySpent: ''};
            });
        };


            //$scope.error_message = "Add request for " + $scope.user.firstName;
});