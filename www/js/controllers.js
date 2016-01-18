angular.module('starter.controllers', [])

/**
 * Dashboard Controller
 */
  .controller('DashCtrl', function ($scope) {
  })

/**
 * Chats Controller
 */
  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

/**
 * Bluetooth Controller
 */
  .controller('BluetoothCtrl', function ($scope, Bluetooth) {

    //Bluetooth.scan();
    //var devices =[];
    var connected;
    $scope.bluetooths = [];
    $scope.$apply($scope.scan = function () {
        var deferred = $q.defer();
        $scope.bluetooths = [];
        //devices.length = 0;

        // disconnect the connected device (hack, device should disconnect when leaving detail page)
        if (connected) {
          var id = connected.id;
          bluetoothSerial.disconnect(connected.id, function() {
            console.log("Disconnected " + id);
          });
          connected = null;
        }

        bluetoothSerial.list(  /* scan for all services */
          function(devices) {
            alert("devices: " + devices);
            devices.forEach(function(device) {
              console.log(device.id);
              $scope.bluetooths.push(device);
            })},
          function(error){
            console.log("ERROR: bluetoothSerial.list()");
            deferred.reject(error);
          });

        // stop scan after 5 seconds
        /*setTimeout(bluetoothSerial.stopScan, 5000,
         function() {
         deferred.resolve();
         },
         function() {
         console.log("stopScan failed");
         deferred.reject("Error stopping scan");
         }
         );*/

        return deferred.promise;
    }
    );
    $scope.connect = function(deviceId){
      //var that = this;
      var deferred = $q.defer();
      console.log("DeviceID: " + deviceId);
      //$scope.messages = [];
      bluetoothSerial.connect(deviceId,
        function success(peripheral) {
          //console.log("peripheral: " + peripheral);
          connected = peripheral;
          //alert("peripheral: " + connected);
          deferred.resolve(peripheral);

          console.log("Connect");
          /*bluetoothSerial.subscribe('\n', function (data) {
           console.log("DataOnData: " + data);
           that.messages.push({name:data});
           }, function () {
           console.log("Subscribe ERROR");
           });*/

        },
        function error(reason) {
          deferred.reject(reason);
          console.log("Connect ERROR");
        }
      );
      return deferred.promise;
    };
    //$scope.bluetooths = Bluetooth.devices;
    $scope.settings = {active: true};
  })

  .controller('BluetoothDetailCtrl', function ($scope, $stateParams, Bluetooth, $location) {
    console.log("$stateParams: " + $stateParams);
    Bluetooth.connect($stateParams.bluetoothId);
    $scope.bluetooth = Bluetooth.connected;

    /*$scope.sendData = function (message) {

      console.log("Message: " + message);
      Bluetooth.sendData(message);
      $scope.message = "";
    };*/

    $scope.sendData = function (text){
      $scope.messages.push({name:text});
      bluetoothSerial.write(text + '\n',
        function success() {
          console.log("Success");
          bluetoothSerial.readUntil('\n',function success(data) {
            $scope.$apply(function () {
              $scope.messages.push({name:data});
            });
          }, function error() {
            console.log("Failed read data to Bluetooth peripheral");
          });
        },
        function error() {
          console.log("Failed writing data to Bluetooth peripheral");
        });
    };
    $scope.messages = Bluetooth.messages;
    $scope.disconnect = function () {
      Bluetooth.disconnect();
      $location.path("tab-bluetooth");
    }
  })

/**
 * Account Controller
 */
  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
