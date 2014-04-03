module.exports = function (grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);


  grunt.initConfig({

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      all: ['hey.js'],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
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
    },

    bump: {
      options: {
        files: ['bower.json', 'package.json'],
        commit: false
      }
    }

  });


  grunt.registerTask('test', ['karma', 'jshint']);

  grunt.registerTask('dist', [
    'test',
    'clean:dist',
    'ngmin:dist',
    'uglify:dist'
  ]);

  grunt.registerTask('release', ['dist', 'bump']);

};
