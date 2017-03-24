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

import Oopsy from 'oopsy'

import { API } from '../api'
import { JSONRequest } from './json'
import { JSONPRequest } from './jsonp'

/**
 * Can make requests to the connected YOURLS API.
 *
 * @constructor
 * @protected
 */
export var Requestor = Oopsy.extend({

  /**
   * Sends the request to the connected YOURLS API with the <code>data</code> provided which should, in turn, call the
   * specified <code>callback</code> with the result.
   *
   * This method is primarily a proxy to {@link Request#send} but does validate the state of the connection information
   * to ensure that is is valid before making the request.
   *
   * @param {Object} data - the data to be sent
   * @param {string|string[]} resultNames - the names of the response properties whose values are to be passed to
   * <code>callback</code> as the first argument
   * @param {Function} callback - the function to be called with the result
   * @return {void}
   * @throws {Error} - If either no connection is present, the request format is not supported, or the configured HTTP
   * method is not supported by the {@link Request}.
   * @protected
   */
  sendRequest: function(data, resultNames, callback) {
    var api = API.instance

    if (!api) {
      throw new Error('No connection has been made')
    }

    var format = api.options.format
    var method = api.options.method
    var Request = Requestor._requestFormatMap[format]

    if (!Request) {
      throw new Error('Request format not supported: ' + format)
    }

    var request = new Request()

    if (!request.isMethodSupported(method)) {
      throw new Error('HTTP method not supported: ' + method)
    }

    request.send(data, resultNames, callback)
  }

}, {

  /**
   * The mapping of supported request formats to {@link Request} constructors.
   *
   * @private
   * @static
   * @type {Object<string, Function>}
   */
  _requestFormatMap: {
    json: JSONRequest,
    jsonp: JSONPRequest
  }

})
