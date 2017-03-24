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
 * An implementation of {@link Request} that provides support for JSON requests to the YOURLS API.
 *
 * JSON requests can only be sent using the "GET" or "POST" HTTP methods.
 *
 * @constructor
 * @extends Request
 * @protected
 */
export var JSONRequest = Request.extend({

  /**
   * @inheritDoc
   * @override
   */
  getSupportedHttpMethods: function() {
    return [ 'GET', 'POST' ]
  },

  /**
   * @inheritDoc
   * @override
   */
  process: function(method, url, body, callback) {
    var xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    xhr.onreadystatechange = function() {
      var response

      if (xhr.readyState === 4) {
        try {
          response = JSON.parse(xhr.responseText)
          callback(response)
        } catch (e) {
          throw new Error('Unable to parse response: ' + e)
        }
      }
    }

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    if (body != null) {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    }

    xhr.send(body)
  }

})
