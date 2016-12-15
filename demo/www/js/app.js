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
      templateUrl:'templates/home.html',
      controller: 'CaptureCtrl'
  })
  $stateProvider.state('player',{
      url: '/player:tone',
      templateUrl:'templates/player.html',
      controller: 'AudioController'
  })
  $urlRouterProvider.otherwise('/home')
})

.controller('CaptureCtrl', function($scope, $ionicActionSheet, $ionicLoading, $ionicPlatform, $cordovaCamera, $state, $http) {

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
          // alert(err);
      });

    };

  });

  $scope.showActionSheet = function(){
    var hideSheet = $ionicActionSheet.show({
      buttons: [
       { text: 'Choisir une photo' },
       { text: 'Prendre une photo' }
      ],
      cancelText: 'Annuler',
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
    var text;
    self.showLoading();
    OCRAD(document.getElementById("pic"), function(value){
      // self.hideLoading();
      text = value;
      // alert(text)
      $http({
        method: 'GET',
        // url: 'http://5b5d0717.ngrok.io/analyze?text='+text
        url: 'http://bed9b320.ngrok.io/analyze?text='+text
      }).then(function successCallback(response) {
        // alert(response.data.tone);
        // self.showLoading();
        var tone = response.data.tone;
        $state.go('player', {tone: tone});
      })
    });
  };
})


// PLAYER
.controller('AudioController', function($scope, $ionicPlatform, $ionicActionSheet, $ionicLoading, $state, $stateParams) {
  this.hideLoading = function(){
    $ionicLoading.hide();
  };
  hideLoading();
  // $stateParams.text;
  // alert($stateParams.tone);
  var texte = $stateParams.mireille;
  var emotion = $stateParams.tone;
  // alert(texte);
  var pause = false;
  var loop  = false;

  var audio_player            = document.querySelector('.audio_player');
  var audio_button_play       = document.querySelector('.audio_button_play');
  var audio_button_previous   = document.querySelector('.audio_button_previous');
  var audio_button_next       = document.querySelector('.audio_button_next');
  var audio_button_loop       = document.querySelector('.audio_button_loop');
  var audio_button_random     = document.querySelector('.audio_button_random');
  var audio_seek_bar          = document.querySelector('.audio_seek_bar');
  var audio_progress_bar      = document.querySelector('.audio_progress_bar');
  var audio_info_title        = document.querySelector('.audio_info_title_h1');
  var audio_info_author       = document.querySelector('.audio_info_author_h1');

  if (emotion == 'joy') {
    var songs = {"songs":[
      {"title":"Smile Quiet Looking Up", "autor":"", "src":"audio/joie1.mp3"},
    ]};
  }
  else if (emotion == 'sadness') {
    var songs = {"songs":[
      {"title":"Greta Sting", "autor":"", "src":"audio/tristesse1.mp3"},
      {"title":"Disconcerned", "autor":"", "src":"audio/tristesse2.mp3"},
    ]};
  }
  else if (emotion == 'fear') {
    var songs = {"songs":[
      {"title":"Long Note One", "autor":"", "src":"audio/peur.mp3"}
    ]};
  }
  else if (emotion == 'disgust') {
    var songs = {"songs":[
      {"title":"Long Note One", "autor":"", "src":"audio/peur.mp3"},
      {"title":"Restless Natives", "autor":"", "src":"audio/colere.mp3"}
    ]};
  }
  else if (emotion == 'anger') {
    var songs = {"songs":[
      {"title":"Restless Natives", "autor":"", "src":"audio/colere.mp3"},
      {"title":"Disconcerned", "autor":"", "src":"audio/tristesse2.mp3"}
    ]};
  }
  else if (emotion == '') {
    var songs = {"songs":[
      {"title":"Restless Natives", "autor":"", "src":"audio/colere.mp3"},
      {"title":"Long Note One", "autor":"", "src":"audio/peur.mp3"}
    ]};
  }
  // var songs = {"songs":[
  //   {"title":"Colère 1", "autor":"", "src":"audio/colere.mp3"},
  //   {"title":"Colère 2", "autor":"", "src":"audio/colere2.mp3"},
  // ]};
  console.log(songs);
  audio_player.src = songs.songs[0].src;
  audio_info_title.innerText = songs.songs[0].title;
  audio_info_author.innerText = songs.songs[0].autor;
  audio_player.play();

  // PLAY / PAUSE
    var if_playing = function(){
    	if (pause == true) {
        audio_button_play.src='img/pause.png';
    		audio_player.play();
    		pause = false;
    	}
    	else{
        audio_button_play.src='img/play.png'
    		audio_player.pause();
    		pause = true;
    	}
    };
    audio_button_play.addEventListener('click', function(){
    	if_playing();
    });

    // SEEK BAR
    window.setInterval(function(){
    	var progress_ratio   = audio_player.currentTime / audio_player.duration;

    	audio_progress_bar.style.transform = 'scaleX(' + progress_ratio +')';
    	// document.querySelector('.progressTime').textContent = timePast(); /* TIME OF VIDEO*/

    },50);

    audio_seek_bar.addEventListener('click',function(e){
    	var bounding_rect = audio_seek_bar.getBoundingClientRect(),
    	    x             = e.clientX - bounding_rect.left,
    	    ratio         = x / bounding_rect.width,
    	    time          = ratio * audio_player.duration;

    	audio_player.currentTime = time;
    });

    // TIME OF
    function timePast(){
    	var hours = Math.floor(audio_player.currentTime / 3600);
    	var mins = Math.floor((audio_player.currentTime % 3600) / 60);
    	var secs = Math.floor(audio_player.currentTime % 60);
    	if (secs < 10) {
            secs = "0" + secs;
        }

        if (hours) {
            if (mins < 10) {
                mins = "0" + mins;
            }

            return hours + ":" + mins + ":" + secs;
        } else {
            return mins + ":" + secs;
        }
    }

    // LOOP
    var if_looping = function(){
    	if (loop == true) {
    		audio_player.loop = false;
        audio_button_loop.classList.add("disable");
        audio_button_loop.classList.remove("enable");
    		loop = false;
    	}
    	else{
        audio_player.loop = true;
        audio_button_loop.classList.add("enable");
        audio_button_loop.classList.remove("disable");
    		loop = true;
    	}
    };
    audio_button_loop.addEventListener('click', function(){
    	if_looping();
    });

    // RELOAD / PRECEDENT
    audio_button_previous.addEventListener('click', function(){
      precedent();
    });
    console.log(songs.songs.length);
    var precedent = function() {
      pause = true;
      audio_player.currentTime = 0;
      if (audio_player.currentTime <=1) {
        for (var i = songs.songs.length - 1; i <= songs.songs.length; i--) {
          audio_player.src = songs.songs[i].src;
          audio_info_title.innerText = songs.songs[i].title;
          audio_info_author.innerText = songs.songs[i].autor;
        }
      }
      if_playing();
    }

    // NEXT
    var next = function() {
      pause = true;
      console.log('click');
      for (var i = 0; i < songs.songs.length; i++) {
        audio_player.src = songs.songs[i].src;
        audio_info_title.innerText = songs.songs[i].title;
        audio_info_author.innerText = songs.songs[i].autor;
      }
      if_playing();
    }
    audio_button_next.addEventListener('click', function(){
      next();
    });

    if (audio_player.currentTime == audio_player.duration) {
    }
});
