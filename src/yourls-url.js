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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE0
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { jsonp } from './request/jsonp'

/**
 * Provides the ability to lookup information related to the specified shortened <code>url</code>.
 *
 * @param {string} url - the shortened URL (or its keyword) to be used
 * @constructor
 * @protected
 */
export function URL(url) {
  /**
   * Either the shortened URL or its keyword for this {@link URL}.
   *
   * @public
   * @type {string}
   */
  this.url = url
}

/**
 * Retrieves the original ("long") URL for this shortened {@link URL}.
 *
 * @param {Function} callback - the callback function to be called with the result
 * @return {URL} A reference to this {@link URL} for chaining purposes.
 * @public
 */
URL.prototype.expand = function(callback) {
  var data = {
    action: 'expand',
    shorturl: this.url
  }

  jsonp(data, [ 'keyword', 'longurl', 'shorturl' ], callback)

  return this
}

/**
 * Retrieves the statistics for this shortened {@link URL}.
 *
 * @param {Function} callback - the callback function to be called with the result
 * @return {URL} A reference to this {@link URL} for chaining purposes.
 * @public
 */
URL.prototype.stats = function(callback) {
  var data = {
    action: 'url-stats',
    shorturl: this.url
  }

  jsonp(data, 'link', callback)

  return this
}
