// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js 
angular.module('wiscares', ['ionic', 'wiscares.controllers', 'wiscares.services',
 'ngResource', 'loginCtrl', 'localstorage'])

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

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider


    // setup an abstract state for the tabs directive
      .state('tab', {
          url: '/tab',
          abstract: true,
          templateUrl: 'templates/tabs.html'
          //controller: 'loginctrl'
      })

    // Each tab has its own nav history stack:

    .state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-home.html',
                controller: 'AppCtrl'
                //controller: 'loginctrl'
            }
        }
    })
    .state('vets', {
        url: '/vets',
        templateUrl: 'templates/vets.html',
        controller: 'VetsCtrl'
    })
    .state('tab.pets', {
        url: '/pets',
        views: {
            'tab-pets': {
                templateUrl: 'templates/tab-pets.html',
                controller: 'PetsCtrl'
            }
        }
    })
      .state('tab.pet-add', {
          url: '/pets/pet-add',
          views: {
              'tab-pets': {
                  templateUrl: 'templates/pet-add.html',
                  controller: 'PetAddCtrl'
              }
          }
      })  

      .state('tab.pet-edit', {
        url: '/pets/:id/edit',
        views: {
            'tab-pets': {
                templateUrl: 'templates/pet-edit.html',
                controller: 'PetEditCtrl'
            }
          }
      })

      .state('tab.pet-detail', {
          url: '/pets/:petId',
          views: {
              'tab-pets': {
                  templateUrl: 'templates/pet-detail.html',
                  controller: 'PetDetailCtrl'
              }
          }
      })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                //controller: 'AccountCtrl'
                //controller: 'AppCtrl'
            }
        }
    })
      // .state('login', {
      //     url: '/login',
      //     abstract: true,
      //     templateUrl: "templates/login.html",
      //     controller: 'AppCtrl'
      // });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/home');

});



