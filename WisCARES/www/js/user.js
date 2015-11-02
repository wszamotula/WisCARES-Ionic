angular.module('loginCtrl', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicPopup, $localstorage, UserSession) {

        //-------------------------------------------SIGN UP----------------------------------
    $scope.signUpDate = {};

    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.sign_up_modal = modal;
    });

    $scope.signUp = function () {
        $scope.signUpDate = {};
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
        console.log('Doing signup', $scope.signUpDate);
        if ($scope.signUpDate.password != $scope.signUpDate.confirm_password){
            $scope.password_not_match();
        }else{
            $localstorage.set($scope.signUpDate.username,$scope.signUpDate.password);
        }
        console.log($localstorage.get($scope.signUpDate.username));
    };


        //-------------------------------------------LOGIN----------------------------------
    $scope.loginData = {};

    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
        $scope.login()
    });

    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    $scope.login = function () {
        $scope.loginData = {};
        $scope.modal.show();
    };

    $scope.doLogin = function() {
        var user_session = new UserSession({ user: $scope.loginData });

        user_session.$save(
            function(data){
                window.localStorage['userId'] = data.id;
                window.localStorage['userEmail'] = data.email;
                $scope.modal.hide();
            },
            function(err){
                //var error = err["data"]["error"] || err.data.join('. ')
                var confirmPopup = $ionicPopup.alert({
                    template: "Invalid username or password"
                });
            });

    }

})
