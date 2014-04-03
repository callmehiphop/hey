describe('hey', function () {

  'use strict';

  var hey;
  var $rootScope;


  beforeEach(function () {
    module('hey');

    inject(function ($injector) {
      hey = $injector.get('hey');
      $rootScope = $injector.get('$rootScope');
    });
  });


  describe('#listen()', function () {

    it('should call $rootScope.$on by default', function () {
      spyOn($rootScope, '$on');

      hey.listen('fake.event', angular.noop);

      expect($rootScope.$on).toHaveBeenCalledWith('fake.event', angular.noop);
    });

    it('should tie the event to a child scope if one is passed in', function () {
      var $scope = $rootScope.$new();

      spyOn($scope, '$on');

      hey.listen('other.event', angular.noop, $scope);

      expect($scope.$on).toHaveBeenCalledWith('other.event', angular.noop);
      expect($scope.$on.mostRecentCall.args[0]).toBe('$destroy');
    });

    it('should execute the event handler when an event is dispatched', function () {
      var handler = jasmine.createSpy();

      hey.listen('fake.event', handler);
      $rootScope.$emit('fake.event');

      expect(handler).toHaveBeenCalled();
    });

  });


  describe('#stop()', function () {

    it('should remove a lonely event handler when one is supplied', function () {
      var handler = jasmine.createSpy();

      hey.listen('fake.event', handler);
      $rootScope.$emit('fake.event');
      hey.stop('fake.event', handler);

      expect(handler.callCount).toBe(1);
    });

    it('should remove all event handlers when one is not supplied', function () {
      var handler = jasmine.createSpy();
      var otherHandler = jasmine.createSpy();

      hey.listen('fake.event', handler);
      hey.listen('fake.event', otherHandler);
      hey.stop('fake.event');
      $rootScope.$emit('fake.event');

      expect(handler.callCount).toBe(0);
      expect(otherHandler.callCount).toBe(0);
    });

  });


  describe('#once()', function () {

    it('should bind an event and after the event is dispatched it should unbind', function () {
      var handler = jasmine.createSpy();

      hey.once('fake.event', handler);
      $rootScope.$emit('fake.event');
      $rootScope.$emit('fake.event');

      expect(handler.callCount).toBe(1);
    });

  });

});
