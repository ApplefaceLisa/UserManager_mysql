app.controller("listUserController", ["$scope", "$location", "$window", "userMngService", "pagerService", function($scope, $location, $window, userMngService, pagerService) {
    //$scope.users = userMngService.userlist;

    $scope.showInfo = false;
    $scope.users = [];
    $scope.pageSize = 10;

    getUsers();

    function getUsers() {
        userMngService.getUsers("/users")
        .then(function(response) {
            $scope.users = response.data;
            $scope.showInfo = true;
        });
    }

    $scope.searchKey = "";
    $scope.propertyName = "";
    $scope.reverse = false;
    $scope.sortBy = function(name) {
        if (!name)  {
            getUsers();
            return;
        }

        // reverse : true - decrease order, false - increase order
        $scope.reverse = ($scope.propertyName === name) ? !$scope.reverse : false;
        $scope.propertyName = name;
        let order = $scope.reverse ? "DESC" : "ASC";
        userMngService.orderBy(name, order)
        .then(function(response) {
            $scope.users = response.data;
        });
    }

    $scope.search = function(key) {
        console.log("search");
        if (!key)   getUsers();
        userMngService.search(key)
        .then(function(response) {
            $scope.users = response.data;
        });
    }

    $scope.createUser = function($event) {
        $event.preventDefault();
        $location.path("/new");
    }

    $scope.editUser = function($event, userId) {
        $event.preventDefault();
        var url = "/edit/" + userId;
        $location.path(url);
    }

    $scope.deleteUser = function($event, userId) {
        $event.preventDefault();
        userMngService.deleteUser(Number(userId))
        .then(function(res) {
            getUsers();
            $location.path("/");
        }, function(res) {
            $window.alert("User Not Found");
            getUsers();
            $location.path("/");
        });
    }
}]);