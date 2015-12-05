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
            options.httpMethod = "PUT";
            var params = new Object();

            params.pet = pet;
         

            options.params = params;
            if("id" in pet) {
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

.factory('UserSession', function($resource) {
  return $resource("http://vast-bastion-6115.herokuapp.com/users/sign_in.json");
});