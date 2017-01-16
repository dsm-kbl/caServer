var app = angular.module('coffeeApp', ['ui.router', 'ngResource', 'ngFileUpload']);
//var upload = require("../routes/upload");

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
});

/*var fileName = "";

app.directive("fdInput", [function(){
      return{
        link: function(scope, element, attrs){
          element.on('change', function(evt){
              var files = evt.target.files;
              fileName = files[0].name;
              console.log(files[0].name);
              console.log(files[0].size);
          });
        }
      }
  }]);*/

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

app.controller('adminController', function($scope, $resource, $stateParams, userService, Upload, $timeout){
        $scope.userData = userService.query();
        $scope.edit = true;
        $scope.error = false;
        $scope.incomplete = false;


        $scope.editUser = function(resetId){
            if(resetId == 'new'){
              $scope.edit = true;
              $scope.incomplete = true;
              $scope.individualData = {firstName: "", lastName: "", email: "", numOfCups: "", currentBalance: "", totalNumOfCups: '', totalMoneySpent: '', picfile: ''};
            }
            else{
              $scope.edit = false;
              $scope.individualData = userService.get({id : resetId});
              console.log($stateParams);
            }
        };

        /*$scope.$watch('individualData.firstName',function() {$scope.test();});
        $scope.$watch('individualData.lastName',function() {$scope.test();});
        $scope.$watch('individualData.email', function() {$scope.test();});
        $scope.$watch('individualData.numOfCups', function() {$scope.test();});
        $scope.$watch('individualData.currentBalance', function() {$scope.test();});

        $scope.test = function() {
          $scope.incomplete = false;
          if ($scope.edit && (!individualData.firstName.length || !$scope.individualData.lastName.length || !$scope.individualData.email.length || !$scope.individualData.numOfCups.length || !$scope.currentBalance.length)) {
               $scope.incomplete = true;
          }
        };*/


        $scope.newUser = {firstName: "", lastName: "", email: "", numOfCups: "", currentBalance: "", totalNumOfCups: '', totalMoneySpent: ''};
        $scope.error_message = '';

        $scope.onFileSelect = function(file) {
          if(file){
          console.log(file);
          file.upload = Upload.upload({
            url: '/api/upload/image',
            method: 'POST',
            headers: {
              'my-header': 'my-header-value'
            },
            fields: { firstName : $scope.individualData.firstName,
                          lastName : $scope.individualData.lastName,
                          email : $scope.individualData.email,
                          numOfCups : $scope.individualData.numOfCups,
                          currentBalance : $scope.individualData.currentBalance,
                          totalNumOfCups : $scope.individualData.numOfCups,
                          totalMoneySpent : $scope.individualData.currentBalance
            },
            file: file,
            fileFormDataName: 'file'
          });

        file.upload.then(function(response){
          $timeout(function () {
              file.result = response.data;
            });
          }, function (response) {
            if (response.status > 0)
              $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
          // Math.min is to fix IE which reports 200% sometimes
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
        $scope.userData = userService.query();
        $scope.individualData = {firstName: "", lastName: "", email: "", numOfCups: "", currentBalance: "", totalNumOfCups: '', totalMoneySpent: '', picfile: ""};
      }
      else{
            $scope.newUser.lastName = $scope.individualData.lastName;
            $scope.newUser.email = $scope.individualData.email;
            $scope.newUser.numOfCups = $scope.individualData.numOfCups;
            $scope.newUser.currentBalance = $scope.individualData.currentBalance;
            $scope.newUser.totalNumOfCups = $scope.individualData.numOfCups;
            $scope.newUser.totalMoneySpent = $scope.individualData.currentBalance;
            $scope.newUser.photo = "/img/photo-placeholder.png";
      }
      };





       /*$scope.onFileSelect = function(image) {
          $scope.uploadInProgress = true;
          $scope.uploadProgress = 0;

          if (angular.isArray(image)) {
            image = image[0];
          }

          $scope.upload = Upload.upload({
            url: '/upload/image',
            method: 'POST',
            data: {
              type: 'profile'
            },
            file: image
          }).progress(function(event) {
            $scope.uploadProgress = Math.floor(event.loaded / event.total);
            $scope.$apply();
          }).success(function(data, status, headers, config) {
                  $scope.uploadInProgress = false;
                  // If you need uploaded file immediately
                  $scope.uploadedImage = JSON.parse(data);
          }).error(function(err) {
            $scope.uploadInProgress = false;
            console.log('Error uploading file: ' + err.message || err);
          });
        };*/

       /*$scope.onFileSelect = function(image){
            console.log(image);
            if (angular.isArray(image)) {
                  image = image[0];
              }

              // This is how I handle file types in client side
              if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
                  alert('Only PNG and JPEG are accepted.');
                  return;
              }

              $scope.uploadInProgress = true;
              $scope.uploadProgress = 0;

              $scope.upload = $upload.upload({
                  url: '/upload/image',
                  method: 'POST',
                  file: image
              }).progress(function(event) {
                  $scope.uploadProgress = Math.floor(event.loaded / event.total);
                  $scope.$apply();
              }).success(function(data, status, headers, config) {
                  $scope.uploadInProgress = false;
                  // If you need uploaded file immediately
                  $scope.uploadedImage = JSON.parse(data);
              }).error(function(err) {
                  $scope.uploadInProgress = false;
                  console.log('Error uploading file: ' + err.message || err);
              });
        };*/


        $scope.addUser = function(){

            //$scope.onFileSelect();




        /*$scope.addUser = function(file){
            file.upload = Upload.upload({
              url: 'api/users',
              method: 'POST',
              headers: {
                    'my-header': 'my-header-value'
              },
              fields: {firstname: $scope.individualData.firstName,
                          lastName: $scope.individualData.lastName,
                          email : $scope.individualData.email,
                          numOfCups : $scope.individualData.numOfCups,
                          currentBalance : $scope.individualData.currentBalance,
                          totalNumOfCups : $scope.individualData.numOfCups,
                          totalMoneySpent : $scope.individualData.currentBalance
              },
              file: file,
              fileFormDataName: 'myFile'
        });

            if(file.type !== 'image/png' && file.type !== 'image/jpeg'){
              alert('Only PNG and JPEG are accepted');
              return;
            }

            file.upload.then(function(response){
              $timeout(function(){
                file.result = response.data;
              });
            }, function(response){
              if(response.status > 0)
                  $scope.errorMsg = response.status + ': ' + response.data;
            });

            file.upload.progress(function(evt){
              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });*/



            /*$scope.newUser.firstName = $scope.individualData.firstName;
            $scope.newUser.lastName = $scope.individualData.lastName;
            $scope.newUser.email = $scope.individualData.email;
            $scope.newUser.numOfCups = $scope.individualData.numOfCups;
            $scope.newUser.currentBalance = $scope.individualData.currentBalance;
            $scope.newUser.totalNumOfCups = $scope.individualData.numOfCups;
            $scope.newUser.totalMoneySpent = $scope.individualData.currentBalance;
            $scope.newUser.photo = fileName;
            console.log($scope.newUser);
            userService.save($scope.newUser, function(){
                $scope.userData = userService.query();
                $scope.newUser = {firstName: "", lastName: "", email: "", numOfCups: "", currentBalance: "", totalNumOfCups: '', totalMoneySpent: '', photo: ""};
                $scope.individualData = {firstName: "", lastName: "", email: "", numOfCups: "", currentBalance: "", totalNumOfCups: '', totalMoneySpent: '', photo: ""};
                //$scope.newUser = {firstName: "", lastName: "", email: "", numOfCups: "", currentBalance: "", totalNumOfCups: '', totalMoneySpent: ''};
            });*/
        };

        $scope.deleteUser = function(deleteId){
            if(window.confirm('Really delete this user?')){

              userService.delete({ id: deleteId });
              $scope.userData = userService.query();
            }
            else{
              $scope.userData = userService.query();
            }
        };
        //$scope.error_message = "Add request for " + $scope.user.firstName;
});