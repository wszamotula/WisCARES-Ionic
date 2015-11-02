angular.module('wiscares.services', [])

.factory('Pets', function ($resource) {

    return $resource("http://vast-bastion-6115.herokuapp.com/pets/:id.json", { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})

.factory('HealthProblems', function ($resource) {

    return $resource("http://vast-bastion-6115.herokuapp.com/health_problems/:id.json", { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})

.factory('Medications', function ($resource) {

    return $resource("http://vast-bastion-6115.herokuapp.com/medications/:id.json", { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})

.factory('Vaccinations', function ($resource) {

    return $resource("http://vast-bastion-6115.herokuapp.com/vaccinations/:id.json", { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})

.factory('Visits', function ($resource) {

    return $resource("http://vast-bastion-6115.herokuapp.com/visits/:id.json", { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})

.factory('UserSession', function($resource) {
  return $resource("http://vast-bastion-6115.herokuapp.com/users/sign_in.json");
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