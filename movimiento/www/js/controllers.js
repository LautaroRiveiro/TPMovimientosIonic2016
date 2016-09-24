angular.module('starter.controllers', [])

.controller('ChatsCtrl', function($scope, $cordovaDeviceMotion, $ionicPlatform) {
    
    $scope.coordenadas = {
        x : null,
        y : null,
        z : null,
        timestamp : null
    };

    $scope.coordenadasAnteriores = {
        x : null,
        y : null,
        z : null,
        timestamp : null
    };

    $scope.opciones = {frequency: 2000, deviation: 25};


  //Start Watching method
  $scope.Mirar = function() {
   
      // Device motion configuration
      $scope.watch = $cordovaDeviceMotion.watchAcceleration($scope.opciones);
   
      // Device motion initilaization
      $scope.watch.then(null, function(error) {
          console.log('Error');
      },function(result) {
   
          // Set current data  
          $scope.coordenadas.x = result.x;
          $scope.coordenadas.y = result.y;
          $scope.coordenadas.z = result.z;
          $scope.coordenadas.timestamp = result.timestamp;    
   
          // Detecta shake  
          $scope.Detectar(result);  
       });     
  };  


  //Stop watching method
  $scope.Parar = function() {  
      $scope.watch.clearWatch();
  }



  // Detect shake method      
  $scope.Detectar = function(result) { 
   
      //Object to hold measurement difference between current and old data
      var coordenadasDiferencia = {};
   
      // Calculate measurement change only if we have two sets of data, current and old
      if ($scope.coordenadasAnteriores.x !== null) {
          coordenadasDiferencia.x = Math.abs($scope.coordenadasAnteriores.x, result.x);
          coordenadasDiferencia.y = Math.abs($scope.coordenadasAnteriores.y, result.y);
          coordenadasDiferencia.z = Math.abs($scope.coordenadasAnteriores.z, result.z);
      }
   
      // If measurement change is bigger then predefined deviation
      if (coordenadasDiferencia.x + coordenadasDiferencia.y + coordenadasDiferencia.z > $scope.opciones.deviation) {
          $scope.Parar();  // Stop watching because it will start triggering like hell
          console.log('Shake detected'); // shake detected
          setTimeout($scope.Mirar(), 1000);  // Again start watching after 1 sex
   
          // Clean previous measurements after succesfull shake detection, so we can do it next time
          $scope.coordenadasAnteriores = { 
              x: null, 
              y: null, 
              z: null
          }               
   
      } else {
          // On first measurements set it as the previous one
          $scope.coordenadasAnteriores = {
              x: result.x,
              y: result.y,
              z: result.z
          }
      }           
  }   

})

.controller('DashCtrl', function($scope, $cordovaDeviceMotion, $ionicPlatform) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
