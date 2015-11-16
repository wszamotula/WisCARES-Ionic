angular.module('wiscares.controllers', ['ui.router', 'ngFileUpload'])

.controller('DashCtrl', function ($scope) {

})


.controller('PetsCtrl', function ($scope, Pets) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    

    var userId = window.localStorage['userId'];

    $scope.$on('$ionicView.enter', function() {
        Pets.query({"userId":userId}).$promise.then(function (response) {
            $scope.pets = response;
        });
    });


    //$scope.pets = Pets.all();
    //$scope.remove = function(pet) {
    // Pets.remove(pet);
    //};
})

.controller('PetDetailCtrl', function ($scope, $state, $stateParams, Events, Pets, HealthProblems, Medications, Vaccinations, Visits) {
    $scope.loadPet = function () { //Issues a GET request
        $scope.pet = Pets.get({ id: $stateParams.petId });
    };

    $scope.deletePet = function() { // Delete a movie. Issues a DELETE to /api/movies/:id
    	$scope.pet.$delete();
    	$state.go('pets');
  	};

    $scope.$on('$ionicView.enter', function() {
        $scope.loadPet();
    });

    HealthProblems.query({"petID":$stateParams.petId}).$promise.then(function (response) {
        $scope.healthproblems = response;
    });

    Vaccinations.query({"petID":$stateParams.petId}).$promise.then(function (response) {
        $scope.vaccinations = response;
    });

    Medications.query({"petID":$stateParams.petId}).$promise.then(function (response) {
        $scope.medications = response;
    });

    Visits.query({"petID":$stateParams.petId}).$promise.then(function (response) {
        $scope.visits = response;
    });
})

.controller('PetAddCtrl', function ($scope, $stateParams, $state, Pets, ImageUploader) {
    $scope.pet = new Pets();  //create new movie instance. Properties will be set via ng-model on UI
    $scope.pet.userId = window.localStorage['userId']

    $scope.addPet = function() { //create a new movie. Issues a POST to /api/movies
        //if(typeof $scope.pet.imageURI == "undefined") {
            $scope.pet.$save(function() {
                $state.go('pets');
            });
        //} else {
            //ImageUploader.uploadImage($scope.pet);
            //$state.go('pets');
            //window.resolveLocalFileSystemURL($scope.pet.imageURI, ImageUploader.createFile, ImageUploader.fail);
        //}

    };
})

.controller('PetEditCtrl', function ($scope, $state, $stateParams, Pets, Upload) {
  function fail(error) {
    console.log("fail: " + error.code);
  }

  function uploadImage(imageFile) {
    console.log("http://vast-bastion-6115.herokuapp.com/pets/" + $scope.pet.id);
    Upload.upload({
        url: "http://vast-bastion-6115.herokuapp.com/pets/" + $scope.pet.id,
        method: 'POST',
        fields: { 'pet[name]': $scope.pet.name, 'pet[userId]': $scope.pet.userId, 'pet[species]': $scope.pet.species,
        'pet[breed]': $scope.pet.breed, 'pet[gender]': $scope.pet.gender, 'pet[birthDate]': $scope.pet.birthDate,
        'pet[weight]': $scope.pet.weight},
        file: imageFile,
        fileFormDataName: 'pet[photo]'
    });
  }

  function createFile(fileEntry) {
    fileEntry.file(uploadImage, fail)
  };
  
  $scope.updatePet = function() { //Update the edited movie. Issues a PUT to /api/movies/:id
        console.log(Object.keys($scope.pet));
        console.log(typeof $scope.pet.imageURI == "undefined");
        console.log($scope.pet.imageURI);
        if(typeof $scope.pet.imageURI == "undefined") {
            $scope.pet.$update(function() {
                $state.go('pet-detail', {petId: $scope.pet.id}); // on success go back to home i.e. movies state.
            });
        } else {
            window.resolveLocalFileSystemURL($scope.pet.imageURI, createFile, fail);
        }
  };

  $scope.loadPet = function() { 
    $scope.pet = Pets.get({ id: $stateParams.id });
  };

  $scope.loadPet(); // Load a movie which can be edited on UI
})

