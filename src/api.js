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

/**
 * Contains information on how to connect to and authenticate with a YOURLS server.
 *
 * @param {string} [url=''] - the URL for the YOURLS server
 * @param {API~Credentials} [credentials] - the credentials to be used to authenticate with the YOURLS API (may be
 * <code>null</code>)
 * @param {API~Options} [options] - the options to be used to send requests to the YOURLS server (may be
 * <code>null</code>)
 * @protected
 * @constructor
 */
export var API = Oopsy.extend(function(url, credentials, options) {
  /**
   * The URL of the YOURLS server.
   *
   * @public
   * @type {string}
   */
  this.url = url ? url.replace(/\/$/, '') : ''
  /**
   * The credentials to be used to authenticate with the YOURLS API.
   *
   * This may be <code>null</code> if the YOURLS API is public.
   *
   * @public
   * @type {API~Credentials}
   */
  this.credentials = API._sanitizeCredentials(credentials)
  /**
   * The options to be used to send requests to the YOURLS server.
   *
   * @public
   * @type {API~Options}
   */
  this.options = API._sanitizeOptions(options)
}, null, {

  /**
   * The singleton {@link API} instance which is privatized to prevent leaking credentials.
   *
   * @public
   * @static
   * @type {API}
   */
  instance: null,

  /**
   * Sanitizes the specified <code>credentials</code> by ensuring that only valid properties are present and only when
   * appropriate.
   *
   * This method does not modify <code>credentials</code> and instead creates a new object with the sanitized
   * properties.
   *
   * @param {API~Credentials} credentials - the credentials to be sanitized (may be <code>null</code>)
   * @return {API~Credentials} A sanitized version of <code>credentials</code> or <code>null</code> if
   * <code>credentials</code> is <code>null</code>.
   * @private
   * @static
   */
  _sanitizeCredentials: function(credentials) {
    if (!credentials) {
      return null
    }

    var result = {}
    if (credentials.signature) {
      result.signature = credentials.signature
      result.timestamp = credentials.timestamp
    } else {
      result.password = credentials.password
      result.username = credentials.username
    }

    return result
  },

  /**
   * Sanitizes the specified <code>options</code> by ensuring that only valid properties are present and in the correct
   * format.
   *
   * This method does not modify <code>options</code> and instead creates a new object with the sanitized properties and
   * default values will be used for missing options.
   *
   * @param {API~Options} options - the options to be sanitized (may be <code>null</code>)
   * @return {API~Options} A sanitized version of <code>options</code> which will contain only default values if
   * <code>options</code> is <code>null</code>.
   * @private
   * @static
   */
  _sanitizeOptions: function(options) {
    if (options == null) {
      options = {}
    }

    var result = { format: 'json' }

    if (options.format) {
      result.format = options.format.toLowerCase()
    }
    if (options.method) {
      result.method = options.method.toUpperCase()
    } else {
      result.method = result.format === 'json' ? 'POST' : 'GET'
    }

    return result
  }

})

/**
 * The credentials to be used to authenticate with a private YOURLS API.
 *
 * Authentication can be done with a traditional username and password combination <b>or</b> by using the secret
 * signature token (e.g. <code>1002a612b4</code>)for the YOURLS API. The latter is not available for public YOURLS APIs
 * and can be found on the "Tools" page.
 *
 * Optionally, a timestamp can accompany the signature token to make it time-limited (depending on the server
 * configuration). When a timestamp is provided the signature token <b>must</b> be the md5 sum of the timestamp and
 * signature token concatenated, and in that order.
 *
 * @typedef {Object} API~Credentials
 * @property {string} [password] - The password of the user to be authenticated.
 * @property {string} [username] - The name of the user to be authenticated.
 * @property {string} [signature] - The signature token to be used for passwordless authentication with the YOURLS API.
 * @property {number|string} [timestamp] - The optional timestamp to limit the <code>signature</code> token.
 */

/**
 * The options that determine how requests are sent to the YOURLS server.
 *
 * If the request <code>format</code> does not support the HTTP <code>method</code>, requests will not be sent and an
 * error will be thrown when such attempts occur.
 *
 * @typedef {Object} API~Options
 * @property {string} [format="json"] - The format in which requests are sent (either <code>"json"</code> or
 * <code>"jsonp"</code>).
 * @property {string} [method] - The HTTP method to be used for requests. Defaults to <code>"POST"</code> when
 * <code>format</code> is <code>"json"</code> and <code>"GET"</code> when <code>format</code> is <code>"jsonp"</code>.
 */
