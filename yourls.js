/*!
 * yourls-api v1.0.0
 * 
 * Copyright 2011, Alasdair Mercer
 * Freely distributable under the MIT license.
 * 
 * For all details and documentation:
 * http://neocotic.com/yourls-api
 */

(function () {
    var api = '',
        auth = {},
        yourls = window.yourls = {};
    yourls.__jsonp_callbacks = {};

    /**
     * <p>Converts the object provided in to a URL parameter string.</p>
     * @param {Object} params The object whose properties are to be
     * parameterised.
     * @returns {String} The parameterised string created.
     */
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

    /**
     * <p>Sends a JSONP request to the YOURLS API that calls the callback
     * function with the context specified as <code>this</code>.</p>
     * @param {String} url The URL to be called.
     * @param {Function} callback The function to be called when the response
     * has been received.
     * @param {Object} context The context in which the callback function is
     * to be applied.
     */
    function jsonp(url, callback, context) {
        var id = +new Date(),
            script = document.createElement('script');
        while (typeof yourls.__jsonp_callbacks[id] !== 'undefined') {
            id += Math.random();
        }
        yourls.__jsonp_callbacks[id] = function () {
            delete yourls.__jsonp_callbacks[id];
            callback.apply(context, arguments);
        };
        url = '?format=jsonp&callback=' +
            encodeURIComponent('yourls.__jsonp_callbacks[' + id + ']') +
            '&' + url;
        url += '&' + paramify(auth);
        script.setAttribute('src', api + url);
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    /**
     * <p>Stores the URL and user credentials to be used to connect to the
     * YOURLS API.</p>
     * <p>This won't validate the URL or credentials at any point; this is
     * performed by each individual method.</p>
     * @param {String} url The URL of the YOURLS installation's API (must point
     * to the <code>yourls-api.php</code> file and not just the directory.
     * @param {Object} [credentials] Contains the user's credentials.
     * @param {String} [credentials.password] The user's password.
     * @param {String} [credentials.signature] The user's signature (takes
     * precedence over username/password authentication).
     * @param {String} [credentials.username] The user's name.
     * @returns {yourls} The yourls instance to allow call chaining.
     */
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

    /**
     * <p>Retrieves the short URL for a long URL.</p>
     * @param {String} url The URL to be shortened.
     * @param {String} [keyword] A custom short URL keyword/hash.
     * @param {Function} callback The function to be called when the response
     * has been received.
     * @param {Object} [context] The context in which the callback function is
     * to be applied.
     * @returns {yourls} The yourls instance to allow call chaining.
     */
    yourls.shorten = function (url, keyword, callback, context) {
        var data = {
            action: 'shorturl',
            url: url
        };
        if (typeof keyword === 'function') {
            callback = keyword;
        } else {
            data.keyword = keyword;
        }
        jsonp(paramify(data), callback, context);
        return this;
    };

    /**
     * <p>Retrives the statistics for all the shortened URLs which can be
     * optionally filtered.</p>
     * @param {String} [filter] The filter to be applied (top, bottom, rand,
     * last).
     * @param {Number} [limit] The maximum number of links to return.
     * @param {Function} callback The function to be called when the response
     * has been received.
     * @param {Object} [context] The context in which the callback function is
     * to be applied.
     * @returns {yourls} The yourls instance to allow call chaining.
     */
    yourls.stats = function (filter, limit, callback, context) {
        var data = {action: 'stats'},
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

    /**
     * <p>The constructor for url objects.</p>
     * <p>Just creating an instance of a url doesn't fetch any data from the
     * YOURLS API and you'll need to be explicit about what you want to do in
     * order for that to happen.</p>
     * @param {String} url The URL for which the new url object is to be
     * created for.
     * @constructor
     */
    yourls.url = function (url) {
        if (!(this instanceof yourls.url)) {
            return new yourls.url(url);
        }
        this.url = url;
    };

    /**
     * <p>Retrives the long URL for a short URL.</p>
     * @param {Function} callback The function to be called when the response
     * has been received.
     * @param {Object} [context] The context in which the callback function is
     * to be applied.
     * @returns {yourls.url} The url instance to allow call chaining.
     */
    yourls.url.prototype.expand = function (callback, context) {
        jsonp(paramify({
            action: 'expand',
            shorturl: this.url
        }), callback, context);
        return this;
    };

    /**
     * <p>Retrives statistics for a single short URL.</p>
     * @param {Function} callback The function to be called when the response
     * has been received.
     * @param {Object} [context] The context in which the callback function is
     * to be applied.
     * @returns {yourls.url} The url instance to allow call chaining.
     */
    yourls.url.prototype.stats = function (callback, context) {
        jsonp(paramify({
            action: 'url-stats',
            shorturl: this.url
        }), callback, context);
        return this;
    };

}());