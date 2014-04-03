<img src="/navi.jpg" align="right">

hey!
----

> pub/sub abstraction layer for AngularJS to make managing your events easier

hey aims to make dealing with events in AngularJS a little bit easier when you
require more functionality like destroying event listeners or only listening for
a particular event one time


#### listening for events
-------------------------
Listening for events is pretty straight forward, simply use the `listen()` method
and pass in the name of the event and an event handler to be called.

```javascript
angular.module('example', ['hey'])
  .controller('ExampleCtrl', function (hey) {

    function doSomething () {
      console.log('something happened!');
    }

    hey.listen('contrived.event', doSomething);

  });
```

`listen()` simply wraps `$rootScope.$on` so you can also use hey to manage native
angular events as well.

If you'd prefer not to use `$rootScope` and to use a child `$scope` instead,
you can pass in a `$scope` as a third optional argument.

```javascript
angular.module('example', ['hey'])
  .controller('ExampleCtrl', function (hey, $scope) {

    function doSomething () {
      console.log('something happened!');
    }

    hey.listen('contrived.event', doSomething, $scope);

  });
```


#### destroying events
----------------------
One of the more tedious things about using angular's native event system is
when you want to destroy an event. This is the real problem hey aims to solve,
it allows you to easily destroy events following the same patterns used in
popular libraries like jQuery.

```javascript
angular.module('example', ['hey'])
  .controller('DestroyExampleCtrl', function (hey, $scope) {

    function doSomething () {
      console.log('something happened!');
    }

    hey.listen('contrived.event', doSomething);

    $scope.destroyEvent = function () {
      hey.stop('contrived.event', doSomething);
    };

  });
```

You can also use it to remove any and all handlers associated with a particular
event by simply not passing in an event handler

```javascript
angular.module('example', ['hey'])
  .controller('DestroyExampleCtrl', function (hey, $scope) {

    function doSomething () {
      console.log('something happened!');
    }

    function doSomethingElse () {
      console.log('something else happened!');
    }

    hey.listen('contrived.event', doSomething);
    hey.listen('contrived.event', doSomethingElse)


    $scope.destroyAllTheThings = function () {
      hey.stop('contrived.event');
    };

  });
```

#### once
---------

One convenience I miss from libraries like jQuery/Backbone is the ability to
specify that a listener should only listen one time then die

```javascript
angular.module('example', ['hey'])
  .controller('OnceCtrl', function (hey) {

    hey.once('contrived.event', function () {
      console.log('There can only be one!');
    });

  });
```
