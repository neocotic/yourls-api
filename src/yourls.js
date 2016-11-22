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

import { API } from './api'
import { DB } from './yourls-db'
import { jsonp } from './request/jsonp'
import { URL } from './yourls-url'

/**
 * Provides the ability to connect to YOURLS servers and perform read/write operations via the API that they expose.
 *
 * Before attempting to interact with a YOURLS server, you <b>must</b> call {@link YOURLS#connect} first to configure
 * the URL of the YOURLS server and any credentials required to authenticate with its API (only required when private).
 *
 * @constructor
 * @protected
 */
var YOURLS = function() {
  /**
   * Provides information on the YOURLS {@link DB}.
   *
   * @public
   * @type {DB}
   */
  this.db = new DB()

  /**
   * The current version of <code>yourls</code>.
   *
   * This is <b>not</b> the same as the version of YOURLS that is being connected to. The {@link YOURLS#version}
   * function should be used to provide that information.
   *
   * @public
   * @type {string}
   */
  this.VERSION = '2.0.0'
}

/**
 * Stores the specified information to be used later to connect to and authenticate with a YOURLS server.
 *
 * @param {string} [url=''] - the URL for the YOURLS server
 * @param {API~Credentials} [credentials] - the credentials to be used to authenticate with the YOURLS API (may be
 * <code>null</code>)
 * @return {YOURLS} A reference to this {@link YOURLS} for chaining purposes.
 * @public
 */
YOURLS.prototype.connect = function(url, credentials) {
  var api = new API(url, credentials)
  api.store()

  return this
}

/**
 * Clears any information that may have been previously stored for connecting to and authenticating with a YOURLS
 * server.
 *
 * @return {YOURLS} A reference to this {@link YOURLS} for chaining purposes.
 * @public
 */
YOURLS.prototype.disconnect = function() {
  API.clear()

  return this
}

/**
 * Creates a short URL for the specified long <code>url</code>.
 *
 * Optionally, a <code>descriptor</code> can be provided to specify a keyword and/or title for the short URL that is to
 * be created. If a keyword is specified, it must be available and, if not, the YOURLS server will generate a unique
 * keyword. If <code>descriptor</code> is a string, it will be treated as a keyword.
 *
 * @param {string} url - the long URL to be shortened
 * @param {YOURLS~Descriptor|string} [descriptor] - the optional descriptor (or keyword, if it's a string) to be used
 * for the short URL
 * @param {Function} callback - the callback function to be called with the result
 * @return {YOURLS} A reference to this {@link YOURLS} for chaining purposes.
 * @public
 */
YOURLS.prototype.shorten = function(url, descriptor, callback) {
  var data = {
    action: 'shorturl',
    url: url
  }

  switch (typeof descriptor) {
  case 'function':
    callback = descriptor
    descriptor = null
    break
  case 'string':
    descriptor = { keyword: descriptor }
    break
  default:
    // Do nothing
  }

  if (descriptor) {
    data.keyword = descriptor.keyword
    data.title = descriptor.title
  }

  jsonp(data, [ 'shorturl', 'title', 'url' ], callback)

  return this
}

/**
 * Retrieves the statistics for all shortened URLs.
 *
 * Optionally, the results can be filtered and even limited to provide greater control.
 *
 * @param {string} [filter] - the filter to be applied (either <code>"top"</code>, <code>"bottom"</code>,
 * <code>"rand"</code>, or <code>"last"</code>) (may be <code>null</code> for all)
 * @param {number} [limit] - the maximum number of URLs to be returned (may be <code>null</code> for all)
 * @param {Function} callback - the callback function to be called with the result
 * @return {YOURLS} A reference to this {@link YOURLS} for chaining purposes.
 * @public
 */
YOURLS.prototype.stats = function(filter, limit, callback) {
  var data = { action: 'stats' }

  switch (typeof filter) {
  case 'number':
    callback = limit
    limit = filter
    filter = null
    break
  case 'function':
    callback = filter
    filter = limit = null
    break
  default:
    if (typeof limit === 'function') {
      callback = limit
      limit = null
    }
  }

  data.filter = filter
  data.limit = limit

  jsonp(data, 'stats', callback)

  return this
}

/**
 * Creates an instance of {@link URL} for the specified shortened <code>url</code> which can be used to lookup more
 * detailed information relating to it.
 *
 * No data is fetched just by calling this function; one of the functions on the returned instance need to be called for
 * that to happen.
 *
 * @param {string} url - the shortened URL (or its keyword)
 * @return {URL} The {@link URL} created for the shortened <code>url</code> or <code>null</code> if <code>url</code> is
 * <code>null</code>.
 * @public
 */
YOURLS.prototype.url = function(url) {
  return url ? new URL(url) : null
}

/**
 * Retrieves the version of the connected YOURLS API.
 *
 * @param {Function} callback - the callback function to be called with the result
 * @return {YOURLS} A reference to this {@link YOURLS} for chaining purposes.
 * @public
 */
YOURLS.prototype.version = function(callback) {
  var data = { action: 'version' }

  jsonp(data, 'version', callback)

  return this
}

/**
 * The singleton instance of {@link YOURLS}.
 */
export default new YOURLS()

/**
 * Contains additional information which can be used when shortening a URL.
 *
 * If <code>keyword</code> is specified, it must be available and, if not, the YOURLS server will generate a unique
 * keyword.
 *
 * @typedef {Object} YOURLS~Descriptor
 * @property {string} [keyword] - The optional keyword to be used for the shortened URL.
 * @property {string} [title] - The optional title to be associated with the shortened URL.
 */
