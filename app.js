(function() {
    'use strict';

    /*angular.module('SmartParkingSystem', []).service('ParkingStatusService', ParkingStatusService).controller('ParkingStatus', ParkingStatus);*/
	
	angular.module('SmartParkingSystem',['kmqtt','angularjs-gauge']).
			controller('parkingStatus', function($scope, kmqtt) {
				$scope.p1=false;
				$scope.p2=false;
				$scope.p3=false;
				$scope.p4=false;
				$scope.free=0;
				$scope.totalParking=4;
				$scope.thresholdOptions = {
							'0': { color: 'green' },
							'50': {color: 'orange' },
							'75': {color: 'red'}
					   };


				var client = kmqtt.connect('ws://127.0.0.1:8880');
				console.log("created client",client);
			
					client.on("message", function(topic, payload) {
					
							
							console.log(topic, payload.toString());
							var recentParkingStatusChanged=topic.substr(topic.lastIndexOf('/')+1,topic.length);
							console.log("Parking:"+recentParkingStatusChanged);
							switch(recentParkingStatusChanged){
								case 'p1':
								    //1== free,true , 0= occupied, false
									$scope.p1=(payload.toString()=='1')?true:false;
									
									break;
								case 'p2':
									$scope.p2=(payload.toString()=='1')?true:false;
									break;
								case 'p3':
									$scope.p3=(payload.toString()=='1')?true:false;
									break;
								case 'p4':
									$scope.p4=(payload.toString()=='1')?true:false;
									break;	
							}
							$scope.free=0;
							$scope.free+=($scope.p1)?1:0;
							$scope.free+=($scope.p2)?1:0;
							$scope.free+=($scope.p3)?1:0;
							$scope.free+=($scope.p4)?1:0;
							$scope.$apply();
											
					});					
				
				


				client.subscribe('sensors/esp8266/parking/#');
				//client.publish('sensors/esp8266/parking/', 'a test message');
			});
			
	
	
	
    /*ParkingStatus.$inject = ['ParkingStatusService'];
    function ParkingStatus(ParkingStatusService) {
        var status = this;
        //search.searchTerm="";
        status.found = [];
        status.isButtonClicked = false;

        //logic narrowItDown button
        status.refresh = function() {
            //get matched item from service
            ParkingStatusService.getParkingsStatus().then(function(result) {
                status.found =JSON.stringify(result);
            }).catch(function(error) {
                status.isButtonClicked = true;
                console.log("some error occured at controller");
            });
        }

        return status;
    }

    ParkingStatusService.$inject = ['$http', '$q'];
    //service definition
    function ParkingStatusService($http, $q) {
        var service = this;

        service.getParkingsStatus = function() {
            var deferred = $q.defer();
            //service.searchTerm=searchTerm;
            $http({
                url: "http://demo6742418.mockable.io/parkingsStatus",
                method: 'GET'
            }).then(function(result) {
                var parkingsStatus = result.data.parkingStatus;
                //logic to find match item list array
                //service.parkingStatus=parkingStatus.filter(isMatchFound);
                deferred.resolve(parkingsStatus);
            }).catch(function(error) {
                deferred.reject("Some Error occurred");
            });
            return deferred.promise;
        }

    }*/
	
	
	

}());
