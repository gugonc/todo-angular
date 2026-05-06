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
    "$http",
    function ($scope, $http) {
      var API = "https://demo-production-ffd8.up.railway.app/api/tasks";

      $scope.newTask = "";
      $scope.filter = "all";
      $scope.tasks = [];

      // Buscar tarefas ao carregar a página
      function loadTasks() {
        $http.get(API).then(function (res) {
          $scope.tasks = res.data;
        });
      }
      loadTasks();

      // Adicionar
      $scope.addTask = function () {
        var text = ($scope.newTask || "").trim();
        if (!text) return;
        $http.post(API, { text: text }).then(function (res) {
          $scope.tasks.push(res.data);
          $scope.newTask = "";
        });
      };

      // Marcar como feita / desfazer
      $scope.toggleTask = function (task) {
        $http.patch(API + "/" + task.id).then(function (res) {
          task.completed = res.data.completed;
        });
      };

      // Remover
      $scope.removeTask = function (task) {
        task.removing = true;
        setTimeout(function () {
          $scope.$apply(function () {
            $http.delete(API + "/" + task.id).then(function () {
              var idx = $scope.tasks.indexOf(task);
              if (idx !== -1) $scope.tasks.splice(idx, 1);
            });
          });
        }, 300);
      };

      // Editar (só local — salva no blur/enter)
      $scope.editTask = function (task) {
        task.editing = true;
        task.editText = task.text;
      };

      $scope.saveEdit = function (task) {
        var text = (task.editText || "").trim();
        if (text) task.text = text;
        task.editing = false;
      };

      $scope.cancelEdit = function (task) {
        task.editing = false;
      };

      // Limpar concluídas
      $scope.clearCompleted = function () {
        var done = $scope.tasks.filter(function (t) {
          return t.completed;
        });
        done.forEach(function (task) {
          $http.delete(API + "/" + task.id);
        });
        $scope.tasks = $scope.tasks.filter(function (t) {
          return !t.completed;
        });
      };

      // Filtros
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
