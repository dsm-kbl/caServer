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
            url: '/user/:id',
            templateUrl: "individualUser.html",
            controller: 'viewController'
        })

        .state('admin', {
            url: '/admin',
            templateUrl: "admin.html",
            controller: 'adminController'
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

app.factory('userService', function($resource){
    //return $resource('/api/users/:id', { id: '@id' },
    return $resource('/api/users/:id', { id: '@_id' },
    //return $resource('/api/users/:id',
    {
        update:{ method: 'put' }
    });
});

app.controller('mainController', function($scope, $stateParams, userService){
         $scope.userData = userService.query();
});

app.controller('viewController', function($scope, $stateParams, userService){
         $scope.currentUser = userService.get({id : $stateParams.id});
         $scope.addCoffee = function(){
                  var coffeeNum = prompt("Number of Cups", 1);
                  if(coffeeNum < 0  || (isNaN(coffeeNum))){
                    coffeeNum = 0;
                  }
                  var amount = coffeeNum*0.25;
                    console.log(coffeeNum, amount);
                    if(coffeeNum){
                        $scope.currentUser.numOfCups  += parseInt(coffeeNum);
                        $scope.currentUser.totalNumOfCups  += parseInt(coffeeNum);
                        $scope.currentUser.currentBalance  += amount;
                        $scope.currentUser.totalMoneySpent  += amount;
                        userService.update({_id: $scope.currentUser._id}, $scope.currentUser);
                  }
                  //userService.update({id: $scope.currentUser._id}, $scope.currentUser);
          };

});

app.controller('adminController', function($scope, $stateParams, userService){
        $scope.userData = userService.query();
        $scope.edit = true;
        $scope.error = false;
        $scope.incomplete = false;

        $scope.editUser = function(resetId){
            if(resetId == 'new'){
              $scope.individualData = {firstName: "", lastName: "", email: "", numOfCups: "", currentBalance: "", totalNumOfCups: '', totalMoneySpent: ''};
              $scope.edit = true;
              $scope.incomplete = true;

            }
            else{
              $scope.edit = false;
              $scope.individualData = userService.get({id : resetId});
              console.log($stateParams);

              //userService.update({_id: $scope.currentUser._id}, $scope.currentUser);
            }

        };

        $scope.$watch('individualData.firstName',function() {$scope.test();});
        $scope.$watch('individualData.lastName',function() {$scope.test();});
        $scope.$watch('individualData.email', function() {$scope.test();});
        $scope.$watch('individualData.numOfCups', function() {$scope.test();});
        $scope.$watch('individualData.currentBalance', function() {$scope.test();});

        $scope.test = function() {
          $scope.incomplete = false;
          if ($scope.edit && (!$scope.individualData.firstName.length || !$scope.individualData.lastName.length || !$scope.individualData.email.length || !$scope.individualData.numOfCups.length || !$scope.currentBalance.length)) {
               $scope.incomplete = true;
          }
        };


        $scope.newUser = {firstName: "", lastName: "", email: "", numOfCups: "", currentBalance: "", totalNumOfCups: '', totalMoneySpent: ''};
        $scope.error_message = '';

        $scope.addUser = function(){
            $scope.newUser.firstName = $scope.individualData.firstName;
            $scope.newUser.lastName = $scope.individualData.lastName;
            $scope.newUser.email = $scope.individualData.email;
            $scope.newUser.numOfCups = $scope.individualData.numOfCups;
            $scope.newUser.currentBalance = $scope.individualData.currentBalance;
            $scope.newUser.totalNumOfCups = $scope.individualData.numOfCups;
            $scope.newUser.totalMoneySpent = $scope.individualData.currentBalance;
            userService.save($scope.newUser, function(){
                $scope.userData = userService.query();
                $scope.newUser = {firstName: "", lastName: "", email: "", numOfCups: "", currentBalance: "", totalNumOfCups: '', totalMoneySpent: ''};
            });
        };




            //$scope.error_message = "Add request for " + $scope.user.firstName;
});