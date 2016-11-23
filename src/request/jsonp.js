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

import { API } from '../api'
import { isArray } from '../util/array'
import { paramify } from './paramify'

/**
 * The key of the callback function holder within the global namespace.
 *
 * @private
 * @type {string}
 */
var callbackHolderKey = '__yourls' + Date.now() + '_jsonp'
/**
 * Contains the callback functions for active JSONP requests.
 *
 * Callback references should be removed immediately once they have been called.
 *
 * Due to the nature of JSON, a reference to this object <b>must</b> be publicly available (i.e. global).
 *
 * @private
 * @type {Object<number, Function>}
 */
var callbackHolder = window[callbackHolderKey] = {}

/**
 * Generates a quick and dirty unique ID for a callback.
 *
 * @return {number} The generated callback ID.
 * @private
 */
function generateCallbackId() {
  var id = Date.now()
  while (callbackHolder[id]) {
    id++
  }

  return id
}

/**
 * Extracts the values of the properties with the specified <code>names</code> from the <code>response</code> provided
 * and returns them in a single result.
 *
 * If <code>names</code> is a string or only contains a single string, only the value for that named property will be
 * returned. Otherwise, an object containing the key/value pairs for each named property will be returned.
 *
 * If <code>response</code> is <code>null</code> this function will return <code>null</code>.
 *
 * @param {string|string[]} names - the names of the <code>response</code> properties whose values are to be returned as
 * the result
 * @param {Object} response - the YOURLS API response
 * @return {*} The result extracted from <code>response</code>.
 * @private
 */
function getResult(names, response) {
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
}

/**
 * Sends a JSONP request to the connected YOURLS API with the <code>data</code> provided which should, in turn, call the
 * specified <code>callback</code> with the result.
 *
 * If the request is successful, <code>callback</code> will be passed the value of the named properties from the
 * response. If <code>resultNames</code> is a string or only contains a single string, only the value for that named
 * property will be passed as the first argument. Otherwise, an object containing the key/value pairs for each named
 * property will be passed as the first argument. The actual response will always be passed as the second argument.
 *
 * Due to the nature of JSONP, all information will be included in the URL of the request. This includes
 * <code>data</code> as well as <b>any credentials</b> used to authenticate with the API. You have been warned.
 *
 * @param {Object} data - the data to be sent
 * @param {string|string[]} resultNames - the names of the response properties whose values are to be passed to
 * <code>callback</code> as the first argument
 * @param {Function} callback - the function to be called with the result
 * @return {void}
 * @protected
 */
export function jsonp(data, resultNames, callback) {
  var api = API.fetch()
  var id = generateCallbackId()
  var script = document.createElement('script')

  callbackHolder[id] = function(response) {
    var result = getResult(resultNames, response)

    delete callbackHolder[id]
    script.parentNode.removeChild(script)

    callback(result, response)
  }

  var target = api.url + '?' + paramify({ callback: callbackHolderKey + '[' + id + ']', format: 'jsonp' })
  if (api.credentials) {
    target += '&' + paramify(api.credentials)
  }
  if (data) {
    target += '&' + paramify(data)
  }

  script.setAttribute('src', target)
  document.getElementsByTagName('head')[0].appendChild(script)
}
