angular.module('wiscares.controllers', ['ui.router', 'ngFileUpload','ngCordova'])

.controller('DashCtrl', function ($scope) {
 
})


.controller('PetsCtrl', function ($scope, Pets, Auth, $state) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    var userId = window.localStorage['userId'];

    $scope.$on('$ionicView.enter', function() {
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
        Pets.query({"userId":userId}).$promise.then(function (response) {
            console.log(window.localStorage['userId'])
            $scope.pets = response;
            $scope.petsLoaded = true;
        });
    });

})

.controller('PetDetailCtrl', function ($scope, $state, $stateParams, Pets, HealthProblems, Medications, Vaccinations, Visits, $ionicActionSheet, $ionicLoading) {

    $scope.showActionSheet = function () {
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: 'Yes' }
            ],

            titleText: 'Delete Your Pet?',
            cancelText: 'No',
            cancel: function () {
                hideSheet();
            },
            buttonClicked: function (index) {
        
                if (index == 0) {
                    $ionicLoading.show({
                        template: 'Removing Pet <div ng-hide="notloading" ><ion-spinner></ion-spinner></div>'
                    });
                    $scope.deletePet()
                } else {
                    return true;
                }
                hideSheet();
            }
        });
    };
    $scope.loadPet = function () { //Issues a GET request
        $scope.pet = Pets.get({ id: $stateParams.petId });
    };

    $scope.deletePet = function() { 
        for(var i = 0; i < $scope.medications.length; i++) {
            $scope.medications[i].$delete();
        }
        for(var i = 0; i < $scope.vaccinations.length; i++) {
            $scope.vaccinations[i].$delete();
        }
        for(var i = 0; i < $scope.healthproblems.length; i++) {
            $scope.healthproblems[i].$delete();
        }
        for(var i = 0; i < $scope.visits.length; i++) {
            $scope.visits[i].$delete();
        }
    	$scope.pet.$delete(function() {
            $ionicLoading.hide();
            $state.go('pets');
        });
  	};

    $scope.deleteMed = function(med) { 
        med.$delete(function() {
            Medications.query({"petID":$stateParams.petId}).$promise.then(function (response) {
                $scope.medications = response;
            });
        });
    };

    $scope.deleteVac = function(vac) { 
        vac.$delete(function() {
            Vaccinations.query({"petID":$stateParams.petId}).$promise.then(function (response) {
                $scope.vaccinations = response;
            });
        });
    };

    $scope.deleteHP = function(hp) { 
        hp.$delete(function() {
            HealthProblems.query({"petID":$stateParams.petId}).$promise.then(function (response) {
                $scope.healthproblems = response;
            });
        });
    };

    $scope.deleteVisit = function(visit) { 
        visit.$delete(function() {
            Visits.query({"petID":$stateParams.petId}).$promise.then(function (response) {
                $scope.visits = response;
            });
        });
    };

    $scope.showHealthProblems = true;
    $scope.showVaccinations = true;
    $scope.showMedications = true;
    $scope.showVisits = true;

    $scope.hideHpSect = true;
    $scope.hideVaccSect = true;
    $scope.hideMedSect = true;
    $scope.hideVisitSect = true;


    $scope.$on('$ionicView.enter', function() {
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
        $scope.loadPet();
        HealthProblems.query({"petID":$stateParams.petId}).$promise.then(function (response) {
            $scope.healthproblems = response;
            if ($scope.healthproblems.length != 0) { $scope.hideHpSect = false; }
        });

        Vaccinations.query({"petID":$stateParams.petId}).$promise.then(function (response) {
            $scope.vaccinations = response;
            if ($scope.vaccinations.length != 0) { $scope.hideVaccSect = false; }
        });

        Medications.query({"petID":$stateParams.petId}).$promise.then(function (response) {
            $scope.medications = response;
            if ($scope.medications.length != 0) { $scope.hideMedSect = false; }
        });

        Visits.query({"petID":$stateParams.petId}).$promise.then(function (response) {
            $scope.visits = response;
            if ($scope.visits.length != 0) { $scope.hideVisitSect = false; }
        });
    });
})

