module.exports = function (grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);


  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      all: ['hey.js']
    },

    clean: {
      dist: '.tmp'
    },

    ngmin: {
      dist: {
        files: {
          '.tmp/hey.js': 'hey.js'
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'hey.min.js': '.tmp/hey.js'
        }
      }
    }

  });


  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('dist', [
    'test',
    'clean:dist',
    'ngmin:dist',
    'uglify:dist'
  ]);

};
