(function() {
  'use strict';

  angular.module('SmartParkingSystem',[])
  .service('MenuSearchService', MenuSearchService)
  .controller('NarrowItDownController',  NarrowItDownController)
  .directive('foundItems',FoundItemsDirective);

  //directive definition
  function FoundItemsDirective(){
    var ddo={
       templateUrl:'foundItemDirective.html',
       scope:{
             found:'<',
             onRemove:'&'
       },
      controller :FoundItemsDirectiveController,
      controllerAs : 'fid',
      bindToController : true
    };
    return ddo;
  }

  function FoundItemsDirectiveController(){
    var directiveCtrl=this;

    console.log('directive ::fid.found.length::',directiveCtrl.found.length);

  }

  NarrowItDownController.$inject=['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var search=this;
    search.searchTerm="";
    search.found=[];
    search.isButtonClicked=false;

    //logic narrowItDown button
    search.narrowItDown=function(){


      //get matched item from service
      MenuSearchService.getMatchedMenuItems(search.searchTerm).then(function(result){
        search.found=result;
        search.isButtonClicked=true;
      })
      .catch(function(error){
        search.isButtonClicked=true;
        console.log("some error occured at controller");
      });
    }

    //remove item from found array
    search.remove=function(index){
      search.found.splice(index,1);
    }
    return search;
  }

  MenuSearchService.$inject=['$http','$q'];
  //service definition
  function MenuSearchService($http, $q){
      var service=this;

      service.getMatchedMenuItems=function(searchTerm){
          var deferred = $q.defer();
          service.searchTerm=searchTerm;
          $http({
               url : "https://davids-restaurant.herokuapp.com/menu_items.json?searchTerm",
               method: 'GET'
         }).then(function (result) {
               var menuItems= result.data.menu_items;
               //logic to find match item list array
               service.founditems=menuItems.filter(isMatchFound);
               deferred.resolve(service.founditems);
         })
         .catch(function(error){
           deferred.reject("Some Error occurred");
         });
         return deferred.promise;
      }

      var isMatchFound=function(value){
          return (service.searchTerm.length!=0 && value.description.toLowerCase().indexOf(service.searchTerm)>-1)?true:false;
      }
}

}());