.controller('PetAddCtrl', function ($scope, $stateParams, $state, Pets, ImageUploader) {
    $scope.pet = new Pets(); 
    $scope.pet.userId = window.localStorage['userId'];

    $scope.$on('$ionicView.enter', function() {
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
    });

    $scope.addPet = function() { 
        if("imageURI" in $scope.pet) {
            console.log("Image URI Attached")
            ImageUploader.uploadImage($scope.pet)
            $state.go('pets');
        } else {
            $scope.pet.$save(function() {
                $state.go('pets');
            });
        }
    };
})

.controller('PetEditCtrl', function ($scope, $state, $stateParams, Pets, ImageUploader) {
    $scope.$on('$ionicView.enter', function() {
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
    });
  
  $scope.updatePet = function() { 

        if("imageURI" in $scope.pet) {
            console.log("Image URI Attached")
            ImageUploader.uploadImage($scope.pet)
            $state.go('pet-detail', {petId: $scope.pet.id});
        } else {
            $scope.pet.$update(function() {
                $state.go('pet-detail', {petId: $scope.pet.id});
            });
        }
  };

  $scope.loadPet = function() { 
    $scope.pet = Pets.get({ id: $stateParams.id });
  };

  $scope.loadPet(); // Load a pet which can be edited on UI
})

.controller('CameraCtrl', ['$scope', "CameraPopover", "$ionicActionSheet", function ($scope, CameraPopover, $ionicActionSheet) {
    $scope.showProgress = false;


    $scope.showActionSheet = function () {
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: 'Take Photo' },
              { text: 'Use Photo from Albums' }
            ],
            // destructiveText: 'Delete',
            titleText: 'Select photos from',
            cancelText: 'Cancel',
            cancel: function () {
                hideSheet();
            },
            buttonClicked: function (index) {
                // click "take phone"
                if (index == 0) {
                    var options = {
                        quality: 100,
                        allowEdit: true,
                        targetWidth: 500,
                        targetHeight: 225,
                        // Android doesn't recognize this.
                        // http://stackoverflow.com/questions/29392639/error-capturing-image-with-phonegap-on-android
                        // saveToPhotoAlbum: true,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        encodingType: Camera.EncodingType.JPEG,
                        destinationType: Camera.DestinationType.FILE_URI
                    };
                    CameraPopover.getPicture(options).then(function (imageURI) {
                        $scope.pet.imageURI = imageURI;
                    }, function (err) {
                        console.error(err);
                    });
                } else if (index == 1) {
                    var options = {
                        quality: 100,
                        allowEdit: true,
                        targetWidth: 500,
                        targetHeight: 225,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        encodingType: Camera.EncodingType.JPEG,
                        destinationType: Camera.DestinationType.FILE_URI
                    };
                    CameraPopover.getPicture(options).then(function (imageURI) {
                        console.log(imageURI);
                        if(imageURI.lastIndexOf('?') != -1) {
                            imageURI = imageURI.substr(0, imageURI.lastIndexOf('?'));
                        }
                        $scope.pet.imageURI = imageURI
                    }, function (err) {
                        console.error(err);
                    });
                } else {
                    return true;
                }
                hideSheet();
            }
        });
    };

}])

.controller('EventCtrl', function ($scope, $stateParams, $state) {
    $scope.$on('$ionicView.enter', function() {
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
    });
    $scope.petID = $stateParams.id
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if( dd < 10 ) { dd = '0' + dd}
    if( mm < 10 ) { mm = '0' + mm}
    today = yyyy + '/' + mm + '/' + dd;
    console.log(today);
})

.controller('MedCtrl', function ($scope, $stateParams, $state, Medications){
    $scope.$on('$ionicView.enter', function() {
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
        $scope.medication = new Medications();
        $scope.medication.petID = $stateParams.id;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if( dd < 10 ) { dd = '0' + dd}
        if( mm < 10 ) { mm = '0' + mm}
        $scope.medication.dateEntered = yyyy + '/' + mm + '/' + dd;
    });

    $scope.addMed = function() { 
        $scope.medication.$save(function() {
            $state.go('pet-detail', {petId: $scope.medication.petID});
        });
    };
})

