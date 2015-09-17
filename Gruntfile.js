module.exports = function(grunt) {
  "use strict";
  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 8080,
          hostname: "*",
          livereload: true
        }
      }
    },
    jshint: {
      all: ["src/**/*.js", "demo/*.html", "src/*.js"],
      options : {
        "extract": "auto",
        "node": true,
        "browser": true,
        "devel": true,
        "curly": true,
        "bitwise": true,
        "eqeqeq": true,
        "forin": true,
        "freeze": true,
        "funcscope": true,
        "futurehostile": true,
        "latedef": true,
        "nocomma": true,
        "nonbsp": true,
        "notypeof": true,
        "shadow": true,
        "undef": true,
        "singleGroups": false,
        "unused": true,
        "nonew": true,
        "strict": true
      }
    },
    browserify: {
      distDebug: {
        options: {
          external: [
            "jquery",
            "jquery-mousewheel",
            "d3"
          ],
          browserifyOptions: {
            debug: true,
            standalone: "Samotraces"
          }
        },
        src: "src/main.js",
        dest: "dist/samotraces-debug.js"
      },
      distNoDebug: {
        options: {
          external: [
            "jquery",
            "jquery-mousewheel",
            "d3"
          ],
          browserifyOptions: {
            debug: false,
            standalone: "Samotraces"
          }
        },
        src: "src/main.js",
        dest: "dist/samotraces.js"
      },
      coreDebug: {
        options: {

          browserifyOptions: {
            debug: true,
            standalone: "Samotraces"
          }
        },
        src: "src/core.js",
        dest: "dist/samotraces-core-debug.js"
      },
      vendor: {
        options: {
          alias: [
            "jquery",
            "jquery-mousewheel",
            "d3",
          ]
        },
        external: null,
        src: ".",
        dest: "dist/vendors.js"
      },
    
    },
    watch: {
      browserify: {
        files: [
          "src/**/*.js"
        ],
        tasks: ["browserify:distDebug", "browserify:distNoDebug", "browserify:distNoDebug", "browserify:coreDebug"]
      }
    },
    uglify: {
      myTarget: {
        files: {
          'dist/samotraces-min.js': ['dist/samotraces.js'],
          'dist/vendors-min.js': ['dist/vendors.js'],
        }
      }
    },
    jscs: {
      src: "src/**/*.js",
      options: {
        config: ".jscsrc",
        verbose: true, // If you need output with rule names http://jscs.info/overview.html#verbose
        requireCurlyBraces: [ "if" ]
      }
    },
    jsdoc : {
      dist : {
        jsdoc: './node_modules/.bin/jsdoc',
        options: {
          destination: 'doc',
          configure: 'conf-jsdoc.json',
        }
      }
    }
  });
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.registerTask("default", ["jshint", "jsdoc", "browserify:distDebug", "browserify:distNoDebug", "browserify:distNoDebug", "browserify:coreDebug","browserify:vendor", "uglify"]);
  grunt.registerTask("serve", ["browserify:distDebug", "browserify:distNoDebug", "browserify:distNoDebug", "browserify:coreDebug","browserify:vendor", "uglify", "connect", "watch"]);
};
