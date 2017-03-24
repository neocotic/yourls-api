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

import { API } from './api'
import { DB } from './yourls-db'
import { isArray } from './util/array'
import { Requestor } from './request/requestor'
import { URL } from './yourls-url'

/**
 * Provides the ability to connect to YOURLS servers and perform read/write operations via the API that they expose.
 *
 * Before attempting to interact with a YOURLS server, you <b>must</b> call {@link YOURLS#connect} first to configure
 * the URL of the YOURLS server and any credentials required to authenticate with its API (only required when private).
 *
 * @constructor
 * @extends Requestor
 * @protected
 */
var YOURLS = Requestor.extend(function() {
  YOURLS.super_.call(this)

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
   * This is <b>not</b> the same as the version of YOURLS that is being connected to. The {@link YOURLS#version} method
   * should be used to provide that information.
   *
   * @public
   * @type {string}
   */
  this.VERSION = '3.0.0'
}, {

  /**
   * Stores the specified information to be used later to connect to and authenticate with a YOURLS server.
   *
   * @param {string} [url=''] - the URL for the YOURLS server
   * @param {API~Credentials} [credentials] - the credentials to be used to authenticate with the YOURLS API (may be
   * <code>null</code>)
   * @param {API~Options} [options] - the options to be used to send requests to the YOURLS server (may be
   * <code>null</code>)
   * @return {YOURLS} A reference to this {@link YOURLS} for chaining purposes.
   * @public
   */
  connect: function(url, credentials, options) {
    API.instance = new API(url, credentials, options)

    return this
  },

  /**
   * Clears any information that may have been previously stored for connecting to and authenticating with a YOURLS
   * server.
   *
   * @return {YOURLS} A reference to this {@link YOURLS} for chaining purposes.
   * @public
   */
  disconnect: function() {
    API.instance = null

    return this
  },

  /**
   * Creates a short URL for the specified long <code>url</code>.
   *
   * Optionally, a <code>descriptor</code> can be provided to specify a keyword and/or title for the short URL that is
   * to be created. If a keyword is specified, it must be available and, if not, the YOURLS server will generate a
   * unique keyword. If <code>descriptor</code> is a string, it will be treated as the keyword.
   *
   * @param {string} url - the long URL to be shortened
   * @param {YOURLS~UrlDescriptor|string} [descriptor] - the optional descriptor (or keyword, if it's a string) to be
   * used for the short URL
   * @param {Function} callback - the callback function to be called with the result
   * @return {YOURLS} A reference to this {@link YOURLS} for chaining purposes.
   * @public
   */
  shorten: function(url, descriptor, callback) {
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

    this.sendRequest(data, [ 'shorturl', 'title', 'url' ], callback)

    return this
  },

  /**
   * Retrieves the statistics for all shortened URLs.
   *
   * Optionally, <code>criteria</code> can be provided to also include a refined set of links in the result. This
   * includes filter, which provides limited control over the sorting, as well as limit and start, which allow for
   * pagination. If <code>criteria</code> is a number, it will be treated as the limit.
   *
   * No links will be included in the result unless a limit is specified that is greater than zero. In that case, this
   * method would effectively be doing the same as {@link DB#stats}.
   *
   * @param {YOURLS~SearchCriteria|number} [criteria] - the optional criteria (or limit, if it's a number) to be used to
   * search for links to be included in the result
   * @param {Function} callback - the callback function to be called with the result
   * @return {YOURLS} A reference to this {@link YOURLS} for chaining purposes.
   * @public
   */
  stats: function(criteria, callback) {
    var data = { action: 'stats' }

    switch (typeof criteria) {
    case 'function':
      callback = criteria
      criteria = null
      break
    case 'number':
      criteria = { limit: criteria }
      break
    default:
      // Do nothing
    }

    if (criteria) {
      data.filter = criteria.filter
      data.limit = criteria.limit
      data.start = criteria.start
    }

    this.sendRequest(data, [ 'links', 'stats' ], function(result, response) {
      callback(YOURLS._sanitizeStatsResult(result), response)
    })

    return this
  },

  /**
   * Creates an instance of {@link URL} for the specified shortened <code>url</code> which can be used to lookup more
   * detailed information relating to it.
   *
   * No data is fetched just by calling this method; one of the methods on the returned instance need to be called for
   * that to happen.
   *
   * @param {string} url - the shortened URL (or its keyword)
   * @return {URL} The {@link URL} created for the shortened <code>url</code> or <code>null</code> if <code>url</code>
   * is <code>null</code>.
   * @public
   */
  url: function(url) {
    return url ? new URL(url) : null
  },

  /**
   * Retrieves the version of the connected YOURLS API.
   *
   * Optionally, <code>db</code> can be passed to indicate that the YOURLS database version should also be included in
   * the result.
   *
   * @param {boolean} [db] - <code>true</code> to include the database version; otherwise <code>false</code>
   * @param {Function} callback - the callback function to be called with the result
   * @return {YOURLS} A reference to this {@link YOURLS} for chaining purposes.
   * @public
   */
  version: function(db, callback) {
    var data = { action: 'version' }

    if (typeof db === 'function') {
      callback = db
      db = null
    }

    if (db != null) {
      data.db = Number(db)
    }

    this.sendRequest(data, [ 'db_version', 'version' ], callback)

    return this
  }

}, {

  /**
   * Sanitizes the result of {@link YOURLS#stats} so that it's more usable in application code by transforming the links
   * from an object mapping into an array.
   *
   * This method simply returns <code>result</code> if it is <code>null</code>, has no links property or one that is
   * already an array (future-proofing).
   *
   * @param {Object} result - the result to be sanitized (may be <code>null</code>)
   * @param {Object} [result.links] - the links to be transformed into an array (may be <code>null</code>)
   * @return {Object} The modified <code>result</code> or <code>null</code> if <code>result</code> is <code>null</code>.
   * @private
   * @static
   */
  _sanitizeStatsResult: function(result) {
    // Future-proofing by sanitizing links *only* when not already an array
    if (!result || !result.links || isArray(result.links)) {
      return result
    }

    var index = 1
    var link
    var links = []

    while ((link = result.links['link_' + index]) != null) {
      links.push(link)
      index++
    }

    result.links = links

    return result
  }

})

/**
 * The singleton instance of {@link YOURLS}.
 */
export default new YOURLS()

/**
 * Contains criteria which can be used to search for a refined set of shortened URLs.
 *
 * Pagination can be achieved by using <code>limit</code> and <code>start</code>.
 *
 * No links will be returned unless <code>limit</code> is specified and has a value that is greater than zero.
 *
 * @typedef {Object} YOURLS~SearchCriteria
 * @property {string} [filter] - The filter to be applied (either <code>"top"</code>, <code>"bottom"</code>,
 * <code>"rand"</code>, or <code>"last"</code>).
 * @property {number} [limit] - The maximum number of links whose statistical information is to be counted.
 * <code>null</code> or <code>0</code> will result in no links being included in the result.
 * @property {number} [start] - The offset from where the search should begin.
 */

/**
 * Contains additional information which can be used when shortening a URL.
 *
 * If <code>keyword</code> is specified, it must be available and, if not, the YOURLS server will generate a unique
 * keyword.
 *
 * @typedef {Object} YOURLS~UrlDescriptor
 * @property {string} [keyword] - The optional keyword to be used for the shortened URL.
 * @property {string} [title] - The optional title to be associated with the shortened URL.
 */