.controller('VacCtrl', function ($scope, $stateParams, $state, Vaccinations){
    $scope.$on('$ionicView.enter', function() {    
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
        $scope.vaccination = new Vaccinations(); 
        $scope.vaccination.petID = $stateParams.id;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if( dd < 10 ) { dd = '0' + dd}
        if( mm < 10 ) { mm = '0' + mm}
        $scope.vaccination.dateEntered = yyyy + '/' + mm + '/' + dd;
    });
        $scope.addVac = function() { 
            $scope.vaccination.$save(function() {
                $state.go('pet-detail', {petId: $scope.vaccination.petID});
            });
        };
})

.controller('HealthProbCtrl', function ($scope, $stateParams, $state, HealthProblems){
    $scope.$on('$ionicView.enter', function() {  
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
        $scope.healthproblem = new HealthProblems(); 
        $scope.healthproblem.petID = $stateParams.id;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if( dd < 10 ) { dd = '0' + dd}
        if( mm < 10 ) { mm = '0' + mm}
        $scope.healthproblem.dateEntered = yyyy + '/' + mm + '/' + dd;
    });

    $scope.addHP = function() { 
        $scope.healthproblem.$save(function() {
            $state.go('pet-detail', {petId: $scope.healthproblem.petID});
        });
    };
})

.controller('VisitCtrl', function ($scope, $stateParams, $state, Visits){
    $scope.$on('$ionicView.enter', function() {
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
        $scope.visit = new Visits(); 
        $scope.visit.petID = $stateParams.id;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if( dd < 10 ) { dd = '0' + dd}
        if( mm < 10 ) { mm = '0' + mm}
        $scope.visit.dateEntered = yyyy + '/' + mm + '/' + dd;
    });

    $scope.addVisit = function() { 
        $scope.visit.$save(function() {
            $state.go('pet-detail', {petId: $scope.visit.petID});
        });
    };
})

.controller('VetsCtrl', function ($scope, Vets, $state) {
    var userID = window.localStorage['userId'];
    console.log(userID);

    $scope.deleteVet = function(vet) { 
    	vet.$delete(function() {
    		Vets.query({"userID":userID}).$promise.then(function (response) {
            	$scope.vets = response;
        	});
    	});
  	};

    Vets.query({"userID":userID}).$promise.then(function (response) {
            $scope.vets = response;
            $scope.vetsLoaded = true;
        });

    $scope.$on('$ionicView.enter', function() {
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
        Vets.query({"userID":userID}).$promise.then(function (response) {
            $scope.vets = response;
            $scope.vetsLoaded = true;
        });
    });
})

.controller('VetDetailCtrl', function ($scope, $state, $stateParams, Vets) {
    $scope.loadVet = function () { //Issues a GET request
        $scope.vet = Vets.get({ id: $stateParams.id });
    };

    $scope.$on('$ionicView.enter', function() {
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
        $scope.loadVet();
    });
})

.controller('VetAddCtrl', function ($scope, $stateParams, $state, Vets) {
    $scope.vet = new Vets();  //create new pet instance. Properties will be set via ng-model on UI
    $scope.vet.userID=window.localStorage['userId']
    $scope.$on('$ionicView.enter', function() {
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
    });
    $scope.addVet = function() { //create a new pet. Issues a POST to /api/pets
      $scope.vet.$save(function() {
      $state.go('vets');
    });
  };
})

.controller('VetEditCtrl', function ($scope, $state, $stateParams, Vets) {
  $scope.updateVet = function() { //Update the edited pet. Issues a PUT to /api/pets/:id
        $scope.vet.$update(function() {
            $state.go('vet-detail', {id: $scope.vet.id}); // on success go back to home i.e. pets state.
        });
  };

  $scope.loadVet = function() { 
    $scope.vet = Vets.get({ id: $stateParams.id });
  };

    $scope.$on('$ionicView.enter', function() {
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
    });

  $scope.loadVet(); // Load a pet which can be edited on UI
})

.controller('AccountCtrl', function ($scope, $state) {
    $scope.$on('$ionicView.enter', function() {
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
    });
    $scope.settings = {
        enableFriends: true
    };
})

