(function (window) {
    var api = '/yourls-api.php',
        auth = {},
        yourls = window.yourls = {};
    yourls.__jsonp_callbacks = {};
    function paramify(params) {
        var str = '', key;
        for (key in params) {
            if (params.hasOwnProperty(key)) {
                if (params[key] !== undefined) {
                    str += key + '=' + params[key] + '&';
                }
            }
        }
        return str.replace(/&$/, '');
    }
    function jsonp(url, callback, context) {
        var id = +new Date(),
            script = document.createElement('script');
        while (yourls.__jsonp_callbacks[id] !== undefined) {
            id += Math.random();
        }
        yourls.__jsonp_callbacks[id] = function () {
            delete yourls.__jsonp_callbacks[id];
            callback.apply(context, arguments);
        };
        url = '?format=jsonp&callback=' + encodeURIComponent('yourls.__jsonp_callbacks[' + id + ']') + '&' + url;
        url += '&' + paramify(auth);
        script.setAttribute('src', api + url);
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    yourls.connect = function (url, credentials) {
        api = url;
        if (credentials) {
            if (credentials.signature) {
                auth = {signature: credentials.signature};
            } else {
                auth = {
                    password: credentials.password,
                    username: credentials.username
                };
            }
        }
        return this;
    };
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
    yourls.stats = function (filter, limit, callback) {
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
        jsonp(paramify(data), callback);
        return this;
    };
    yourls.url = function (url) {
        if (!(this instanceof yourls.url)) {
            return new yourls.url(url);
        }
        this.url = url;
    };
    yourls.url.prototype.expand = function (callback) {
        jsonp(paramify({
            action: 'expand',
            shorturl: this.url
        }), callback);
        return this;
    };
    yourls.url.prototype.stats = function (callback) {
        jsonp(paramify({
            action: 'url-stats',
            shorturl: this.url
        }), callback);
        return this;
    };
}(window));