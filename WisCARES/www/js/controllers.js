angular.module('wiscares.controllers', [])

.controller('DashCtrl', function ($scope) { 
   $scope.$on('$ionicView.enter', function() {
    $scope.login();
  });
   $scope.home 
})


.controller('PetsCtrl', function ($scope, Pets) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    
    console.log();
    Pets.query({"userId":"2"}).$promise.then(function (response) {
        $scope.pets = response;
    });

    //$scope.pets = Pets.all();
    //$scope.remove = function(pet) {
    // Pets.remove(pet);
    //};
})

.controller('PetDetailCtrl', function ($scope, $stateParams, Events, Pets, HealthProblems, Medications, Vaccinations, Visits) {
    $scope.loadPet = function () { //Issues a GET request
        $scope.pet = Pets.get({ id: $stateParams.petId });
    };

    $scope.loadPet();
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
.controller('PetAddCtrl', function ($scope, $stateParams, Pets, Events) {
})


.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