.controller('Reminders', ['$scope', '$rootScope', 'Pets', 'ReminderFactory', '$ionicModal', '$timeout',
  function ($scope, $rootScope, UserSession, ReminderFactory, $ionicModal, $timeout) {

     $ionicModal.fromTemplateUrl('templates/newReminder.html', {
          scope: $scope
      }).then(function (modal) {
          $scope.modal = modal;
      });

      $scope.NewReminder = function () {
          $scope.modal.show();
      };
      
      $scope.reminders = [];

      // Trigger Load reminders
      $timeout(function () {
          $rootScope.$broadcast('load-reminders');
      }, 9); // Race Condition

      $scope.doRefresh = function () {
          $rootScope.$broadcast('load-reminders');
          $scope.$broadcast('scroll.refreshComplete');
      }

      $rootScope.createNew = function () {
          $scope.modal.show();
      }

      $ionicModal.fromTemplateUrl('templates/newReminder.html', function (modal) {
          $scope.modal = modal;
      }, {
          animation: 'slide-in-up',
          focusFirstInput: true
      });

      $rootScope.$on('load-reminders', function (event) {
          $rootScope.showLoading('Fetching Reminders..');
          var user = UserSession.getSession();
          ReminderFactory.getAll(user._id).success(function (data) {
              $scope.reminders = data.reminders;
              $rootScope.hideLoading();
          }).error(function (data) {
              $rootScope.hideLoading();
              $rootScope.toast('Oops.. Something went wrong');
          });
      });

      $scope.deleteReminder = function (reminder) {
          $rootScope.showLoading('Deleting Reminder..');

          ReminderFactory.delete(reminder.userId, reminder._id)
            .success(function (data) {
                console.log(data);
                $rootScope.hideLoading();
                $rootScope.$broadcast('load-reminders');
            }).error(function (data) {
                $rootScope.hideLoading();
                console.log(data);
            })
      }

  }
])


.controller('NewReminderCtrl', ['$scope', '$ionicPopup', '$filter', '$rootScope', 'ReminderFactory', 'UserSession',
  function ($scope, $ionicPopup, $filter, $rootScope, ReminderFactory, UserSession) {

      $scope.reminder = {
          'remindThis': '',
          'formattedDate': '',
          'shdlSMS': true,
          'shdlCall': true

      };

      $scope.$watch('reminder.formattedDate', function (unformattedDate) {
          $scope.reminder.formattedDate = $filter('date')(unformattedDate, 'dd/MM/yyyy HH:mm');
      });

      $scope.createReminder = function () {
          $rootScope.showLoading('Creating..');
          console.log("Create Button Works!");
          var user = UserSession.getSession();
          var _r = $scope.reminder;
          console.log($scope.reminder);
          var d = new Date(_r.fullDate);
          console.log(d);
          if (_r.shdlSMS) _r.shdlSMS = d.getTime();
          if (_r.shdlCall) _r.shdlCall = d.getTime();

          console.log(_r.shdlSMS);
          var x = new Date(parseInt(_r.shdlSMS));
          console.log(x);
          delete _r.formattedDate;
          delete _r.fullDate;

          ReminderFactory.create(user._id, _r).success(function (data) {
              $rootScope.hideLoading();
              $scope.modal.hide();
              $rootScope.$broadcast('load-reminders');
          }).error(function (data) {
              $rootScope.hideLoading();
              console.log(data);
          });


      };

      $scope.openDatePicker = function () {
          $scope.tmp = {};
          $scope.tmp.newDate = $scope.reminder.formattedDate;

          var remindWhen = $ionicPopup.show({
              template: '<datetimepicker ng-model="tmp.newDate"></datetimepicker>',
              title: "When to Remind",
              scope: $scope,
              buttons: [{
                  text: 'Cancel'
              }, {
                  text: '<b>Select</b>',
                  type: 'button-stable',
                  onTap: function (e) {
                      $scope.reminder.fullDate = $scope.tmp.newDate;
                      $scope.reminder.formattedDate = $scope.tmp.newDate;
                      console.log($scope.reminder.formattedDate);
                      // var w = new Date($scope.reminderformattedDate.fullDate));
                      //console.log(w);
                      //var d = new Date(_r.fullDate);

                      //if (_r.shdlSMS) _r.shdlSMS = d.getTime();
                  }
              }]
          });
      }

  }
])

