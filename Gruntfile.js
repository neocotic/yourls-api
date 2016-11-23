/*
 * Copyright (C) 2016 Alasdair Mercer
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
  var commonjs
  var nodeResolve
  var semver = require('semver')
  var uglify

  var bannerLarge = [
    '/*',
    ' * Copyright (C) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>',
    ' *',
    ' * Permission is hereby granted, free of charge, to any person obtaining a copy',
    ' * of this software and associated documentation files (the "Software"), to deal',
    ' * in the Software without restriction, including without limitation the rights',
    ' * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell',
    ' * copies of the Software, and to permit persons to whom the Software is',
    ' * furnished to do so, subject to the following conditions:',
    ' *',
    ' * The above copyright notice and this permission notice shall be included in all',
    ' * copies or substantial portions of the Software.',
    ' *',
    ' * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR',
    ' * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,',
    ' * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE',
    ' * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER',
    ' * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,',
    ' * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE',
    ' * SOFTWARE.',
    ' */'
  ].join('\n')
  var bannerSmall = '/*! YOURLS API v<%= pkg.version %> | (C) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> | MIT License */'

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      all: {
        files: [ 'src/**/*.js' ],
        tasks: [ 'test' ]
      }
    }
  })

  var buildTasks = [ 'compile' ]
  var compileTasks = []
  var testTasks = [ 'compile' ]

  if (semver.satisfies(process.version, '>=0.12')) {
    commonjs = require('rollup-plugin-commonjs')
    nodeResolve = require('rollup-plugin-node-resolve')
    uglify = require('rollup-plugin-uglify')

    compileTasks.push('clean', 'rollup')

    grunt.config.merge({
      clean: {
        build: [ 'dist/**' ]
      },

      rollup: {
        umdDevelopment: {
          options: {
            format: 'umd',
            moduleId: 'yourls-api',
            moduleName: 'yourls',
            sourceMap: true,
            sourceMapRelativePaths: true,
            banner: bannerLarge,
            plugins: function() {
              return [
                nodeResolve({
                  browser: true,
                  jsnext: true,
                  main: true
                }),
                commonjs()
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
            banner: bannerSmall,
            plugins: function() {
              return [
                nodeResolve({
                  browser: true,
                  jsnext: true,
                  main: true
                }),
                commonjs(),
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
      }
    })

    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-rollup')
  } else {
    grunt.log.writeln('"clean" and "rollup" tasks are disabled because Node.js version is <0.12! Please consider upgrading Node.js...')
  }

  if (semver.satisfies(process.version, '>=4')) {
    compileTasks.unshift('eslint')

    grunt.config.set('eslint', {
      target: [ 'src/**/*.js' ]
    })

    grunt.loadNpmTasks('grunt-eslint')
  } else {
    grunt.log.writeln('"eslint" task is disabled because Node.js version is <4! Please consider upgrading Node.js...')
  }

  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', [ 'build' ])
  grunt.registerTask('build', buildTasks)
  grunt.registerTask('compile', compileTasks)
  grunt.registerTask('test', testTasks)
}
