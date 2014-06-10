angular.module('hey', [])
  .factory('hey', function ($rootScope) {

    'use strict';

    var listeners = {};

    /**
     * Adds a listener to a given event
     * @param {string} eventName Name of the evening which will be listened for
     * @param {function} callback Function called when the listened event is emitted
     * @param {object} [$scope=$rootScope] Optional scope to which the event will be bound
     */
    function listen(eventName, callback, $scope) {
      if (!listeners[eventName]) {
        listeners[eventName] = [];
      }

      listeners[eventName].push({
        destroy: ($scope || $rootScope).$on(eventName, callback),
        cb: callback
      });

      if ($scope) {
        $scope.$on('$destroy', function () {
          stop(eventName, callback);
        });
      }
    }


    /**
     * Removes listeners from the scope regardless of the scope to which they were added.
     * If a callback is provided it will only remove that single callback, otherwise all
     * listeners listening to the given event will be removed.
     *
     * @param {string} eventName Name of the even which listeners should be removed
     * @param {function} [callback] Optionally a single callback which should be removed
     */
    function stop(eventName, callback) {
      var group = listeners[eventName];
      var i = group.length - 1;

      function shouldBeDeleted(listener) {
        return callback ? listener.cb === callback : true;
      }

      for (; i > -1; i--) {
        if (shouldBeDeleted(group[i])) {
          group.splice(i, 1)[0].destroy();
        }
      }
    }


    /**
     * Add a listener that will only listen once and then will be removed
     * @param {string} eventName Name of the event which is listened to
     * @param {function} callback Function to be called when event is emitted
     * @param {object} [$scope=$rootScope] Optional scope to which the listener is added
     */
    function listenOnce(eventName, callback, $scope) {
      function handler() {
        stop(eventName, handler);
        callback.apply(null, arguments);
      }

      listen(eventName, handler, $scope);
    }

    /**
     * Emits an event in a given scope and bubbles it upwards
     * @see {@link https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit|$emit documentation on angularJS} for more information
     * how emitting an event works in Angular
     * @param {string} eventName Name of the event to emit
     * @param {*} [args] Additional data to be sent with the event
     * @param {object} [$scope=$rootScope] Optional scope in which to emit the event
     * @return {Object} Event object
     */
    function emit(eventName, args, $scope) {
      return ($scope || $rootScope).$emit(eventName, args);
    }

    /**
     * @class Hey
     */
    return {
      listen: listen,
      once: listenOnce,
      stop: stop,
      emit: emit
    };
  });
