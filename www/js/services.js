angular.module('wiscares.services', ['ngFileUpload'])

.factory('Pets', function ($resource) {

    return $resource("https://vast-bastion-6115.herokuapp.com/pets/:id.json", { id: '@id' }, {
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
        /*fail: function (error) {
            console.log("fail: " + error.code);
        },
        uploadImage: function (imageFile) {
            console.log("https://vast-bastion-6115.herokuapp.com/pets.json/");
            Upload.upload({
                url: "https://vast-bastion-6115.herokuapp.com/pets.json/",
                method: 'POST',
                fields: { 'pet[name]': pet.name, 'pet[userId]': pet.userId, 'pet[species]': pet.species,
                'pet[breed]': pet.breed, 'pet[gender]': pet.gender, 'pet[birthDate]': pet.birthDate,
                'pet[weight]': pet.weight},
                file: imageFile,
                fileFormDataName: 'pet[photo]'
            });
        },*/
        uploadImage: function(pet) {
            console.log(pet.imageURI);

            
            var ft = new FileTransfer();
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = pet.imageURI.substr(pet.imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            var params = new Object();
            params.userId = pet.userId;
            params.name = pet.name;
            params.species =  pet.species;
            params.breed = pet.breed;
            params.gender = pet.gender;
            params.weight = pet.weight;
            params.birthDate = pet.birthDate;
            params.pet = new Object();
            params.pet.userId = pet.userId;
            params.pet.name = pet.name;
            params.pet.species =  pet.species;
            params.pet.breed = pet.breed;
            params.pet.gender = pet.gender;
            params.pet.weight = pet.weight;
            params.pet.birthDate = pet.birthDate;            

            options.params = params;
            /*{
                "userId": pet.userId,
                "name": pet.name,
                "species": pet.species,
                "breed": pet.breed,
                "gender": pet.gender,
                "weight": pet.weight,
                "birthDate": pet.birthDate,
                "pet": {
                    userId: pet.userId,
                    name: pet.name,
                    species: pet.species,
                    breed: pet.breed,
                    gender: pet.gender,
                    weight: pet.weight,
                    birthDate: pet.birthDate}
            };*/
            console.log(options.params);
            ft.upload(pet.imageURI, "https://vast-bastion-6115.herokuapp.com/pets.json/",
                function (e) {
                    console.log("WIN" + JSON.stringify(e));
                },
                function (e) {
                    console.log("FAIL" + JSON.stringify(e));
                }, options);
            /*window.resolveLocalFileSystemURL(pet.imageURI, function (fileEntry) {
                    var filepath = fileEntry.fullPath;
                    options.fileKey = "photo";
                    options.fileName = fileEntry.name;
                    options.mimeType = "image/jpeg";
                    options.chunkedMode = false;
                    options.params = {
                        "userId": pet.userId,
                        "name": pet.name,
                        "species": pet.species,
                        "breed": pet.breed,
                        "gender": pet.gender,
                        "weight": pet.weight,
                        "birthDate": pet.birthDate
                    };
             
                    ft.upload(filepath, "https://vast-bastion-6115.herokuapp.com/pets/",
                        function (e) {
                            console.log("WIN" + JSON.stringify(e));
                        },
                        function (e) {
                            console.log("FAIL" + JSON.stringify(e));
                        }, options);

                }, function (error) {
                    console.log("fail: " + error.code);
                })*/
        }
            /*window.resolveLocalFileSystemURL(pet.imageURI, 
                function (fileEntry) {
                    console.log(fileEntry);
                    fileEntry.file(function (imageFile) {
                        var url = fileEntry.nativeURL;
                        console.log(url);
                        Upload.upload({
                            url: "https://vast-bastion-6115.herokuapp.com/pets/",
                            method: 'POST',
                            fields: { 'pet[name]': pet.name, 'pet[userId]': pet.userId, 'pet[species]': pet.species,
                            'pet[breed]': pet.breed, 'pet[gender]': pet.gender, 'pet[birthDate]': pet.birthDate,
                            'pet[weight]': pet.weight},
                            file: imageFile,
                            fileFormDataName: 'pet[photo]'
                        });
                    }, function (error) {
                    console.log("fail: " + error.code);
                    })
                }, function (error) {
                console.log("fail: " + error.code);
                });*/
        //}
    };
})

.factory('HealthProblems', function ($resource) {

    return $resource("https://vast-bastion-6115.herokuapp.com/health_problems/:id.json", { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})

.factory('Medications', function ($resource) {

    return $resource("https://vast-bastion-6115.herokuapp.com/medications/:id.json", { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})

.factory('Vaccinations', function ($resource) {

    return $resource("https://vast-bastion-6115.herokuapp.com/vaccinations/:id.json", { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})

.factory('Visits', function ($resource) {

    return $resource("https://vast-bastion-6115.herokuapp.com/visits/:id.json", { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})

.factory('Vets', function ($resource) {

    return $resource("https://vast-bastion-6115.herokuapp.com/vets/:id.json", { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})

.factory('UserSession', function($resource) {
  return $resource("https://vast-bastion-6115.herokuapp.com/users/sign_in.json");
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