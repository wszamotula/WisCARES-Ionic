angular.module('wiscares.services', ['ngFileUpload'])

.factory('Pets', function ($resource) {

    return $resource("http://vast-bastion-6115.herokuapp.com/pets/:id.json", { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})

  .factory('CameraPopover', ['$q', function ($q) {
      return {
          getPicture: function (options) {
              var q = $q.defer();

              navigator.camera.getPicture(function (result) {
                  q.resolve(result);
              }, function (err) {
                  q.reject(err);
              }, options);

              return q.promise;
          }

      }
  }])

.factory('ImageUploader', function (Upload) {
    return {

        uploadImage: function(pet) {
            console.log(pet.imageURI);

            
            var ft = new FileTransfer();
            var options = new FileUploadOptions();
            options.fileKey = "photo";
            options.fileName = pet.imageURI.substr(pet.imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            var params = new Object();

            params.userId = pet.userId
            params.name = pet.name
            params.birthDate = pet.birthDate
            params.species = pet.species
            params.breed = pet.breed
            params.gender = pet.gender
            params.weight = pet.weight
            //params.pet = pet;
            options.params = params;

            if("id" in pet) {
                options.httpMethod = "PUT";
                ft.upload(pet.imageURI, "http://vast-bastion-6115.herokuapp.com/pets/" + pet.id + ".json",
                    function (e) {
                        console.log("WIN" + JSON.stringify(e));
                    },
                    function (e) {
                        console.log("FAIL" + JSON.stringify(e));
                }, options);
            } else {
                ft.upload(pet.imageURI, "http://vast-bastion-6115.herokuapp.com/pets.json/",
                    function (e) {
                        console.log("WIN" + JSON.stringify(e));
                    },
                    function (e) {
                        console.log("FAIL" + JSON.stringify(e));
                }, options);
            }
        }

    };
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

.factory('Vets', function ($resource) {

    return $resource("http://vast-bastion-6115.herokuapp.com/vets/:id.json", { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})

.factory('ReminderFactory', function ($resource) {
    /*function ($http) {
        var _remFactory = {};
  
        _remFactory.getAll = function (userId) {
            var t = Date.now();
            return $http.get(baseUrl + '/api/v1/reminders/' + userId + '?_t=' + t);
        }              //change url
  
        _remFactory.create = function (userId, reminder) {
            return $http.post(baseUrl + '/api/v1/reminder/' + userId + '/create', reminder);
        }
  
        _remFactory.delete = function (userId, reminderId) {
            return $http.delete(baseUrl + '/api/v1/reminder/' + userId + '/' + reminderId);
        }
        return _remFactory;
    }*/
    return $resource("http://vast-bastion-6115.herokuapp.com/reminders/:id.json", { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})

.factory('UserSession', function($resource) {
  return $resource("http://vast-bastion-6115.herokuapp.com/users/sign_in.json");
});