// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js 
angular.module('wiscares', ['ionic', 'wiscares.controllers', 'wiscares.services',
 'ngResource', 'loginCtrl', 'localstorage', 'ui.router', 'Devise'])

.run(function ($ionicPlatform) {
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
    });
})

.config(function ($stateProvider, $urlRouterProvider, $httpProvider, AuthProvider) {
    $httpProvider.defaults.withCredentials = true;
    AuthProvider.loginPath("http://vast-bastion-6115.herokuapp.com/users/sign_in.json");
    AuthProvider.loginMethod("POST");
    
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
        controller: 'VetsCtrl'
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
        controller: 'VetDetailCtrl'
      })

    .state('pets', {
        url: '/pets',
        templateUrl: 'templates/tab-pets.html',
        controller: 'PetsCtrl'
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
          controller: 'PetDetailCtrl'
      })

    .state('account', {
        url: '/account',
        templateUrl: 'templates/tab-account.html',
        //controller: 'AccountCtrl'
        //controller: 'AppCtrl'
    })


      // .state('login', {
      //     url: '/login',
      //     abstract: true,
      //     templateUrl: "templates/login.html",
      //     controller: 'AppCtrl'
      // });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');

});



