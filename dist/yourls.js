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
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('yourls-api', factory) :
  (global.yourls = factory());
}(this, (function () { 'use strict';

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
  var instance = null;

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

    var result = {};
    if (credentials.signature) {
      result.signature = credentials.signature;
      result.timestamp = credentials.timestamp;
    } else {
      result.password = credentials.password;
      result.username = credentials.username;
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
  function API(url, credentials) {
    /**
     * The URL of the YOURLS server.
     *
     * @public
     * @type {string}
     */
    this.url = url ? url.replace(/\/$/, '') : '';
    /**
     * The credentials to be used to authenticate with the YOURLS API.
     *
     * This may be <code>null</code> if the YOURLS API is public.
     *
     * @public
     * @type {API~Credentials}
     */
    this.credentials = sanitizeCredentials(credentials);
  }

  /**
   * Destroys the singleton instance of {@link API}.
   *
   * @return {void}
   * @public
   * @static
   */
  API.clear = function() {
    instance = null;
  };

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
  };

  /**
   * Stores this {@link API} as the singleton, potentially replacing the existing instance.
   *
   * @return {void}
   * @public
   */
  API.prototype.store = function() {
    instance = this;
  };

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
   * Creates a serialized representation of the specified <code>params</code> into a URL query string.
   *
   * @param {Object} [params] - the hash of parameter key/value pairs to be serialized
   * @return {string} A URL query string representing <code>params</code>.
   * @protected
   */
  function paramify(params) {
    if (!params) {
      return ''
    }

    var results = [];

    for (var key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        if (params[key] != null) {
          results.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
        }
      }
    }

    return results.join('&')
  }

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
   * The key of the callback function holder within the global namespace.
   *
   * @private
   * @type {string}
   */
  var callbackHolderKey = '__yourls' + Date.now() + '_jsonp';
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
  var callbackHolder = window[callbackHolderKey] = {};

  /**
   * Generates a quick and dirty unique ID for a callback.
   *
   * @return {number} The generated callback ID.
   * @private
   */
  function generateCallbackId() {
    var id = Date.now();
    while (callbackHolder[id]) {
      id++;
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
  function jsonp(data, callback) {
    var api = API.fetch();
    var id = generateCallbackId();
    var script = document.createElement('script');

    callbackHolder[id] = function() {
      delete callbackHolder[id];
      callback.apply(null, arguments);
    };

    var target = api.url + '?' + paramify({ callback: callbackHolderKey + '[' + id + ']', format: 'jsonp' });
    if (api.credentials) {
      target += '&' + paramify(api.credentials);
    }
    if (data) {
      target += '&' + paramify(data);
    }

    script.setAttribute('src', target);
    document.getElementsByTagName('head')[0].appendChild(script);
  }

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
   * Provides the ability to lookup information related to the YOURLS database.
   *
   * @constructor
   * @protected
   */
  function DB() {
    // Do nothing
  }

  /**
   * Retrieves the statistics for this {@link DB}.
   *
   * @param {Function} callback - the callback function to be called with the result
   * @return {DB} A reference to this {@link DB} for chaining purposes.
   * @public
   */
  DB.prototype.stats = function(callback) {
    var data = { action: 'db-stats' };

    jsonp(data, callback);

    return this
  };

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
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE0
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */

  /**
   * Provides the ability to lookup information related to the specified shortened <code>url</code>.
   *
   * @param {string} url - the shortened URL (or its keyword) to be used
   * @constructor
   * @protected
   */
  function URL(url) {
    /**
     * Either the shortened URL or its keyword for this {@link URL}.
     *
     * @public
     * @type {string}
     */
    this.url = url;
  }

  /**
   * Retrieves the original ("long") URL for this shortened {@link URL}.
   *
   * @param {Function} callback - the callback function to be called with the result
   * @return {URL} A reference to this {@link URL} for chaining purposes.
   * @public
   */
  URL.prototype.expand = function(callback) {
    var data = {
      action: 'expand',
      shorturl: this.url
    };

    jsonp(data, callback);

    return this
  };

  /**
   * Retrieves the statistics for this shortened {@link URL}.
   *
   * @param {Function} callback - the callback function to be called with the result
   * @return {URL} A reference to this {@link URL} for chaining purposes.
   * @public
   */
  URL.prototype.stats = function(callback) {
    var data = {
      action: 'url-stats',
      shorturl: this.url
    };

    jsonp(data, callback);

    return this
  };

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
    this.db = new DB();

    /**
     * The current version of <code>yourls</code>.
     *
     * @public
     * @type {string}
     */
    this.version = '1.0.0';
  };

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
    var api = new API(url, credentials);
    api.store();

    return this
  };

  /**
   * Clears any information that may have been previously stored for connecting to and authenticating with a YOURLS
   * server.
   *
   * @return {YOURLS} A reference to this {@link YOURLS} for chaining purposes.
   * @public
   */
  YOURLS.prototype.disconnect = function() {
    API.clear();

    return this
  };

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
    };

    switch (typeof descriptor) {
    case 'function':
      callback = descriptor;
      descriptor = null;
      break
    case 'string':
      descriptor = { keyword: descriptor };
      break
    default:
      // Do nothing
    }

    if (descriptor) {
      data.keyword = descriptor.keyword;
      data.title = descriptor.title;
    }

    jsonp(data, callback);

    return this
  };

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
    var data = { action: 'stats' };

    switch (typeof filter) {
    case 'number':
      callback = limit;
      limit = filter;
      filter = null;
      break
    case 'function':
      callback = filter;
      filter = limit = null;
      break
    default:
      if (typeof limit === 'function') {
        callback = limit;
        limit = null;
      }
    }

    data.filter = filter;
    data.limit = limit;

    jsonp(data, callback);

    return this
  };

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
  };

  /**
   * The singleton instance of {@link YOURLS}.
   */
  var yourls = new YOURLS();

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

  return yourls;

})));

//# sourceMappingURL=yourls.js.map