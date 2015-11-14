angular.module('wiscares.controllers', ['ui.router'])

.controller('DashCtrl', function ($scope) {

})

.controller('OptionsCtrl', function ($scope) {

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

    $scope.filters = {
        showHealthProblems : true,
        showVaccinations : true,
        showMedications : true,
        showVisits : true
    };

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

.controller('PetAddCtrl', function ($scope, $stateParams, $state, Pets) {
    $scope.pet = new Pets();  //create new movie instance. Properties will be set via ng-model on UI
    $scope.pet.userId = window.localStorage['userId']
    $scope.addPet = function() { //create a new movie. Issues a POST to /api/movies
      $scope.pet.$save(function() {
        $state.go('pets');
    });
  };
})

.controller('PetEditCtrl', function ($scope, $state, $stateParams, Pets) {
  $scope.updatePet = function() { //Update the edited movie. Issues a PUT to /api/movies/:id
        $scope.pet.$update(function() {
            $state.go('pet-detail', {petId: $scope.pet.id}); // on success go back to home i.e. movies state.
        });
  };

  $scope.loadPet = function() { 
    $scope.pet = Pets.get({ id: $stateParams.id });
  };

  $scope.loadPet(); // Load a movie which can be edited on UI
})

.controller('CameraCtrl', ['$scope', "CameraPopover", "$ionicActionSheet", function ($scope, CameraPopover, $ionicActionSheet) {
    $scope.showProgress = false;

    var uploadFileUrl = "serve api";

    $scope.showActionSheet = function () {
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: 'Take Photo' },
              { text: 'Take Photo from albums' }
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
                    takePicture({
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
                    });
                } else if (index == 1) {
                    takePicture({
                        quality: 100,
                        allowEdit: true,
                        targetWidth: 500,
                        targetHeight: 225,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        encodingType: Camera.EncodingType.JPEG,
                        destinationType: Camera.DestinationType.FILE_URI
                    });
                } else {
                    return true;
                }
                hideSheet();
            }
        });
    };

    // upload file with a imageURI
    var uploadFile = function (imageURI) {
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
    };

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

.controller('OptionsCtrl', function ($scope) {

})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
});


