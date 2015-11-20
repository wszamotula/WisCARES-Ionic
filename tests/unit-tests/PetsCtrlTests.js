describe('Pets controller', function(){
  var $q, $rootScope, $scope, $httpBackend, mockPetService, queryDeferred,
  mockPetsResponse = [{
        id: 1,
        name: "Monty",
        species: "cat"
      },{
        id: 2,
        name: "Fritz",
        species: "cat"
      }];

  //load the module for our app
  beforeEach(module('wiscares')); //,'../www/templates/options.html','../www/templates/tab-account.html','../www/templates/vet-add.html'));  

  //load the module for our controllers
  beforeEach(module('wiscares.controllers'));

  //pass through all templates we pre-load
  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('templates/options.html').respond({});
    $httpBackend.whenGET('templates/tab-account.html').respond({});
    $httpBackend.whenGET('templates/vets.html').respond({});
    $httpBackend.whenGET('templates/pet-detail.html').respond({});
    $httpBackend.whenGET('templates/vet-add.html').respond({});
    $httpBackend.whenGET('templates/mission.html').respond({});
    $httpBackend.whenGET('templates/pet-edit.html').respond({});
    $httpBackend.whenGET('templates/tab-home.html').respond({});
    $httpBackend.whenGET('templates/events.html').respond({});
    $httpBackend.whenGET('templates/event.html').respond({});
    $httpBackend.whenGET('templates/med-add.html').respond({});
    $httpBackend.whenGET('templates/visit-add.html').respond({});
    $httpBackend.whenGET('templates/hp-add.html').respond({});
    $httpBackend.whenGET('templates/vac-add.html').respond({});
    $httpBackend.whenGET('templates/add-account.html').respond({});
    $httpBackend.whenGET('templates/resources.html').respond({});
    $httpBackend.whenGET('templates/map-vet.html').respond({});
    $httpBackend.whenGET('templates/map-supplies.html').respond({});
    $httpBackend.whenGET('templates/map-search.html').respond({});
  }));

  //Load the q and rootscope services
  beforeEach(inject(function(_$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  //Load the mocked controller
  beforeEach(inject(function($controller) {
    $scope = $rootScope.$new();
    queryDeferred = $q.defer();

    mockPetService = {
      query: function() {
        //queryDeferred = $q.defer();
        return {$promise: queryDeferred.promise};
      }
    }

    spyOn(mockPetService, 'query').and.callThrough();
    
    $controller('PetsCtrl', {
      '$scope': $scope,
      'Pets': mockPetService
    });

  }));

  describe('Pets query', function() {

    beforeEach(function() {
      queryDeferred.resolve(mockPetsResponse);
      $rootScope.$apply();
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