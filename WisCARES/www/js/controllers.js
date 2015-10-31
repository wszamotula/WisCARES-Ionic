angular.module('wiscares.controllers', [])

.controller('DashCtrl', function ($scope) { })

.controller('PetsCtrl', function ($scope, Pets) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    Pets.query().$promise.then(function (response) {
        $scope.pets = response;
    });

    //$scope.pets = Pets.all();
    //$scope.remove = function(pet) {
    // Pets.remove(pet);
    //};
})

.controller('PetDetailCtrl', function ($scope, $stateParams, Pets, Events) {
    $scope.loadPet = function () { //Issues a GET request
        $scope.pet = Pets.get({ id: $stateParams.petId });
    };

    $scope.events = Events.all();

    $scope.loadPet();
})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
