/*
 * Copyright (C) 2017 Alasdair Mercer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

module.exports = function(grunt) {
  var nodeResolve = require('rollup-plugin-node-resolve')
  var uglify = require('rollup-plugin-uglify')

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: [ 'dist/**' ]
    },

    eslint: {
      target: [ 'src/**/*.js' ]
    },

    rollup: {
      umdDevelopment: {
        options: {
          format: 'umd',
          moduleId: 'yourls-api',
          moduleName: 'yourls',
          sourceMap: true,
          sourceMapRelativePaths: true,
          plugins: function() {
            return [
              nodeResolve({
                browser: true,
                jsnext: true,
                main: true
              })
            ]
          }
        },
        files: {
          'dist/yourls.js': 'src/yourls.js'
        }
      },
      umdProduction: {
        options: {
          format: 'umd',
          moduleId: 'yourls-api',
          moduleName: 'yourls',
          sourceMap: true,
          sourceMapRelativePaths: true,
          banner: '/*! YOURLS API v<%= pkg.version %> | (C) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> | <%= pkg.license %> License */',
          plugins: function() {
            return [
              nodeResolve({
                browser: true,
                jsnext: true,
                main: true
              }),
              uglify({
                output: {
                  comments: function(node, comment) {
                    return comment.type === 'comment2' && /^\!/.test(comment.value)
                  }
                }
              })
            ]
          }
        },
        files: {
          'dist/yourls.min.js': 'src/yourls.js'
        }
      }
    },

    watch: {
      all: {
        files: [ 'src/**/*.js' ],
        tasks: [ 'eslint' ]
      }
    }
  })

  require('load-grunt-tasks')(grunt)

  grunt.registerTask('default', [ 'ci' ])
  grunt.registerTask('build', [ 'eslint', 'clean:build', 'rollup' ])
  grunt.registerTask('ci', [ 'eslint', 'clean', 'rollup' ])
  grunt.registerTask('test', [ 'eslint' ])
}
