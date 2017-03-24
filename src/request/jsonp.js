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

import { Request } from './request'

/**
 * The seed to be used to generate IDs.
 *
 * @private
 * @type {number}
 */
var seed = new Date().getTime()

/**
 * An implementation of {@link Request} that provides support for JSONP requests to the YOURLS API.
 *
 * JSONP requests can only be sent using the "GET" HTTP method.
 *
 * @constructor
 * @extends Request
 * @protected
 */
export var JSONPRequest = Request.extend(function() {
  JSONPRequest.super_.call(this)

  if (!window[JSONPRequest._callbackHolderKey]) {
    window[JSONPRequest._callbackHolderKey] = JSONPRequest._callbackHolder
  }

  /**
   * The generated ID which is used to store a reference to the callback function within the holder so that the JSONP
   * payload can find it in the global namespace.
   *
   * @private
   * @type {number}
   */
  this._id = JSONPRequest._generateId()
}, {

  /**
   * @inheritDoc
   * @override
   */
  getSupportedHttpMethods: function() {
    return [ 'GET' ]
  },

  /**
   * @inheritDoc
   * @override
   */
  buildBody: function(api, data) {
    var body = JSONPRequest.super_.prototype.buildBody.call(this, api, data)
    body.callback = JSONPRequest._callbackHolderKey + '[' + this._id + ']'

    return body
  },

  /**
   * @inheritDoc
   * @override
   */
  process: function(method, url, body, callback) {
    var script = document.createElement('script')

    var self = this
    JSONPRequest._callbackHolder[this._id] = function(response) {
      delete JSONPRequest._callbackHolder[self._id]
      script.parentNode.removeChild(script)

      callback(response)
    }

    script.setAttribute('src', url)
    document.getElementsByTagName('head')[0].appendChild(script)
  }

}, {

  /**
   * The key of the callback function holder within the global namespace.
   *
   * @private
   * @static
   * @type {string}
   */
  _callbackHolderKey: '__yourls' + seed + '_jsonp',

  /**
   * Contains the callback functions for active JSONP requests.
   *
   * Callback references should be removed immediately once they have been called.
   *
   * Due to the nature of JSON, a reference to this object <b>must</b> be publicly available (i.e. global).
   *
   * @private
   * @static
   * @type {Object<number, Function>}
   */
  _callbackHolder: {},

  /**
   * Generates an ID to be used when storing a reference to a callback function.
   *
   * @return {number} The generated ID.
   * @private
   */
  _generateId: function() {
    do {
      seed++
    } while (JSONPRequest._callbackHolder[seed])

    return seed
  }

})
