module.exports = function(grunt) {
  "use strict";
  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 8080,
          hostname: "*"
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
        "singleGroups": true,
        "unused": true,
        "nonew": true,
        "strict": true
      }
    },
    browserify: {
      app: {
        options: {
          external: [
          ],
          browserifyOptions: {
            debug: true,
            standalone: "Samotraces" // expose the lib as Node/CJS, AMD, Glob --> TODO REMOVE ME
          }
        },
        src: "src/main.js",
        dest: "dist/samotraces.js"
      }
    },
    watch: {
      browserify: {
        files: [
          "src/**/*.js"
        ],
        tasks: ["browserify:app"]
      }
    }
  });
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.registerTask("default", ["jshint", "browserify", "connect", "watch"]);
  //grunt.registerTask("default", ["browserify", "connect", "watch"]);
};
