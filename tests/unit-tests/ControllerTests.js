describe('Application controller tests', function(){
  var $q, $rootScope, $scope, $httpBackend, 
  petQeryDeferred, hpQeryDeferred, vaccQeryDeferred, medQeryDeferred, visitsQeryDeferred,
  mockPetService, mockHpService, mockVaccService, mockMedService, mockVisitsService,
  mockPetsResponse = [{ id: 1, name: "Monty", species: "cat" },{ id: 2, name: "Fritz", species: "cat" }],
  mockHpResponse = [{ id: 1, name: "Rash", description: "rash on back" },{ id: 2, name: "Vommiting", description: "Ate bad food" }],
  mockVaccResponse = [{ id: 1, name: "PFS", description: "test test" },{ id: 2, name: "Another", description: "More vaccinations" }],
  mockMedResponse = [{ id: 1, name: "Blue pills", description: "the blue pills" },{ id: 2, name: "Red pills", description: "the red pills" }],
  mockVisitsResponse = [{ id: 1, name: "Vet appt", description: "at the vet" },{ id: 2, name: "pictures", description: "got pics taken" }];

  //load the module for our app
  beforeEach(module('wiscares'));

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

  /*****
  Tests for the pet list controller
  *****/
  describe("The pet list controller", function()
  {
    //Load the mocked controller
    beforeEach(inject(function($controller) {
      $scope = $rootScope.$new();
      petQueryDeferred = $q.defer();

      mockPetService = {
        query: function() {
          //queryDeferred = $q.defer();
          return {$promise: petQueryDeferred.promise};
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
        petQueryDeferred.resolve(mockPetsResponse);
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

  /******
  Tests for the pet detail controller
  ******/
  describe("The pet detail controller", function(){

    //Load the mocked controllers
    beforeEach(inject(function($controller) {
      //Create defered queries for each event type
      $scope = $rootScope.$new();
      petQueryDeferred = $q.defer();
      hpQueryDeferred = $q.defer();
      vaccQueryDeferred = $q.defer();
      medQueryDeferred = $q.defer();
      visitsQueryDeferred = $q.defer();

      //Create mocked services
      mockPetService = {
        query: function() {
          return {$promise: petQueryDeferred.promise};
        },
        get: function(id) {
          return { id: 1, name: "Monty", species: "cat" };
        },
        $delete: function() {
          //do nothing
        }
      }

      mockHpService = {
        query: function() {
          return {$promise: hpQueryDeferred.promise};
        }
      }

      mockVaccService = {
        query: function() {
          return {$promise: vaccQueryDeferred.promise};
        }
      }

      mockMedService = {
        query: function() {
          return {$promise: medQueryDeferred.promise};
        }
      }

      mockVisitsService = {
        query: function() {
          return {$promise: visitsQueryDeferred.promise};
        }
      }

      //Watch for calls to each mock
      spyOn(mockPetService, 'get');
      spyOn(mockPetService, '$delete');
      spyOn(mockHpService, 'query').and.callThrough();
      spyOn(mockVaccService, 'query').and.callThrough();
      spyOn(mockMedService, 'query').and.callThrough();
      spyOn(mockVisitsService, 'query').and.callThrough();
      
      //Initialize pet detail controller with mocked services
      $controller('PetDetailCtrl', {
        '$scope': $scope,
        '$state' : "",
        '$stateParams' : "",
        'Pets': mockPetService,
        'HealthProblems': mockHpService,
        'Medications' : mockMedService,
        'Vaccinations' : mockVaccService,
        'Visits' : mockVisitsService
      });

    }));

    describe('Loading inital pet list', function(){

      it('should have called Pets.get', function() {
        expect(mockPetService.get).toHaveBeenCalled();
      });

    });

    describe('Deleting a pet', function(){
    
      beforeEach(function(){
        $scope.deletePet;
      });

      it('should have called Pets.$delete', function() {
        expect(mockPetService.get).toHaveBeenCalled();
      });

    });

    describe('Pet health problem queries', function() {

      beforeEach(function() {
        hpQueryDeferred.resolve(mockHpResponse);
        $rootScope.$apply();
      });

      it('should query the health problem service', function() {
        expect(mockHpService.query).toHaveBeenCalled();
      });

      it('should set the response from the mockHpResponse to $scope.healthproblems', function() {
        expect($scope.healthproblems).toEqual(mockHpResponse);
      });

      it('should set $scope.healthproblemsLoaded to true', function() {
        expect($scope.healthproblemsLoaded).toBe(true);
      });

    });

    describe('Pet vaccination queries', function() {

      beforeEach(function() {
        vaccQueryDeferred.resolve(mockVaccResponse);
        $rootScope.$apply();
      });

      it('should query the vaccination service', function() {
        expect(mockVaccService.query).toHaveBeenCalled();
      });

      it('should set the response from the mockVaccResponse to $scope.vaccinations', function() {
        expect($scope.vaccinations).toEqual(mockVaccResponse);
      });

      it('should set $scope.vaccinationsLoaded to true', function() {
        expect($scope.vaccinationsLoaded).toBe(true);
      });

    });

    describe('Pet medication queries', function() {

      beforeEach(function() {
        medQueryDeferred.resolve(mockMedResponse);
        $rootScope.$apply();
      });

      it('should query the medication service', function() {
        expect(mockMedService.query).toHaveBeenCalled();
      });

      it('should set the response from the mockMedResponse to $scope.medications', function() {
        expect($scope.medications).toEqual(mockMedResponse);
      });

      it('should set $scope.medicationsLoaded to true', function() {
        expect($scope.medicationsLoaded).toBe(true);
      });

    });

    describe('Pet visit queries', function() {

      beforeEach(function() {
        visitsQueryDeferred.resolve(mockVisitsResponse);
        $rootScope.$apply();
      });

      it('should query the visit service', function() {
        expect(mockVisitsService.query).toHaveBeenCalled();
      });

      it('should set the response from the mockVisitResponse to $scope.visits', function() {
        expect($scope.visits).toEqual(mockVisitsResponse);
      });

      it('should set $scope.visitsLoaded to true', function() {
        expect($scope.visitsLoaded).toBe(true);
      });

    });

    describe('Filter setup', function(){

      it('Health problem filter should be set to true after loading', function() {
        expect($scope.filters.showHealthProblems).toBe(true);
      });

      it('Vaccination filter should be set to true after loading', function() {
        expect($scope.filters.showVaccinations).toBe(true);
      });

      it('Medication filter should be set to true after loading', function() {
        expect($scope.filters.showMedications).toBe(true);
      });

      it('Visit filter should be set to true after loading', function() {
        expect($scope.filters.showVisits).toBe(true);
      });

    });
  });

});