angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('Bluetooth', function($q) {
    // Might use a resource here that returns a JSON array
    var connected;
    return {
      devices: [],
      connected: function(){
        return connected;
      },
      messages: [],
      scan: function() {
        var that = this;
        var deferred = $q.defer();

        that.devices.length = 0;

        // disconnect the connected device (hack, device should disconnect when leaving detail page)
        if (connected) {
          var id = connected.id;
          bluetoothSerial.disconnect(connected.id, function() {
            console.log("Disconnected " + id);
          });
          connected = null;
        }

        bluetoothSerial.list(  /* scan for all services */
          function(peripheral){
            that.devices.push(peripheral[0]);
          },
          function(error){
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
      },
      connect: function(deviceId) {
        var that = this;
        var deferred = $q.defer();
        console.log("DeviceID: " + deviceId);
        that.messages = [];
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
      },
      disconnect: function() {
        bluetoothSerial.disconnect(
          function success() {
            console.log("Disconnect Successful");
          },
          function error() {
            console.log("Disconnect ERROR");
          });
      },
      sendData: function(text) {
        var that = this;
        console.log("TEXT: "+ text);
        //bluetoothSerial.write(text, function() {
        that.messages.push({name:text});
        bluetoothSerial.write(text + "\n",
          function success() {
            console.log("Success");
            bluetoothSerial.readUntil('\n',function success(data) {
            //bluetoothSerial.read(function success(data) {
              alert("data: " + data);
              that.messages.push({name:data});
            }, function error() {
              console.log("Failed read data to Bluetooth peripheral");
            });
        },
          function error() {
          console.log("Failed writing data to Bluetooth peripheral");
        });
      }
    };
  });
