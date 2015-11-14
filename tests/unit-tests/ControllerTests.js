describe('Pet Controller', function(){
    var scope;

    // load the module for our app
	beforeEach(module('wiscares'));  

    // load the controller's module
    beforeEach(module('wiscares.controllers'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        window.localStorage['userId'] = 2;
        $controller('PetsCtrl', {$scope: scope});
    }));

    it('Should have a list containing 4 pets', function(){
        expect(scope.pets.length).toEqual(4);
    });

    it('Should have been loaded', function(){
    	expect(scope.gotCalled).toEqual(true);
    });

});