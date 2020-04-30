(function () {
    'use strict';
    
    angular.module('NarrowItDownApp', [])
    .controller('NController', NarrowItDownController)
    .directive('testItem', TestItems)
    .directive('foundItem', FoundItems)
    .service('MenuSearchService', MenuSearchService);
 
    function TestItems() {
        var ddo = {
     
          templateUrl: 'test.html'
          /*
          scope: {
            items: '<',
            removeItem: '&'
          },
          controller: NarrowItDownController,
          controllerAs: 'list',
          bindToController: true
          */
        };
        return ddo;
      }

    function FoundItems() {
        var ddo = {
          templateUrl: 'list.html',
        
       
         
        };
        return ddo;
      }
    

NarrowItDownController.$inject = ['MenuSearchService','$scope'];
    function NarrowItDownController(MenuSearchService,$scope){
        var list = this;
        $scope.found = "";
        list.currentSearch = "";
        list.searchFor= "";
    

        list.capture = function(){
        list.searchFor = list.currentSearch;
        MenuSearchService.getMatchedMenuItems(list.searchFor).then(function(success){
        $scope.found=success;
        })
        
    }

        list.check = function(){
            console.log($scope.found[0]);
        }
        list.removeItem = function (itemIndex) {
            $scope.found.splice(itemIndex, 1);
          };
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
   var found = [];
    var promise = service.getMenu();

    return promise.then(function (response) {
        service.message = response.data;
        //console.log(service.message)

        for (var i = 0; i < service.message.menu_items.length; i++) {
            var description = service.message.menu_items[i].description;
            if (description.toLowerCase().indexOf(serachterm) !== -1) {
             found.push(service.message.menu_items[i])
            }
          }
          

          return found;
       })
       .catch(function (error) {
         console.log("Something went terribly wrong.");
       });
 
    };
}

}

    ) ();