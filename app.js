(function () {
    'use strict';
    
    angular.module('NarrowItDownApp', [])
    .controller('NController', NarrowItDownController)
    .directive('foundItems', FoundItems)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
    .service('MenuSearchService', MenuSearchService);

    function FoundItems() {
        var ddo = {
          templateUrl: 'list.html',
          scope:{
            found: '<',
            onRemove: '&',
            errorMessage : '<'
          },
          controller: DirectiveController,
          controllerAs: 'list',
          bindToController: true

        };
        return ddo;
      }


      function DirectiveController() {
        var list = this;
     
    
      }  

NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService){
        var found = this;
        found.currentSearch = "";
        found.items = [];
        found.errorMsg = "";

        found.capture = function(){
        try{
        var promise = MenuSearchService.getMatchedMenuItems(found.currentSearch)
        promise.then(function(success){
        found.items=success;
        if(found.items.length == 0) {
          found.errorMsg = "Item not found! Search again.";
        }
        else{
          found.errorMsg = "";
        }
        });
      }
      catch(error){
        found.items=[];
        found.errorMsg = error.message;
      }
    };

        found.remove = function (itemIndex) {
           found.items.splice(itemIndex, 1);
            if(found.items.length===0){
              found.errorMsg = "All Items Removed. Search Again."
            }
          };
  };

MenuSearchService.$inject = ['$http','ApiBasePath']
function MenuSearchService($http,ApiBasePath) {
var service = this;

service.getMatchedMenuItems = function(searchterm){
  if(searchterm==""){
  throw new Error("Nothing Found!")
  }
    return $http({
      method:"GET",
      url:(ApiBasePath + "/menu_items.json")
    }).then(function (response) {
        var data = response.data;
        var foundItems= [];
        //console.log(service.message)

        for (var i = 0; i < data.menu_items.length; i++) {
            var description = data.menu_items[i].description;
            if (description.toLowerCase().indexOf(searchterm.toLowerCase()) !== -1) {
             foundItems.push(data.menu_items[i])
            }
          }
          

          return foundItems;
       })
       .catch(function (errorResponse) {
         console.log(errorResponse.message);
       });  
}

}

    })();