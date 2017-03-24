(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('yourls-api', factory) :
  (global.yourls = factory());
}(this, (function () { 'use strict';

  /*
   * Copyright (C) 2016 Alasdair Mercer, Skelp
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
   * A bare-bones constructor for surrogate prototype swapping.
   *
   * @private
   * @constructor
   */
  var Constructor = function() {};
  /**
   * A reference to <code>Object.prototype.hasOwnProperty</code>.
   *
   * @private
   * @type {Function}
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  /**
   * A reference to <code>Array.prototype.slice</code>.
   *
   * @private
   * @type {Function}
   */
  var slice = Array.prototype.slice;

  /**
   * Extends the specified <code>target</code> object with the properties in each of the <code>sources</code> provided.
   *
   * Nothing happens if <code>target</code> is <code>null</code> and if any source is <code>null</code> it will be
   * ignored.
   *
   * @param {boolean} own - <code>true</code> to only copy <b>own</b> properties from <code>sources</code> onto
   * <code>target</code>; otherwise <code>false</code>
   * @param {Object} [target] - the target object which should be extended
   * @param {...Object} [sources] - the source objects whose properties are to be copied onto <code>target</code>
   * @return {void}
   * @private
   */
  function extend(own, target, sources) {
    if (target == null) {
      return
    }

    sources = slice.call(arguments, 2);

    var property;
    var source;

    for (var i = 0, length = sources.length; i < length; i++) {
      source = sources[i];

      for (property in source) {
        if (!own || hasOwnProperty.call(source, property)) {
          target[property] = source[property];
        }
      }
    }
  }

  /**
   * Creates an object which inherits the given <code>prototype</code>.
   *
   * Optionally, the created object can be extended further with the specified <code>properties</code>.
   *
   * @param {Object} prototype - the prototype to be inherited by the created object
   * @param {Object} [properties] - the optional properties to be extended by the created object
   * @return {Object} The newly created object.
   * @private
   */
  function create(prototype, properties) {
    var result;
    if (typeof Object.create === 'function') {
      result = Object.create(prototype);
    } else {
      Constructor.prototype = prototype;
      result = new Constructor();
      Constructor.prototype = null;
    }

    if (properties) {
      extend(true, result, properties);
    }

    return result
  }

  /**
   * The base constructor from which all others should extend.
   *
   * @public
   * @constructor
   */
  function Oopsy() {}

  /**
   * Extends the constructor to which this method is associated with the <code>prototype</code> and/or
   * <code>statics</code> provided.
   *
   * If <code>constructor</code> is provided, it will be used as the constructor for the child, otherwise a simple
   * constructor which only calls the super constructor will be used instead.
   *
   * The super constructor can be accessed via a special <code>super_</code> property on the child constructor.
   *
   * @param {Function} [constructor] - the constructor for the child
   * @param {Object} [prototype] - the prototype properties to be defined for the child
   * @param {Object} [statics] - the static properties to be defined for the child
   * @return {Function} The child <code>constructor</code> provided or the one created if none was given.
   * @public
   * @static
   */
  Oopsy.extend = function(constructor, prototype, statics) {
    var superConstructor = this;

    if (typeof constructor !== 'function') {
      statics = prototype;
      prototype = constructor;
      constructor = function() {
        return superConstructor.apply(this, arguments)
      };
    }

    extend(false, constructor, superConstructor, statics);

    constructor.prototype = create(superConstructor.prototype, prototype);
    constructor.prototype.constructor = constructor;

    constructor.super_ = superConstructor;

    return constructor
  };

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

  /**
   * Extends the specified <code>target</code> object with the properties in each of the <code>sources</code> provided.
   *
   * Any of the <code>sources</code> that are <code>null</code> will simply be ignored.
   *
   * @param {Object} target - the target object which should be extended
   * @param {...Object} [sources] - the source objects whose properties are to be copied onto <code>target</code>
   * @return {Object} A reference to <code>target</code>.
   * @protected
   */
  function extend$1(target, sources) {
    sources = Array.prototype.slice.call(arguments, 1);

    for (var i = 0, length = sources.length, property, source; i < length; i++) {
      source = sources[i];

      if (source) {
        for (property in source) {
          if (Object.prototype.hasOwnProperty.call(source, property)) {
            target[property] = source[property];
          }
        }
      }
    }

    return target
  }

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
  var API = Oopsy.extend(function(url, credentials, options) {
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
    this.credentials = API._sanitizeCredentials(credentials);
    /**
     * The options to be used to send requests to the YOURLS server.
     *
     * @public
     * @type {API~Options}
     */
    this.options = API._sanitizeOptions(options);
  }, null, {

    /**
     * The default options to be used.
     *
     * @protected
     * @static
     * @type {API~Options}
     */
    defaultOptions: {
      format: 'jsonp',
      method: 'GET'
    },

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

      var result = {};
      if (credentials.signature) {
        result.signature = credentials.signature;
        result.timestamp = credentials.timestamp;
      } else {
        result.password = credentials.password;
        result.username = credentials.username;
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
      var result = extend$1({}, API.defaultOptions);
      if (!options) {
        return result
      }

      if (options.format) {
        result.format = options.format.toLowerCase();
      }
      if (options.method) {
        result.method = options.method.toUpperCase();
      }

      return result
    }

  });

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
   * @property {string} [format="jsonp"] - The format in which requests are sent (either <code>"json"</code> or
   * <code>"jsonp"</code>).
   * @property {string} [method="GET"] - The HTTP method to be used for requests.
   */

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

  /**
   * Returns whether the specified <code>obj</code> is an array.
   *
   * This method will use the native <code>Array.isArray</code>, if available.
   *
   * @param {*} obj - the object to be checked (may be <code>null</code>)
   * @return {boolean} <code>true</code> if <code>obj</code> is an array; otherwise <code>false</code>.
   * @protected
   */
  function isArray(obj) {
    return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) === '[object Array]'
  }

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
  var Request = Oopsy.extend({

    /**
     * Builds the body for this {@link Request} based on the <code>api</code> and <code>data</code> provided.
     *
     * @param {API} api - the {@link API} to which the request is being sent
     * @param {Object} [data] - the data being sent in this request
     * @return {Object} The request body.
     * @protected
     */
    buildBody: function(api, data) {
      return extend$1({ format: api.options.format }, api.credentials, data)
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
      var supportedMethods = this.getSupportedHttpMethods();
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
      var api = API.instance;
      var body = Request._serializeParameters(this.buildBody(api, data));
      var method = api.options.method;
      var url = api.url;

      if (this.isQueryStringRequired(method)) {
        url += '?' + body;
        body = null;
      }

      this.process(method, url, body, function(response) {
        callback(Request._extractResult(resultNames, response), response);
      });
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
      names = isArray(names) ? names : [ names ];

      var i;
      var name;
      var result = null;

      if (!response) {
        return result
      }

      if (names.length === 1) {
        result = response[names[0]];
      } else {
        result = {};

        for (i = 0; i < names.length; i++) {
          name = names[i];

          if (typeof response[name] !== 'undefined') {
            result[name] = response[name];
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

      var results = [];

      for (var name in params) {
        if (Object.prototype.hasOwnProperty.call(params, name) && params[name] != null) {
          results.push(encodeURIComponent(name) + '=' + encodeURIComponent(params[name]));
        }
      }

      return results.join('&')
    }

  });

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

  /**
   * An implementation of {@link Request} that provides support for JSON requests to the YOURLS API.
   *
   * JSON requests can only be sent using the "GET" or "POST" HTTP methods.
   *
   * @constructor
   * @extends Request
   * @protected
   */
  var JSONRequest = Request.extend({

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
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.onreadystatechange = function() {
        var response;

        if (xhr.readyState === 4) {
          try {
            response = JSON.parse(xhr.responseText);
            callback(response);
          } catch (e) {
            throw new Error('Unable to parse response: ' + e)
          }
        }
      };

      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      if (body != null) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      }

      xhr.send(body);
    }

  });

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

  /**
   * The seed to be used to generate IDs.
   *
   * @private
   * @type {number}
   */
  var seed = new Date().getTime();

  /**
   * An implementation of {@link Request} that provides support for JSONP requests to the YOURLS API.
   *
   * JSONP requests can only be sent using the "GET" HTTP method.
   *
   * @constructor
   * @extends Request
   * @protected
   */
  var JSONPRequest = Request.extend(function() {
    JSONPRequest.super_.call(this);

    if (!window[JSONPRequest._callbackHolderKey]) {
      window[JSONPRequest._callbackHolderKey] = JSONPRequest._callbackHolder;
    }

    /**
     * The generated ID which is used to store a reference to the callback function within the holder so that the JSONP
     * payload can find it in the global namespace.
     *
     * @private
     * @type {number}
     */
    this._id = JSONPRequest._generateId();
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
      var body = JSONPRequest.super_.prototype.buildBody.call(this, api, data);
      body.callback = JSONPRequest._callbackHolderKey + '[' + this._id + ']';

      return body
    },

    /**
     * @inheritDoc
     * @override
     */
    process: function(method, url, body, callback) {
      var script = document.createElement('script');

      var self = this;
      JSONPRequest._callbackHolder[this._id] = function(response) {
        delete JSONPRequest._callbackHolder[self._id];
        script.parentNode.removeChild(script);

        callback(response);
      };

      script.setAttribute('src', url);
      document.getElementsByTagName('head')[0].appendChild(script);
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
        seed++;
      } while (JSONPRequest._callbackHolder[seed])

      return seed
    }

  });

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

  /**
   * Can make requests to the connected YOURLS API.
   *
   * @constructor
   * @protected
   */
  var Requestor = Oopsy.extend({

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
      var api = API.instance;

      if (!api) {
        throw new Error('No connection has been made')
      }

      var format = api.options.format;
      var method = api.options.method;
      var Request = Requestor._requestFormatMap[format];

      if (!Request) {
        throw new Error('Request format not supported: ' + format)
      }

      var request = new Request();

      if (!request.isMethodSupported(method)) {
        throw new Error('HTTP method not supported: ' + method)
      }

      request.send(data, resultNames, callback);
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

  });

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

  /**
   * Provides the ability to lookup information related to the YOURLS database.
   *
   * @constructor
   * @extends Requestor
   * @protected
   */
  var DB = Requestor.extend({

    /**
     * Retrieves the statistics for this {@link DB}.
     *
     * @param {Function} callback - the callback function to be called with the result
     * @return {DB} A reference to this {@link DB} for chaining purposes.
     * @public
     */
    stats: function(callback) {
      var data = { action: 'db-stats' };

      this.sendRequest(data, 'db-stats', callback);

      return this
    }

  });

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
   * @extends Requestor
   * @protected
   */
  var URL = Requestor.extend(function(url) {
    URL.super_.call(this);

    /**
     * Either the shortened URL or its keyword for this {@link URL}.
     *
     * @public
     * @type {string}
     */
    this.url = url;
  });

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

    this.sendRequest(data, [ 'keyword', 'longurl', 'shorturl' ], callback);

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

    this.sendRequest(data, 'link', callback);

    return this
  };

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
    YOURLS.super_.call(this);

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
     * This is <b>not</b> the same as the version of YOURLS that is being connected to. The {@link YOURLS#version} method
     * should be used to provide that information.
     *
     * @public
     * @type {string}
     */
    this.VERSION = '3.0.0';
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
      API.instance = new API(url, credentials, options);

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
      API.instance = null;

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

      this.sendRequest(data, [ 'shorturl', 'title', 'url' ], callback);

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
      var data = { action: 'stats' };

      switch (typeof criteria) {
      case 'function':
        callback = criteria;
        criteria = null;
        break
      case 'number':
        criteria = { limit: criteria };
        break
      default:
        // Do nothing
      }

      if (criteria) {
        data.filter = criteria.filter;
        data.limit = criteria.limit;
        data.start = criteria.start;
      }

      this.sendRequest(data, [ 'links', 'stats' ], function(result, response) {
        callback(YOURLS._sanitizeStatsResult(result), response);
      });

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
      var data = { action: 'version' };

      if (typeof db === 'function') {
        callback = db;
        db = null;
      }

      if (db != null) {
        data.db = Number(db);
      }

      this.sendRequest(data, [ 'db_version', 'version' ], callback);

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

      var index = 1;
      var link;
      var links = [];

      while ((link = result.links['link_' + index]) != null) {
        links.push(link);
        index++;
      }

      result.links = links;

      return result
    }

  });

  /**
   * The singleton instance of {@link YOURLS}.
   */
  var yourls = new YOURLS();

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

  return yourls;

})));

//# sourceMappingURL=yourls.js.map