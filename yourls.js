// [yourls-api](http://neocotic.com/yourls-api) 1.0.0  
// (c) 2011 Alasdair Mercer  
// Freely distributable under the MIT license.  
// For all details and documentation:  
// <http://neocotic.com/yourls-api>

(function (root) {

  // Private variables
  // -----------------

  var
    // URL of YOURLS API stored by `yourls.connect`.
    api            = '',
    // Authentication credentials stored by `yourls.connect`.
    auth           = {},
    // Save the previous value of the `yourls` variable.
    previousYourls = root.yourls;

  // Public variables
  // ----------------

  // API to be exposed publicly later on.
  var yourls = {};
  // Callback functions for activate JSONP requests.  
  // Functions should removed once they have been called.  
  // This property must be public since the callback is called in global
  // context.
  yourls.__jsonp_callbacks = {};

  // Public constants
  // ----------------

  // Current version of `yourls`.
  yourls.VERSION = '1.0.0';

  // Private functions
  // -----------------

  // Convert the object provided in to a URL parameter string.
  function paramify(params) {
    var key, str = '';
    for (key in params) {
      if (params.hasOwnProperty(key)) {
        if (typeof params[key] !== 'undefined') {
          str += key + '=' + params[key] + '&';
        }
      }
    }
    return str.replace(/&$/, '');
  }

  // Send a JSONP request to the YOURLS API that calls the callback function
  // with the context specified as `this`.
  function jsonp(url, callback, context) {
    var
      id     = +new Date(),
      script = document.createElement('script');
    while (typeof yourls.__jsonp_callbacks[id] !== 'undefined') {
      id += Math.random();
    }
    yourls.__jsonp_callbacks[id] = function () {
      delete yourls.__jsonp_callbacks[id];
      callback.apply(context, arguments);
    };
    url = '?format=jsonp&callback=' +
          encodeURIComponent('yourls.__jsonp_callbacks[' + id + ']') + '&' +
          url;
    url += '&' + paramify(auth);
    script.setAttribute('src', api + url);
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  // Primary functions
  // -----------------

  // Store the URL and user credentials to be used to connect to the YOURLS
  // API.  
  // This won't validate the URL or credentials at any point; this is performed
  // by each individual method.
  yourls.connect = function (url, credentials) {
    api = url;
    auth = {};
    if (credentials) {
      if (credentials.signature) {
        auth.signature = credentials.signature;
      } else {
        auth.password = credentials.password;
        auth.username = credentials.username;
      }
    }
    return this;
  };

  // Retrieve the short URL for a long URL.
  yourls.shorten = function (url, keyword, callback, context) {
    var data = {
      action : 'shorturl',
      url    : url
    };
    if (typeof keyword === 'function') {
      callback = keyword;
    } else {
      data.keyword = keyword;
    }
    jsonp(paramify(data), callback, context);
    return this;
  };

  // Retrieve the statistics for all the shortened URLs which can be optionally
  // filtered.
  yourls.stats = function (filter, limit, callback, context) {
    var
      data       = {action: 'stats'},
      filterType = typeof filter;
    switch (filterType) {
    case 'number':
      data.limit = filter;
      callback = limit;
      break;
    case 'function':
      callback = filter;
      break;
    default:
      data.filter = filter;
      if (typeof limit === 'function') {
        callback = limit;
      } else {
        data.limit = limit;
      }
    }
    jsonp(paramify(data), callback, context);
    return this;
  };

  // URL functions
  // -------------

  // The constructor for url objects.  
  // Just creating an instance of a url doesn't fetch any data from the YOURLS
  // API and you'll need to be explicit about what you want to do in order for
  // that to happen.
  yourls.url = function (url) {
    if (!(this instanceof yourls.url)) return new yourls.url(url);
    this.url = url;
  };

  // Retrieve the long URL for a short URL.
  yourls.url.prototype.expand = function (callback, context) {
    jsonp(paramify({
      action   : 'expand',
      shorturl : this.url
    }), callback, context);
    return this;
  };

  // Retrieve statistics for a single short URL.
  yourls.url.prototype.stats = function (callback, context) {
    jsonp(paramify({
      action   : 'url-stats',
      shorturl : this.url
    }), callback, context);
    return this;
  };

  // Utility functions
  // -----------------

  // Run yourls.js in *noConflict* mode, returning the `yourls` variable to its
  // previous owner.  
  // Returns a reference to `yourls`.
  yourls.noConflict = function () {
    root.yourls = previousYourls;
    return this;
  };

  // Export `yourls` for CommonJS.
  if (typeof define === 'function' && define.amd) {
    define('yourls', function () {
      return yourls;
    });
  } else {
    root.yourls = yourls;
  }

}(this));