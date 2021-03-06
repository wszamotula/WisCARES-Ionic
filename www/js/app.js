// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js 

var resource = '';
var searchQuery = '';
angular.module('wiscares', ['ionic', 'ngCordova', 'wiscares.controllers',
  'wiscares.services', 'ngResource', 'loginCtrl', 'localstorage', 'ui.router', 'Devise'])

.run(function ($ionicPlatform, $rootScope, $timeout) {
  //CHANG PUT NOTIFICATION CODE HERE
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default  e accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
        /*window.plugin.notification.local.onadd = function (id, state, json) {
            var notification = {
                id: id,
                state: state,
                json: json
            };
            $timeout(function () {
                $rootScope.$broadcast("$cordovaLocalNotification:added", notification);
            });
        };*/
    });
})

.config(function ($stateProvider, $urlRouterProvider, $httpProvider, AuthProvider) {
    $httpProvider.defaults.withCredentials = true;
    AuthProvider.loginPath("http://vast-bastion-6115.herokuapp.com/users/sign_in.json");
    AuthProvider.loginMethod("POST");
    AuthProvider.registerPath("http://vast-bastion-6115.herokuapp.com/users.json");
    AuthProvider.registerMethod("POST");
    
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // Each tab has its own nav history stack:

    .state('home', {
        url: '/home',
        templateUrl: 'templates/tab-home.html',
        controller: 'AppCtrl'
        //controller: 'loginctrl'
    })

    .state('mission', {
        url: '/mission',
        templateUrl: 'templates/mission.html',
        controller: 'DashCtrl'
    })

    .state('vets', {
        url: '/vets',
        templateUrl: 'templates/vets.html',
        controller: 'VetsCtrl',
        cache: false
    })

    .state('vet-add', {
        url: '/vets/vet-add',
        templateUrl: 'templates/vet-add.html',
        controller: 'VetAddCtrl'
      })

      .state('vet-edit', {
        url: '/vets/:id/edit',
        templateUrl: 'templates/vet-edit.html',
        controller: 'VetEditCtrl'
      })

    .state('vet-detail', {
        url: '/vets/:id',
        templateUrl: 'templates/vet-detail.html',
        controller: 'VetDetailCtrl',
        cache: false
      })

    .state('pets', {
        url: '/pets',
        templateUrl: 'templates/tab-pets.html',
        controller: 'PetsCtrl',
        cache: false
    })

    .state('pet-add', {
          url: '/pets/pet-add',
          templateUrl: 'templates/pet-add.html',
          controller: 'PetAddCtrl'
      })  
      .state('pet-edit', {
          url: '/pets/:id/edit',
          templateUrl: 'templates/pet-edit.html',
          controller: 'PetEditCtrl'
      })

      .state('pet-detail', {
          url: '/pets/:petId',
          templateUrl: 'templates/pet-detail.html',
          controller: 'PetDetailCtrl',
          cache: false
      })
      .state('add-event', {
        url: 'pets/:id/:petName/addEvent',
        templateUrl: 'templates/event.html',
        controller: 'EventCtrl'
      })
      .state('add-medication', {
        url: 'pets/:id/addEvent/medication',
        templateUrl: 'templates/med-add.html',
        controller: 'MedCtrl'
      })
      .state('add-visit', {
        url: 'pets/:id/addEvent/visit',
        templateUrl: 'templates/visit-add.html',
        controller: 'VisitCtrl'
      })
      .state('add-healthproblem', {
        url: 'pets/:id/addEvent/healthproblem',
        templateUrl: 'templates/hp-add.html',
        controller: 'HealthProbCtrl'
      })
      .state('add-vaccination', {
        url: 'pets/:id/addEvent/vaccination',
        templateUrl: 'templates/vac-add.html',
        controller: 'VacCtrl'
      })

    .state('account', {
        url: '/account',
        templateUrl: 'templates/tab-account.html',
        //controller: 'AccountCtrl'
        //controller: 'AppCtrl'
    })

    .state('options', {
        url: '/options',
        templateUrl: 'templates/options.html',
        controller: 'OptionsCtrl'
    })

    .state('reminders', {
        url: '/reminders',
        templateUrl: 'templates/reminder.html',
        controller: 'Reminders'
    })

    .state('resources', {
        url: '/resources',
        templateUrl: 'templates/resources.html',
        controller: 'Resources'
    })
    .state('map-vet', {
        url: '/map-vet',
        templateUrl: 'templates/map-vet.html',
        controller: 'MapVet'
    })
    .state('map-supplies', {
        url: '/map-supplies',
        templateUrl: 'templates/map-supplies.html',
        controller: 'MapSupplies'
    })
    .state('map-search', {
        url: '/map-search',
        templateUrl: 'templates/map-search.html',
        controller: 'MapSearch'
    })
    

    

      // .state('login', {
      //     url: '/login',
      //     abstract: true,
      //     templateUrl: "templates/login.html",
      //     controller: 'AppCtrl'
      // });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');

})

// Cotroller for mission
.controller('MediaCtrl', function($scope, $ionicModal) {
 $scope.allImages = [{
 'src' : 'img/WisCares.png'}, {
 'src' : 'img/venn.jpg'} , {
 'src' : 'img/helpinghand.jpg' 
 }];
 
 $scope.showImages = function(index) {
 $scope.activeSlide = index;
 $scope.showModal('templates/image-popover.html');
 }
 
 $scope.showModal = function(templateUrl) {
 $ionicModal.fromTemplateUrl(templateUrl, {
 scope: $scope,
 animation: 'slide-in-up'
 }).then(function(modal) {
 $scope.modal = modal;
 $scope.modal.show();
 });
 }
 
 // Close the modal
 $scope.closeModal = function() {
 $scope.modal.hide();
 $scope.modal.remove()
 };
})
//End Controller for mission

  // Disable BACK button on home
  /*$ionicPlatform.registerBackButtonAction(function (event) {
    if($state.current.name=="home"){
      navigator.app.exitApp();
    }
    else {
      navigator.app.backHistory();
    }
  }, 100);*/



