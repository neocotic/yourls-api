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

/**
 * The singleton {@link API} instance which is privatized to prevent leaking credentials.
 *
 * @private
 * @type {API}
 */
var instance = null

/**
 * Sanitizes the specified <code>credentials</code> by ensuring that only valid properties are present and only when
 * appropriate.
 *
 * This function does not modify <code>credentials</code> and instead creates a new object with the sanitized
 * properties.
 *
 * @param {API~Credentials} credentials - the credentials to be sanitized (may be <code>null</code>)
 * @return {API~Credentials} A sanitized version of <code>credentials</code> or <code>null</code> if
 * <code>credentials</code> is <code>null</code>.
 * @private
 */
function sanitizeCredentials(credentials) {
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
}

/**
 * Contains information on how to connect to and authenticate with a YOURLS server.
 *
 * @param {string} [url=''] - the URL for the YOURLS server
 * @param {API~Credentials} [credentials] - the credentials to be used to authenticate with the YOURLS API (may be
 * <code>null</code>)
 * @protected
 * @constructor
 */
export function API(url, credentials) {
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
  this.credentials = sanitizeCredentials(credentials)
}

/**
 * Destroys the singleton instance of {@link API}.
 *
 * @return {void}
 * @public
 * @static
 */
API.clear = function() {
  instance = null
}

/**
 * Retrieves the singleton instance of {@link API}.
 *
 * This function will return <code>null</code> unless an instance is currently stored.
 *
 * @return {API} The connected {@link API} or <code>null</code> if none exists.
 * @public
 * @static
 */
API.fetch = function() {
  return instance
}

/**
 * Stores this {@link API} as the singleton, potentially replacing the existing instance.
 *
 * @return {void}
 * @public
 */
API.prototype.store = function() {
  instance = this
}

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