.controller('OptionsCtrl', function ($scope, $state, Auth) {
    $scope.$on('$ionicView.enter', function() {
        if(window.localStorage['userId'] == undefined) {
            $state.go('home');
        }
    });
    $scope.logout = function() {
        window.localStorage.removeItem('userId')
        Auth.logout().then(function(oldUser) {
            // alert(oldUser.name + "you're signed out now.");
            $state.go('home')
        }, function(error) {
        });
        $state.go('home')
    }
})

////////////////////////////////////////////////
// Resources and MAPS controler functions
///////////////////////////////////////////////

.controller('Resources', function ($scope, $stateParams, $state) {
        $scope.val = {};
        $scope.search = function() {
            searchQuery = $scope.val.search;
            //console.log("MApSearch task =: " + $scope.task);            
            console.log("MApSearch resource =: " + $scope.val.search);
            console.log("search resource =: " + resource);
            $state.go('map-search');
    };
})
.controller('MapVet', function($scope, $state, $cordovaGeolocation, GoogleMaps) {
      resource = 'veterinary_care';
      searchQuery = "";
      //var resource = document.getElementById("resource").value;
      //console.log("MApCtrl resource =: ", resource);
      GoogleMaps.init();
})

.controller('MapSupplies', function($scope, $state, $cordovaGeolocation, GoogleMaps) {
      resource = 'pet_store';
      searchQuery = "";
      //var resource = document.getElementById("resource").value;
      //console.log("MApCtrl resource =: ", resource);
      GoogleMaps.init();
})

.controller('MapSearch', function($scope, $state, $cordovaGeolocation, GoogleMaps) {
      //resource = '';
      
      GoogleMaps.init();
})


.factory('Markers', function($http) {
  var markers = [];
  return {
    getMarkers: function(params){

      return $http.get("http://www.example.com/markers.php",{params:params}).then(function(response){
          markers = response;
          return markers;

      });

    }
  }

})

