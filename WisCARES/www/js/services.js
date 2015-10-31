angular.module('wiscares.services', [])

.factory('Pets', function($resource) {

    return $resource("http://vast-bastion-6115.herokuapp.com/pets/:id.json", { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });

  // Some fake testing data
  //var pets = [{
  //  id: 0,
  //  name: 'Monty',
  //  species: 'Cat',
  //  breed: 'Tabby'
  //}, {
  //  id: 1,
  //  name: 'Fritz',
  //  species: 'Cat',
  //  breed: 'Tabby'
  //}, {
  //  id: 2,
  //  name: 'Harold',
  //  species: 'Dog',
  //  breed: 'Husky'
  //}, {
  //  id: 3,
  //  name: 'Alfred',
  //  species: 'Bird',
  //  breed: 'Parrot'
  //}, {
  //  id: 4,
  //  name: 'Fluffy',
  //  species: 'Dog',
  //  breed: 'Beagle'
  //}];

  //return {
  //  all: function() {
  //    return pets;
  //  },
  //  remove: function(pet) {
  //    pets.splice(pets.indexOf(pet), 1);
  //  },
  //  get: function(petId) {
  //    for (var i = 0; i < pets.length; i++) {
  //      if (pets[i].id === parseInt(petId)) {
  //        return pets[i];
  //      }
  //    }
  //    return null;
  //  }
  //};
});
