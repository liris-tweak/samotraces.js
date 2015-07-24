module.exports = function(grunt) {
  "use strict";
  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 8080,
          hostname: "*",
          keepalive: true
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
      app: {
        options: {
          external: [
            "jquery"
          ],
          browserifyOptions: {
            debug: true,
            standalone: "Samotraces" // expose the lib as Node/CJS, AMD, Glob --> TODO REMOVE ME
          }
        },
        src: "src/main.js",
        dest: "dist/samotraces.js"
      },
      vendor: {
        options: {
          alias: [
            "jquery"
          ]
        },
        external: null,
        src: ".",
        dest: "dist/vendors.js"
      }
    },
    watch: {
      browserify: {
        files: [
          "src/**/*.js"
        ],
        tasks: ["browserify:app"]
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
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks('grunt-jsdoc');
  // grunt.registerTask("default", ["jshint", "jscs", "browserify", "connect", "watch"]);
  grunt.registerTask("default", ["jshint", "jsdoc", "browserify:vendor", "browserify:app", "connect", "watch"]);
};
