(function() {
    'use strict';

    angular.module('SmartParkingSystem', []).service('ParkingStatusService', ParkingStatusService).controller('ParkingStatus', ParkingStatus);

    ParkingStatus.$inject = ['ParkingStatusService'];
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

    }

}());
