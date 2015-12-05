angular.module('loginCtrl', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicPopup, UserSession, Auth, $ionicPlatform, $state, $ionicHistory) {

        //-------------------------------------------SIGN UP----------------------------------
    $scope.signUpData = {};

    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.sign_up_modal = modal;
    });

    $scope.signUp = function () {
        $scope.signUpData = {};
        $scope.modal.hide();
        $scope.sign_up_modal.show();
    };

    $scope.password_not_match = function() {
        $ionicPopup.alert({
            template: 'Please make sure password and confirm password are same values'
        });
    };

    $scope.closeSignup = function () {
        $scope.sign_up_modal.hide();
    };

    $scope.doSignUp = function () {
        console.log('Doing signup', $scope.signUpData);
        if ($scope.signUpData.password != $scope.signUpData.password_confirmation){
            $scope.password_not_match();
        } else{  
            Auth.register($scope.signUpData).then(function(user) {
                window.localStorage['userId'] = user.id;
                $scope.sign_up_modal.hide();
            }, function(error) {
                // Registration failed...
            });
        }
        console.log($localstorage.get($scope.signUpData.username));
    };


        //-------------------------------------------LOGIN----------------------------------
    $scope.loginData = {};

    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        backdropClickToClose: false
    }).then(function (modal) {
        $scope.modal = modal;
        if(window.localStorage['userId'] == undefined) {
           $scope.login()
        }
    });

 
    $scope.$on('$ionicView.enter', function() {
        if(window.localStorage['userId'] == undefined) {
            $scope.login()
        }
    });

    $ionicPlatform.registerBackButtonAction(function() {
        //var path = $location.path()
        if ($state.is('home')) {
            ionic.Platform.exitApp();
        } else {
            $ionicHistory.goBack();
        }
    }, 300);
 
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    $scope.login = function () {
        $scope.loginData = {};
        $scope.modal.show();
    };

    $scope.doLogin = function() {
        //var user_session = new UserSession({ user: $scope.loginData });

        //user_session.$save(
        //    function(data){
        //        window.localStorage['userId'] = data.id;
        //        window.localStorage['userEmail'] = data.email;
        //        $scope.modal.hide();
        //    },
        //    function(err){
        //        //var error = err["data"]["error"] || err.data.join('. ')
        //        var confirmPopup = $ionicPopup.alert({
        //            template: "Invalid username or password"
        //        });
        //    });

        Auth.login($scope.loginData).then(function(user) {
            window.localStorage['userId'] = user.id;
            $scope.modal.hide();
        }, function(error) {
            // Authentication failed...
            var confirmPopup = $ionicPopup.alert({
                template: "Invalid username or password"
            });
        });
    }

})
