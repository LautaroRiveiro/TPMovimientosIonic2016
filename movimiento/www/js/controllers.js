angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaDeviceMotion, $ionicPlatform, $cordovaNativeAudio, $timeout) {
  
  //--------------------- FUNCIONES DEL NATIVE AUDIO -------------------------//
    $ionicPlatform.ready(function() {
        if( window.plugins && window.plugins.NativeAudio )
        {
            window.plugins.NativeAudio.preloadSimple( 'arriba', 'audio/arriba.mp3',
                function(msg){
                    console.log( 'Carga OK: ' + msg );
                },
                function(msg){
                    console.log( 'error: ' + msg );
                });
            window.plugins.NativeAudio.preloadSimple( 'derecha', 'audio/derecha.mp3',
                function(msg){
                    console.log( 'Carga OK: ' + msg );
                },
                function(msg){
                    console.log( 'error: ' + msg );
                });
            window.plugins.NativeAudio.preloadSimple( 'izquierda', 'audio/izquierda.mp3',
                function(msg){
                    console.log( 'Carga OK: ' + msg );
                },
                function(msg){
                    console.log( 'error: ' + msg );
                });
            window.plugins.NativeAudio.preloadSimple( 'abajo', 'audio/abajo.mp3',
                function(msg){
                    console.log( 'Carga OK: ' + msg );
                },
                function(msg){
                    console.log( 'error: ' + msg );
                });
        }
    });

  //--------------------- FUNCIONES DEL DEVICE MOTION ------------------------//
    $scope.resultado;
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
    $scope.opciones = {frequency: 1000, deviation: 25};

  //Start Watching method
  $scope.Mirar = function() {
   
      // Device motion configuration
      $scope.watch = $cordovaDeviceMotion.watchAcceleration($scope.opciones);
   
      // Device motion initilaization
      $scope.watch.then(null, function(error) {
          console.log('Error');
      },function(result) {
          // Set current data  
          $scope.coordenadas.x = Math.round(result.x*100);
          $scope.coordenadas.y = Math.round(result.y*100);
          $scope.coordenadas.z = Math.round(result.z*100);
          $scope.coordenadas.timestamp = result.timestamp;
          // Detecta shake  
          $scope.Detectar(result);
          //Evalúo quién se movió
          $scope.Evaluar();
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

  $scope.Evaluar = function(){
      if(Math.abs($scope.coordenadas.x)>Math.abs($scope.coordenadas.y)){
          //Fue más relevante el movimiento al costado
          if (Math.abs($scope.coordenadas.x)>700){
              //Fue relevante
              if($scope.coordenadas.x > 0){
                  //Giré a la izquierda
                  $scope.coordenadas.resultado = "Izquierda";
                  $scope.imagenResultado = "izquierda.jpg";
                  try{
                      window.plugins.NativeAudio.play('izquierda');    
                  }
                  catch (err){
                      console.log("No se puede ejecutar cordovaNativeAudio en la PC");
                  }
              }
              else{
                  //Giré a la derecha
                  $scope.coordenadas.resultado = "Derecha";
                  $scope.imagenResultado = "derecha.png";
                  try{
                      window.plugins.NativeAudio.play("derecha");    
                  }
                  catch (err){
                      console.log("No se puede ejecutar cordovaNativeAudio en la PC");
                  }
              }
          }
          else{
            $scope.imagenResultado = "centro.png";
            $scope.coordenadas.resultado = "";
          }
      }
      else{
          //Fue más relevante el movimiento vertical
          if (Math.abs($scope.coordenadas.y)>700){
              //Fue relevante
              if($scope.coordenadas.y > 0){
                  //Giré hacia abajo
                  $scope.coordenadas.resultado = "Abajo";
                  $scope.imagenResultado = "abajo.png";
                  try{
                      window.plugins.NativeAudio.play('abajo');    
                  }
                  catch (err){
                      console.log("No se puede ejecutar cordovaNativeAudio en la PC");
                  }
              }
              else{
                  //Giré hacia arriba
                  $scope.coordenadas.resultado = "Arriba";
                  $scope.imagenResultado = "arriba.jpg";
                  try{
                      window.plugins.NativeAudio.play('arriba');    
                  }
                  catch (err){
                      console.log("No se puede ejecutar cordovaNativeAudio en la PC");
                  }
              }
          }
          else{
            $scope.imagenResultado = "centro.png";
            $scope.coordenadas.resultado = "";
          }
      }
  };


})

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

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
