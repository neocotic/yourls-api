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

import Oopsy from 'oopsy'

import { API } from '../api'
import { extend } from '../util/extend'
import { isArray } from '../util/array'

/**
 * Contains logic to connect with a YOURLS server and send data to its API.
 *
 * Due to the nature of HTTP, requests sent using a "GET" HTTP method will include all information in the URL of the
 * request. This includes the data that is sent as well as <b>any credentials</b> used to authenticate with the API. You
 * have been warned.
 *
 * @constructor
 * @protected
 */
export var Request = Oopsy.extend({

  /**
   * Builds the body for this {@link Request} based on the <code>api</code> and <code>data</code> provided.
   *
   * @param {API} api - the {@link API} to which the request is being sent
   * @param {Object} [data] - the data being sent in this request
   * @return {Object} The request body.
   * @protected
   */
  buildBody: function(api, data) {
    return extend({ format: api.options.format }, api.credentials, data)
  },

  /**
   * Returns the list of the HTTP methods that are supported by this {@link Request}.
   *
   * By default, this method returns <code>null</code>, so implementations <b>must</b> implement this method to ensure
   * that {@link Request#isMethodSupported} works correctly.
   *
   * @return {string[]} The supported HTTP methods.
   * @protected
   */
  getSupportedHttpMethods: function() {
    return null
  },

  /**
   * Determines whether this {@link Request} supports the specified HTTP <code>method</code>.
   *
   * @param {string} method - the HTTP method to be checked
   * @return {boolean} <code>true</code> if <code>method</code> is supported; otherwise <code>false</code>.
   * @public
   */
  isMethodSupported: function(method) {
    var supportedMethods = this.getSupportedHttpMethods()
    return supportedMethods && supportedMethods.indexOf(method) !== -1
  },

  /**
   * Determines whether the data that is to be sent to the YOURLS server in this {@link Request} must be serialized as
   * query string parameters.
   *
   * @param {string} method - the HTTP method to be used
   * @return {boolean} <code>true</code> if the data needs to be sent as query string parameters; otherwise
   * <code>false</code>.
   * @protected
   */
  isQueryStringRequired: function(method) {
    return method === 'GET'
  },

  /**
   * Processes this {@link Request} by sending it to the specified target <code>url</code> containing the
   * <code>body</code> provided.
   *
   * <code>callback</code> should be called with the response regardless of whether the it was a success or failure.
   *
   * This method is called internally by {@link Request#send} and does all of the actual work involved to send the
   * request and parse the response. All implementations <b>must</b> implement this method.
   *
   * @param {string} method - the request HTTP method
   * @param {string} url - the request URL
   * @param {Object} body - the request body (may be <code>null</code>)
   * @param {Function} callback - the function to be called with the response
   * @return {void}
   * @protected
   * @abstract
   */
  process: function(method, url, body, callback) {
    // Must be implemented
  },

  /**
   * Sends the request to the connected YOURLS API with the <code>data</code> provided which should, in turn, call the
   * specified <code>callback</code> with the result.
   *
   * If the request is successful, <code>callback</code> will be passed the value of the named properties from the
   * response. If <code>resultNames</code> is a string or only contains a single string, only the value for that named
   * property will be passed as the first argument. Otherwise, an object containing the key/value pairs for each named
   * property will be passed as the first argument. The actual response will always be passed as the second argument.
   *
   * @param {Object} data - the data to be sent
   * @param {string|string[]} resultNames - the names of the response properties whose values are to be passed to
   * <code>callback</code> as the first argument
   * @param {Function} callback - the function to be called with the result
   * @return {void}
   * @public
   */
  send: function(data, resultNames, callback) {
    var api = API.instance
    var body = Request._serializeParameters(this.buildBody(api, data))
    var method = api.options.method
    var url = api.url

    if (this.isQueryStringRequired(method)) {
      url += '?' + body
      body = null
    }

    this.process(method, url, body, function(response) {
      callback(Request._extractResult(resultNames, response), response)
    })
  }

}, {

  /**
   * Extracts the values of the properties with the specified <code>names</code> from the <code>response</code> provided
   * and returns them in a single result.
   *
   * If <code>names</code> is a string or only contains a single string, only the value for that named property will be
   * returned. Otherwise, an object containing the key/value pairs for each named property will be returned.
   *
   * If <code>response</code> is <code>null</code> this method will return <code>null</code>.
   *
   * @param {string|string[]} names - the names of the <code>response</code> properties whose values are to be returned
   * as the result
   * @param {Object} response - the YOURLS API response
   * @return {*} The result extracted from <code>response</code>.
   * @private
   * @static
   */
  _extractResult: function(names, response) {
    names = isArray(names) ? names : [ names ]

    var i
    var name
    var result = null

    if (!response) {
      return result
    }

    if (names.length === 1) {
      result = response[names[0]]
    } else {
      result = {}

      for (i = 0; i < names.length; i++) {
        name = names[i]

        if (typeof response[name] !== 'undefined') {
          result[name] = response[name]
        }
      }
    }

    return result
  },

  /**
   * Creates a serialized representation of the specified parameters.
   *
   * All of the parameter names and values are URL-encoded so that they can be safely included in the query string or
   * request body.
   *
   * @param {Object} [params] - the hash of parameter name/value pairs to be serialized
   * @return {string} A URL-encoded representing <code>obj</code> or an empty string if <code>obj</code> is
   * <code>null</code>.
   * @private
   * @static
   */
  _serializeParameters: function(params) {
    if (!params) {
      return ''
    }

    var results = []

    for (var name in params) {
      if (Object.prototype.hasOwnProperty.call(params, name) && params[name] != null) {
        results.push(encodeURIComponent(name) + '=' + encodeURIComponent(params[name]))
      }
    }

    return results.join('&')
  }

})
