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
 * Sends a JSONP request to the connected YOURLS API with the <code>data</code> provided which should, in turn, call the
 * specified <code>callback</code> with the result.
 *
 * Due to the nature of JSONP, all information will be included in the URL of the request. This includes
 * <code>data</code> as well as <b>any credentials</b> used to authenticate with the API. You have been warned.
 *
 * @param {Object} data - the data to be sent
 * @param {Function} callback - the function to be called with the result
 * @return {void}
 * @protected
 */
export function jsonp(data, callback) {
  var api = API.fetch()
  var id = generateCallbackId()
  var script = document.createElement('script')

  callbackHolder[id] = function() {
    delete callbackHolder[id]
    callback.apply(null, arguments)
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
