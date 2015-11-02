angular.module('wiscares.controllers', ['ui.router'])

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

.controller('PetAddCtrl', function ($scope, $stateParams, $state, Pets) {
    $scope.pet = new Pets();  //create new movie instance. Properties will be set via ng-model on UI
    $scope.pet.userId=window.localStorage['userId']
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

.controller('VetsCtrl', function ($scope, Vets) {
    var userId = window.localStorage['userId'];

    $scope.$on('$ionicView.enter', function() {
        Vets.query({"userId":userId}).$promise.then(function (response) {
            $scope.vets = response;
        });
    });
})

.controller('VetAddCtrl', function ($scope, $stateParams, $state, Vets) {
    $scope.vet = new Vets();  //create new movie instance. Properties will be set via ng-model on UI
    $scope.vet.userId=window.localStorage['userId']
    $scope.addVet = function() { //create a new movie. Issues a POST to /api/movies
      $scope.vet.$save(function() {
      $state.go('vets');
    });
  };
})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
