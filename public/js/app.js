var app = angular.module('coffeeApp', ['ui.router', 'ngResource']);

app.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: "main.html",
            controller: 'mainController'
        })

        .state('user', {
            url: '/user:id',
            templateUrl: "individualUser.html",
            controller: 'mainController'
        })

        .state('admin', {
            url: '/admin',
            templateUrl: "admin.html",
            controller: 'addController'
        });

        /*.when('/user', {
            templateUrl: 'individualUser.html',
            controller: 'mainController'
        })

        .when('/admin', {
            templateUrl: 'admin.html',
            controller: 'addController'
        });*/
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
    return $resource('/api/users/:id', { id: '@_id' }
        /*{
          update: {
              method: 'PUT'
          }
        }*/
      );
});

app.controller('mainController', function($scope, $stateParams, userService){
         $scope.userData = userService.query();
         $scope.currentUser = userService.get({id : $stateParams.id});
         $scope.addCoffee = function(){
            var coffeeNum = prompt("Number of Cups", 1);
            var amount = coffeeNum*0.25;
            console.log(coffeeNum, amount);
            $scope.query = function() {
                $stateParams.numOfCups += coffeeNum;
                $stateParams.balance += amount;
            };
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