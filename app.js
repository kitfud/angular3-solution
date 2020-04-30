(function () {
    'use strict';
    
    angular.module('NarrowItDownApp', [])
    .controller('NController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive("foundItems",FoundItems)

    function FoundItems() {
        var ddo = {
          template: '{{found}}'
        };
        return ddo;
      }  

NarrowItDownController.$inject = ['MenuSearchService','$scope'];
    function NarrowItDownController(MenuSearchService,$scope){
        var list = this;
        $scope.found = "hello";
       
    
        list.currentSearch = "";
        list.searchFor= "";
        list.found = "";

        list.capture = function(){
        list.searchFor = list.currentSearch;
        MenuSearchService.getMatchedMenuItems(list.searchFor).then(function(success){
        $scope.found=success;
        })
        
    }

        list.check = function(){
            console.log(list.found);
        }
  
  };

MenuSearchService.$inject = ['$http']
function MenuSearchService($http) {
var service = this;

service.getMenu = function(){
    var response = $http({
        method: "GET",
        url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
      });
      return response;
}

service.getMatchedMenuItems = function(serachterm){
   var foundItems = [];
    var promise = service.getMenu();

    return promise.then(function (response) {
        service.message = response.data;
        //console.log(service.message)

        for (var i = 0; i < service.message.menu_items.length; i++) {
            var description = service.message.menu_items[i].description;
            if (description.toLowerCase().indexOf(serachterm) !== -1) {
             foundItems.push(service.message.menu_items[i])
            }
          }
          
          return foundItems;
       })
       .catch(function (error) {
         console.log("Something went terribly wrong.");
       });
 
    };
}

}

    ) ();