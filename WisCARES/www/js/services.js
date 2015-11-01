angular.module('wiscares.services', [])

.factory('Pets', function ($resource) {

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
})

.factory('Vets', function () {

})

.factory('Events', function () {

    var events = [{
        id: 0,
        type: 'Health Problem',
        name: 'Rash',
        description: 'Rash appeared on back starting 10/1/2015'
    }, {
        id: 2,
        type: 'Health Problem',
        name: 'Vommitting',
        description: 'Ate chocolate and vommitted on 10/20/2015'
    }, {
        id: 3,
        type: 'Vaccination',
        name: 'PFS',
        description: 'Recieved vaccination to prevent purple fur syndrome on 6/1/2015'
    }];

    return {
        all: function () {
            return events;
        },
        remove: function (event) {
            events.splice(events.indexOf(event), 1);
        },
        get: function (eventId) {
            for (var i = 0; i < events.length; i++) {
                if (events[i].id === parseInt(eventId)) {
                    return events[i];
                }
            }
            return null;
        }
    };
});