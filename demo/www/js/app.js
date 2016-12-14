// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider.state('home',{
      url: '/home',
      templateUrl:'templates/home.html'
  })
  $stateProvider.state('about',{
      url: '/about',
      templateUrl:'templates/about.html'
  })
  $stateProvider.state('sons',{
      url: '/sons',
      templateUrl:'templates/sons.html'
  })

  $urlRouterProvider.otherwise('/home')
})

.controller('CaptureCtrl', function($scope, $ionicActionSheet, $ionicLoading, $ionicPlatform, $cordovaCamera) {

  $ionicPlatform.ready(function() {

    $scope.showAnalyzeButton = false;

    var self = this;

    this.showLoading = function() {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
    };

    this.hideLoading = function(){
      $ionicLoading.hide();
    };

    this.getPicture = function(index){

      var sourceType = index === 0 ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA;
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: sourceType,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation:true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        var image = document.getElementById('pic');
        image.src = "data:image/jpeg;base64," + imageData;
        // $scope.showAnalyzeButton = true;
        $scope.testOcrad();
      }, function(err) {
          alert(err);
      });

    };

  });

  $scope.showActionSheet = function(){
    var hideSheet = $ionicActionSheet.show({
      buttons: [
       { text: 'Choose Photo' },
       { text: 'Take Photo' }
      ],
      cancelText: 'Cancel',
      cancel: function() {
        console.log('cancel');
      },
      buttonClicked: function(index) {
        getPicture(index);
       return true;
      }
    });
  };

  // $scope.showActionSheet();

  $scope.testOcrad = function(){
    self.showLoading();
    OCRAD(document.getElementById("pic"), function(text){
      self.hideLoading();
      console.log(text);
      alert(text);
    });
    // var AYLIENTextAPI = require('aylien_textapi');
    // var textapi = new AYLIENTextAPI({
    //   application_id: "be2e9ebf",
    //   application_key: "6628469270bf2deeaa532b9e718e001f"
    // });
    // textapi.sentiment({
    //   'text': 'John is a very good football player!'
    // }, function(error, response) {
    //   if (error === null) {
    //     alert(response);
    //   }
    // });
  } ;

})

.controller('AudioController', function($scope,$ionicPlatform, $ionicActionSheet, $ionicLoading) {
  var audio = [{
      id: 1,
      key: 'Son triste',
      title: "Tristoune",
      track: 'audio/The_Master.mp3',
      genre: "This will be card Description"
    }, {
      id: 2,
      key: 'Son joyeux',
      title: "Joyeux",
      track: 'audio/Give.mp3',
      genre: "Alternative & Punk | Bright"
    }, {
      id: 3,
      key: 'Son colère',
      title: "Colère",
      track: 'audio/colere.mp3',
      genre: ""
    }, ];

    $scope.audioTracks = Array.prototype.slice.call(audio, 0);
    // alert($scope.audioTracks);

    $scope.player = {
      key: '' // Holds a last active track
    }

    $ionicPlatform.ready(function() {

      $scope.playTrack = function(track, key) {
        // Preload an audio track before we play it
        window.plugins.NativeAudio.preloadComplex(key, track, 1, 1, 0, function(msg) {
          // If this is not a first playback stop and unload previous audio track
          if ($scope.player.key.length > 0) {
            window.plugins.NativeAudio.stop($scope.player.key); // Stop audio track
            window.plugins.NativeAudio.unload($scope.player.key); // Unload audio track
          }

          window.plugins.NativeAudio.play(key); // Play audio track
          $scope.player.key = key; // Set a current audio track so we can close it if needed
        }, function(msg) {
          alert('error: ' + msg); // Loading error
        });
      };

      $scope.stopTrack = function() {
          // If this is not a first playback stop and unload previous audio track
          if ($scope.player.key.length > 0) {
            window.plugins.NativeAudio.stop($scope.player.key); // Stop audio track
            window.plugins.NativeAudio.unload($scope.player.key); // Unload audio track
            $scope.player.key = ''; // Remove a current track on unload, it will break an app if we try to unload it again in playTrack function
          }
      };
    });
});