.controller('CameraCtrl', ['$scope', "CameraPopover", "$ionicActionSheet", function ($scope, CameraPopover, $ionicActionSheet) {
    $scope.showProgress = false;


    //var uploadFileUrl = "serve api";

    $scope.showActionSheet = function () {
        // Show the action sheet
        console.log(Object.keys($scope.pet));
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
                        $scope.pet.imageURI = imageURI;
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

    // upload file with a imageURI
    /*var uploadFile = function (imageURI) {
        // show the progress bar
        safeApply($scope, function () {
            $scope.showProgress = true;
        });
        var uploadOptions = new FileUploadOptions();
        uploadOptions.fileKey = "petImage";
        uploadOptions.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        uploadOptions.mimeType = "image/jpeg";
        uploadOptions.chunkedMode = false;

        var ft = new FileTransfer();

        var statusDom = document.getElementById("ft-prog");

        ft.onprogress = function (progressEvent) {
            if (progressEvent.lengthComputable) {
                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                statusDom.value = perc;
                if (perc == 100) {
                    safeApply($scope, function () {
                        $scope.showProgress = false;
                    });
                }
            } else {
                console.log("loading....");
            }
        };

        ft.upload(imageURI, encodeURI(uploadFileUrl), onSuccess, onFail, uploadOptions, true);

        function onSuccess(responseData) {
            responseString = JSON.stringify(responseData);
            responseObject = JSON.parse(responseString);
            responsePerson = JSON.parse(responseObject.response);
            safeApply($scope, function () {
                // update url
            });
        };
        function onFail() {
            alert("something wrong, please try again");
        };
    };

    //get photos form device and return a file path url
    var takePicture = function (options) {
        CameraPopover.getPicture(options).then(function (imageURI) {
            uploadFile(imageURI);
        }, function (err) {
            console.error(err);
        });
    };*/

}])

.controller('VetsCtrl', function ($scope, Vets) {
    var userID = window.localStorage['userId'];
    console.log(userID);

    $scope.deleteVet = function(vet) { // Delete a movie. Issues a DELETE to /api/movies/:id
    	vet.$delete(function() {
    		Vets.query({"userID":userID}).$promise.then(function (response) {
            	$scope.vets = response;
        	});
    	});
  	};

    $scope.$on('$ionicView.enter', function() {
        Vets.query({"userID":userID}).$promise.then(function (response) {
            $scope.vets = response;
        });
    });
})

.controller('VetDetailCtrl', function ($scope, $state, $stateParams, Vets) {
    $scope.loadVet = function () { //Issues a GET request
        $scope.vet = Vets.get({ id: $stateParams.id });
    };

    $scope.$on('$ionicView.enter', function() {
        $scope.loadVet();
    });
})

.controller('VetAddCtrl', function ($scope, $stateParams, $state, Vets) {
    $scope.vet = new Vets();  //create new movie instance. Properties will be set via ng-model on UI
    $scope.vet.userID=window.localStorage['userId']
    console.log($scope.vet.userID);
    $scope.addVet = function() { //create a new movie. Issues a POST to /api/movies
      $scope.vet.$save(function() {
      $state.go('vets');
    });
  };
})

.controller('VetEditCtrl', function ($scope, $state, $stateParams, Vets) {
  $scope.updateVet = function() { //Update the edited movie. Issues a PUT to /api/movies/:id
        $scope.vet.$update(function() {
            $state.go('vet-detail', {id: $scope.vet.id}); // on success go back to home i.e. movies state.
        });
  };

  $scope.loadVet = function() { 
    $scope.vet = Vets.get({ id: $stateParams.id });
  };

  $scope.loadVet(); // Load a movie which can be edited on UI
})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
})

////////////////////////////////////////////////
// Resources and MAPS controler functions
///////////////////////////////////////////////
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

  function initMap(){

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
    if(apiKey){
      script.src = 'http://maps.google.com/maps/api/js?key=' + apiKey + '&sensor=true&callback=mapInit';
    }
    else {
      script.src = 'http://maps.google.com/maps/api/js?sensor=true&callback=mapInit';
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

      var markers = Markers.getMarkers(params).then(function(markers){
        console.log("Markers: ", markers);
        var records = markers.data.result;

        for (var i = 0; i < records.length; i++) {

          var record = records[i];

          // Check if the marker has already been added
          if (!markerExists(record.lat, record.lng)) {
              
              var markerPos = new google.maps.LatLng(record.lng, record.lat);
              // add the marker
              var marker = new google.maps.Marker({
                  map: map,
                  animation: google.maps.Animation.DROP,
                  position: markerPos
              });

              // Add the marker to the markerCache so we know not to add it again later
              var markerData = {
                lat: record.lat,
                lng: record.lng,
                marker: marker
              };

              markerCache.push(markerData);

              var infoWindowContent = "<h4>" + record.name + "</h4>";          

              addInfoWindow(marker, infoWindowContent, record);
          }          

        }

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
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, GoogleMaps) {
      GoogleMaps.init();
});

