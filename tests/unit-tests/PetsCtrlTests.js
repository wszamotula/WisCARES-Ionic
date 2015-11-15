describe('Pets controller', function(){
  var $q, $rootScope, $scope, mockPetService, 
  mockPetsResponse = [{
        id: 1,
        name: "Monty",
        species: "cat"
      },{
        id: 2,
        name: "Fritz",
        species: "cat"
      }];

  // load the module for our app
  beforeEach(module('wiscares'));  

  //Load the q and rootscope services
  beforeEach(inject(function(_$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  //Load the mocked controller
  beforeEach(inject(function($controller) {
    $scope = $rootScope.$new();

    mockPetService = {
      query: function() {
        queryDeferred = $q.defer();
        return {$promise: queryDeferred.promise};
      }
    }

    spyOn(mockPetService, 'query').andCallThrough();

    $controller('PetsCtrl', {
      '$scope': $scope,
      'Pets': mockPetService
    });

  }));

  describe('Pets.query', function() {

    beforeEach(function() {
      queryDeferred.resolve(mockPetsResponse);
      $rootScope.$apply();
    });

    it('Should have been called', function(){
      expect($scope.wasCalled).toEqual(true);
    }); 

    it('should query the pet service', function() {
      expect(mockPetService.query).toHaveBeenCalled();
    });

    it('should set the response from the mockPetsResponse to $scope.pets', function() {
      expect($scope.pets).toEqual(mockPetsResponse);
    });

    it('should set $scope.petsLoaded to true', function() {
      expect($scope.petsLoaded).toBe(true);
    });

  });

});