.factory('GoogleMaps', function($cordovaGeolocation, $ionicLoading, $rootScope, $cordovaNetwork, Markers, ConnectivityMonitor){

  var markerCache = [];
  var apiKey = false;
  var map = null;
  var service = null;
  var infowindow;

  function initMap(){
    //console.log("initMap resource =: ", resource);
    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){
        infowindow = new google.maps.InfoWindow();
        loadMarkers();

        //Reload markers every time the map moves
        google.maps.event.addListener(map, 'dragend', function(){
          console.log("moved!");
          loadMarkers();
        });

        //Reload markers every time the zoom changes
        google.maps.event.addListener(map, 'zoom_changed', function(){
          console.log("zoomed!");
          loadMarkers();
        });

        enableMap();

      });

    }, function(error){
      console.log("Could not get location");
    });

  }

  function enableMap(){
    $ionicLoading.hide();
  }

  function disableMap(){
    $ionicLoading.show({
      template: 'You must be connected to the Internet to view this map.'
    });
  }

  function loadGoogleMaps(){

    $ionicLoading.show({
      template: 'Loading Google Maps'
    });

    //This function will be called once the SDK has been loaded
    window.mapInit = function(){
      initMap();
    };  

    //Create a script element to insert into the page
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "googleMaps";

    //Note the callback function in the URL is the one we created above
    if(apiKey){ AIzaSyAXuhO3FrK0b7FMM6FyhmmyzsDvJofi0Ik
      script.src = 'http://maps.google.com/maps/api/js?key=AIzaSyAXuhO3FrK0b7FMM6FyhmmyzsDvJofi0Ik&signed_in=true&libraries=places&callback=initMap';
      //script.src = 'http://maps.google.com/maps/api/js?key=' + apiKey + '&sensor=true&callback=mapInit';
    }
    else {
      script.src = 'http://maps.google.com/maps/api/js?key=AIzaSyAXuhO3FrK0b7FMM6FyhmmyzsDvJofi0Ik&signed_in=true&libraries=places&callback=initMap';
      //script.src = 'http://maps.google.com/maps/api/js?sensor=true&callback=mapInit';
    }

    document.body.appendChild(script);

  }

  function checkLoaded(){
    if(typeof google == "undefined" || typeof google.maps == "undefined"){
      loadGoogleMaps();
    } else {
      enableMap();
    }       
  }

  function loadMarkers(){

      var center = map.getCenter();
      var bounds = map.getBounds();
      var zoom = map.getZoom();
      //var resource = 'veterinary_care';

      //Convert objects returned by Google to be more readable
      var centerNorm = {
          lat: center.lat(),
          lng: center.lng()
      };

      var boundsNorm = {
          northeast: {
              lat: bounds.getNorthEast().lat(),
              lng: bounds.getNorthEast().lng()
          },
          southwest: {
              lat: bounds.getSouthWest().lat(),
              lng: bounds.getSouthWest().lng()
          }
      };

      var boundingRadius = getBoundingRadius(centerNorm, boundsNorm);

      var params = {
        "centre": centerNorm,
        "bounds": boundsNorm,
        "zoom": zoom,
        "boundingRadius": boundingRadius
      };

     var service = new google.maps.places.PlacesService(map);

     //
     //var resource = document.getElementById("resource").innerHTML;
     //console.log(document.getElementById("resource").innerHTML);
     console.log("loadMarkers resource =: " + resource);
     console.log("loadMarkers searchQuery =: " + searchQuery);


     if (resource == ''){

        console.log("resource was blank");
        var search = {
        location: center,
        radius: 4000,
        keyword: searchQuery
      };
     }else{

      console.log("resource was not blank");
       var search = {
        location: center,
        radius: 4000,
        types: [resource],
      };
     }

    


    //calls the service API for locations of Vets neer you
      service.nearbySearch(search, callback); 

  }

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {
    console.log("Marker: ", place);
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

  function markerExists(lat, lng){
      var exists = false;
      var cache = markerCache;
      for(var i = 0; i < cache.length; i++){
        if(cache[i].lat === lat && cache[i].lng === lng){
          exists = true;
        }
      }
      
      return exists;
  }

  function getBoundingRadius(center, bounds){
    return getDistanceBetweenPoints(center, bounds.northeast, 'miles');    
  }

  function getDistanceBetweenPoints(pos1, pos2, units){

    var earthRadius = {
        miles: 3958.8,
        km: 6371
    };
    
    var R = earthRadius[units || 'miles'];
    var lat1 = pos1.lat;
    var lon1 = pos1.lng;
    var lat2 = pos2.lat;
    var lon2 = pos2.lng;
    
    var dLat = toRad((lat2 - lat1));
    var dLon = toRad((lon2 - lon1));
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    
    return d;

  }

  function toRad(x){
      return x * Math.PI / 180;
  }

  function addInfoWindow(marker, message, record) {

      var infoWindow = new google.maps.InfoWindow({
          content: message
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(map, marker);
      });
      
  }

  function addConnectivityListeners(){

    if(ionic.Platform.isWebView()){

      // Check if the map is already loaded when the user comes online, if not, load it
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        checkLoaded();
      });

      // Disable the map when the user goes offline
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        disableMap();
      });
     
    }
    else {

      //Same as above but for when we are not running on a device
      window.addEventListener("online", function(e) {
        checkLoaded();
      }, false);    

      window.addEventListener("offline", function(e) {
        disableMap();
      }, false);  
    }

  }

  return {
    init: function(key){

      if(typeof key != "undefined"){
        apiKey = key;
      }

      if(typeof google == "undefined" || typeof google.maps == "undefined"){

        console.warn("Google Maps SDK needs to be loaded");

        disableMap();

        if(ConnectivityMonitor.isOnline()){
          loadGoogleMaps();
        }
      }
      else {
        if(ConnectivityMonitor.isOnline()){
          initMap();
          enableMap();
        } else {
          disableMap();
        }
      }

      addConnectivityListeners();

    }
  }

})

.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){

  return {
    isOnline: function(){

      if(ionic.Platform.isWebView()){
        return $cordovaNetwork.isOnline();    
      } else {
        return navigator.onLine;
      }

    },
    ifOffline: function(){

      if(ionic.Platform.isWebView()){
        return !$cordovaNetwork.isOnline();    
      } else {
        return !navigator.onLine;
      }

    }
  }
});


