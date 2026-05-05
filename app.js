angular
  .module("todoApp", [])

  .directive("autoFocus", [
    "$timeout",
    function ($timeout) {
      return {
        restrict: "A",
        link: function (scope, element) {
          $timeout(function () {
            element[0].focus();
          }, 50);
        },
      };
    },
  ])

  .controller("TodoController", [
    "$scope",
    function ($scope) {
      $scope.newTask = "";
      $scope.filter = "all";

      var saved = localStorage.getItem("ng1-todos");
      $scope.tasks = saved
        ? JSON.parse(saved)
        : [
            { text: "Teste 1", completed: true },
            { text: "Teste 2", completed: false },
            { text: "Teste 3", completed: false },
          ];

      function save() {
        localStorage.setItem("ng1-todos", JSON.stringify($scope.tasks));
      }

      $scope.addTask = function () {
        var text = ($scope.newTask || "").trim();
        if (!text) return;
        $scope.tasks.push({ text: text, completed: false, editing: false });
        $scope.newTask = "";
        save();
      };

      $scope.toggleTask = function (task) {
        task.completed = !task.completed;
        save();
      };

      $scope.removeTask = function (task) {
        task.removing = true;
        setTimeout(function () {
          $scope.$apply(function () {
            var idx = $scope.tasks.indexOf(task);
            if (idx !== -1) $scope.tasks.splice(idx, 1);
            save();
          });
        }, 300);
      };

      $scope.editTask = function (task) {
        task.editing = true;
        task.editText = task.text;
      };

      $scope.saveEdit = function (task) {
        var text = (task.editText || "").trim();
        if (text) task.text = text;
        task.editing = false;
        save();
      };

      $scope.cancelEdit = function (task) {
        task.editing = false;
      };

      $scope.clearCompleted = function () {
        $scope.tasks = $scope.tasks.filter(function (t) {
          return !t.completed;
        });
        save();
      };

      $scope.setFilter = function (f) {
        $scope.filter = f;
      };

      $scope.filteredTasks = function () {
        if ($scope.filter === "active")
          return $scope.tasks.filter(function (t) {
            return !t.completed;
          });
        if ($scope.filter === "done")
          return $scope.tasks.filter(function (t) {
            return t.completed;
          });
        return $scope.tasks;
      };

      $scope.remaining = function () {
        return $scope.tasks.filter(function (t) {
          return !t.completed;
        }).length;
      };
      $scope.completed = function () {
        return $scope.tasks.filter(function (t) {
          return t.completed;
        }).length;
      };
    },
  ]);
