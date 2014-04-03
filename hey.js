angular.module('hey', [])
  .factory('hey', ['$rootScope',
    function ($rootScope) {

      'use strict';


      // map of the guilty!
      var listeners = {};



      /**
       * Filter polyfill of sorts
       * @param {array} array!
       * @param {function} callback
       * @return {array} filtered array
       */
      function filter (arr, cb) {
        if (arr.filter) {
          return arr.filter(cb);
        }

        var results = [];

        angular.forEach(arr, function (listener) {
          if (cb(listener)) {
            results.push(listener);
          }
        });

        return results;
      }



      /**
       * Creates a listener object for a particular event
       * @param {string} event
       * @param {function} event handler
       * @param {object} $scope to be used (optional)
       */
      function listen (event, cb, scope) {
        if (!listeners[event]) {
          listeners[event] = [];
        }

        listeners[event].push({
          destroy: (scope || $rootScope).$on(event, cb),
          cb: cb
        });

        if (scope) {
          scope.$on('destroy', function () {
            stop(event, cb);
          });
        }
      }



      /**
       * Destroys listeners, if a callback is specified it it will
       * attempt to match that particular callback otherwise it'll
       * destroy all handlers matching the specified event
       * @param {string} event name
       * @param {function} callback
       */
      function stop (event, cb) {
        var group = listerners[event];
        var matches;

        if (!cb) {
          matches = group;
        } else {
          matches = filter(group, function (listener) {
            return listener.cb === cb;
          });
        }

        angular.forEach(matches, function (listener) {
          listener.destroy();
        });
      }



      /**
       * Binds a listener that will only execute one time and
       * then the listener gets destroyed
       * @param {string} event name
       * @param {function} callback
       * @param {object} $scope to be used (optional)
       */
      function listenOnce (event, cb, scope) {
        function handler () {
          stop(event, handler);
          cb.apply(null, arguments);
        }

        listen(event, handler, scope);
      }



      return {
        listen: listen,
        once: listenOnce,
        stop: stop
      };

    }
  ]);