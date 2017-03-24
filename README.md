    Y88b   d88P  .d88888b.  888     888 8888888b.  888      .d8888b.
     Y88b d88P  d88P" "Y88b 888     888 888   Y88b 888     d88P  Y88b
      Y88o88P   888     888 888     888 888    888 888     Y88b.
       Y888P    888     888 888     888 888   d88P 888      "Y888b.
        888     888     888 888     888 8888888P"  888         "Y88b.
        888     888     888 888     888 888 T88b   888           "888
        888     Y88b. .d88P Y88b. .d88P 888  T88b  888     Y88b  d88P
        888      "Y88888P"   "Y88888P"  888   T88b 88888888 "Y8888P"
                                              d8888 8888888b. 8888888
                                             d88888 888   Y88b  888
                                            d88P888 888    888  888
                                           d88P 888 888   d88P  888
                                          d88P  888 8888888P"   888
                                         d88P   888 888         888
                                        d8888888888 888         888
                                       d88P     888 888       8888888

[![Build Status](https://img.shields.io/travis/neocotic/yourls-api/develop.svg?style=flat-square)](https://travis-ci.org/neocotic/yourls-api)
[![Dev Dependency Status](https://img.shields.io/david/dev/neocotic/yourls-api.svg?style=flat-square)](https://david-dm.org/neocotic/yourls-api?type=dev)
[![License](https://img.shields.io/npm/l/yourls-api.svg?style=flat-square)](https://github.com/neocotic/yourls-api/blob/master/LICENSE.md)
[![Release](https://img.shields.io/npm/v/yourls-api.svg?style=flat-square)](https://www.npmjs.com/package/yourls-api)

[YOURLS API](https://github.com/neocotic/yourls-api) is a JavaScript library that provides bindings for
[YOURLS](https://yourls.org) URL shortener servers.

* [Install](#install)
* [API](#api)
* [Migrating from v1](#migrating-from-v1)
* [Bugs](#bugs)
* [Contributors](#contributors)
* [License](#license)

## Install

Install using the package manager for your desired environment(s):

``` bash
$ npm install --save yourls-api
# OR:
$ bower install --save yourls-api
```

You'll need to have at least [Node.js](https://nodejs.org) installed and you'll only need [Bower](https://bower.io) if
you want to install that way instead of using `npm`. And, although this library can be installed via `npm` it is only
intended for use in the browser. `npm` installations are supported for the many web bundlers out there now.

If you want to simply download the file to be used in the browser you can find them below:

* [Development Version](https://cdn.rawgit.com/neocotic/yourls-api/master/dist/yourls.js) (47kb - [Source Map](https://cdn.rawgit.com/neocotic/yourls-api/master/dist/yourls.js.map))
* [Production Version](https://cdn.rawgit.com/neocotic/yourls-api/master/dist/yourls.min.js) (5.6kb - [Source Map](https://cdn.rawgit.com/neocotic/yourls-api/master/dist/yourls.min.js.map))

## API

The API has been designed to be as simple and human-friendly as possible and attempts to hide the majority of work when
dealing with the YOURLS API from you.

All methods of the API return a reference to the API itself to enable a clean chaining of method calls, if desired.

All requests that are sent to YOURLS servers are asynchronous and callback methods are used to track these. Callback
methods are passed the most is deemed (by this library) to be the most important information from the response as the
first argument and the entire response as the second argument.

The following documentation contains some examples of the results that can be expected from YOURLS, however, it doesn't
cover everything. It's recommended that you play around with making requests and inspecting/logging results and
responses to see all of the data that is available.

### Connecting

``` javascript
yourls.connect(url[, credentials][, options])
```

This is the first step and is where you'll provide the `url` of the YOURLS API that you wish to connect to. It **must**
point to the `yourls-api.php` file or its equivalent (e.g. if it's been renamed or using URL rewrites). You can only
connect to a single YOURLS server at a time.

``` javascript
// Simple connection to public server
yourls.connect('https://example.com/yourls-api.php')
```

If you're going to be connecting to a private YOURLS server, you'll also need to provide `credentials` that can be used
to authenticate with it. The recommended method is to specify the `signature` token and use the
[passwordless API requests](http://code.google.com/p/yourls/wiki/PasswordlessAPI) as the signature token can be reset
easily.

``` javascript
// Passwordless connection to private server
yourls.connect('https://example.com/yourls-api.php', {
  signature: '3002a61584'
})
```

However, it's even better if you use a time-limited signature token as it's somewhat more secure. That said; this
library leaves it up to you to provide the signature token as an md5 sum (which should be made from a concatenation of
the `timestamp` passed in and the signature token, and in that order). It's also worth noting that the timestamp should
be in seconds, not milliseconds, since Unix Epoch.

Although it is possible to create md5 sums in the browser with the use of a third-party JavaScript library, at that
point you signature token has probably already been exposed. The best bet is for your server to calculate the md5 sum
and then pass it and the timestamp on which it was based to your frontend to be consumed by this library.

``` javascript
// Time-limited passwordless connection to private server
yourls.connect('https://example.com/yourls-api.php', {
  signature: md5(1477947900 + '3002a61584'),
  timestamp: 1477947900
})
```

This library does also support the more traditional `username`/`password` combination as well.

``` javascript
// Basic authentication connection to private server
yourls.connect('https://example.com/yourls-api.php', {
  username: 'admin',
  password: 'qwerty'
})
```

> **IMPORTANT:** When sending `GET` requests, by design, all information will be included in the URL of the request
> This includes data as well as *any credentials* used to authenticate with the API. You have been warned.
> This is unavoidable when sending requests in the JSONP format but, when using the JSON format, you can send `POST`
> requests, which means that your data is sent inside the body of the request. Combine this with HTTPS and your data and
> credentials cannot be sniffed over the network.

As you may have noticed; this method also accepts the following entirely optional `options`:

Option | Description                         | Default
------ | ----------------------------------- | -----------------------------------------------
format | Format in which requests are sent   | `"json"`
method | HTTP method to be used for requests | `"POST"` for `"json"` and `"GET"` for `"jsonp"`

``` javascript
// Does the same as specifying no options (i.e. using defaults)
// This is the best practice if you want to secure the data you're transmitting and you've setup CORS, if needed
yourls.connect('https://example.com/yourls-api.php', null, {
  format: 'json',
  method: 'POST'
})

// However, if you don't want to setup CORS (or can't), you can try using JSONP
yourls.connect('https://example.com/yourls-api.php', {
  signature: '3002a61584'
}, {
  format: 'jsonp'
})
```

The following formats are supported with the corresponding HTTP methods:

Format | HTTP Methods
------ | ------------
json   | GET, POST
jsonp  | GET

> **IMPORTANT:** The YOURLS server must be running version **1.5.1** or newer in order to send requests in the JSONP
> format.

Despite the name of this method, no connection or authentication is carried out at this point and this initial method
simply stores these values to prevent you from having to specify them with every API call.

### Disconnecting

``` javascript
yourls.disconnect()
```

Calling this method simply clears any previously stored connection information and, despite the name of this method, no
live connections are actually terminated.

### Shortening

``` javascript
yourls.shorten(url[, descriptor], callback(result, response))
```

This method shortens the `url` provided with a keyword/hash that is generated by the YOURLS server.

``` javascript
// Shorten a URL with a random keyword
yourls.shorten('https://github.com/neocotic/yourls-api', function(result, response) {
  console.log(result.shorturl)
  //=> "https://example.com/abc123"
  console.log(result.title)
  //=> "https://github.com/neocotic/yourls-api"
  console.log(result.url.keyword)
  //=> "abc123"
})
```

Optionally, this method can take a `descriptor` containing additional information including the `keyword` to be used for
the short URL that is created and a `title` that is to be associated with it. As a shortcut, the keyword can be passed
as the `descriptor` itself.

``` javascript
// Shorten a URL with a predefined keyword 
yourls.shorten('https://github.com/neocotic/yourls-api', 'yourls', function(result, response) {
  console.log(result.shorturl)
  //=> "https://example.com/yourls"
  console.log(result.title)
  //=> "https://github.com/neocotic/yourls-api"
  console.log(result.url.keyword)
  //=> "yourls"
})

// Shorten a URL with a predefined keyword and title 
yourls.shorten('https://github.com/neocotic/yourls-api', { keyword: 'yourls', title: 'YOURLS API' }, function(result, response) {
  console.log(result.shorturl)
  //=> "https://example.com/yourls"
  console.log(result.title)
  //=> "YOURLS API"
  console.log(result.url.keyword)
  //=> "yourls"
})
```

### Statistics

``` javascript
yourls.stats([criteria, ]callback(result, response))
```

This method fetches the statistics for all links.

``` javascript
// Get link statistics
yourls.stats(function(result, response) {
  console.log(result.stats.total_clicks)
  //=> "98765"
  console.log(result.stats.total_links)
  //=> "123"
})
```

Optionally, this method can take a `criteria` containing search criteria for a sub-set of links which can be included in
the result. This includes the `filter` (either `"top"`, `"bottom"`, `"rand"`, or `"last"`), which can be used to control
sorting, as well as `limit` and `start`, which can be used for pagination lookups. As a shortcut, the limit can be
passed as the `criteria` itself. The minimum required in order to do this is for a `limit` to be specified.

``` javascript
// Get top 10 links
yourls.stats(10, function(result, response) {
  console.log(result.links.length)
  //=> 10
  console.log(result.links[0].shorturl)
  //=> "https://example.com/yourls"
  console.log(result.stats.total_links)
  //=> "123"
})

// Get second page of 5 newest links
yourls.stats({ filter: 'last', limit: 5, start: 5 }, function(result, response) {
  console.log(result.links.length)
  //=> 5
  console.log(result.links[0].shorturl)
  //=> "https://example.com/abc123"
  console.log(result.stats.total_links)
  //=> "123"
})
```

---

``` javascript
yourls.db.stats(callback(result, response))
```

This method does exactly the same as `yourls.stats` except that it *only* returns the statistics for all links.

``` javascript
// Get link statistics
yourls.db.stats(function(result, response) {
  console.log(result.total_clicks)
  //=> "98765"
  console.log(result.total_links)
  //=> "123"
})
```

### URL Information

``` javascript
yourls.url(url)
```

Unlike other API calls, this method returns a wrapper for making API calls that specific to a given shortened `url`,
which can be the keyword instead, if desired.

``` javascript
// Both do the same thing:
var yourls = yourls.url('https://example.com/yourls')
var yourls = yourls.url('yourls')
```

Just like the top-level API methods, all of the URL-specific methods return a reference to the URL wrapper to enable a
clean chaining of method calls, if desired.

#### Expanding

``` javascript
yourls.url(url).expand(callback(result, response))
```

This method expands the shortened `url` into the original (long) URL.

``` javascript
// Get more details for link
yourls.url('https://example.com/yourls').expand(function(result, response) {
  console.log(result.keyword)
  //=> "yourls"
  console.log(result.longurl)
  //=> "https://github.com/neocotic/yourls-api"
  console.log(result.shorturl)
  //=> "https://example.com/yourls"
})
```

#### Statistics

``` javascript
yourls.url(url).stats(callback(result, response))
```

This method fetches the statistics for the shortened `url`.

``` javascript
// Get statistics only for this link
yourls.url('https://example.com/yourls').stats(function(result, response) {
  console.log(result.clicks)
  //=> "123"
  console.log(result.title)
  //=> "neocotic/yourls-api: JavaScript bindings for the YOURLS API"
  console.log(result.url)
  //=> "https://github.com/neocotic/yourls-api"
})
```

### Versions

``` javascript
yourls.version([db, ]callback(result, response))
```

This methods fetches the version of YOURLS running on the connected server.

``` javascript
// Get YOURLS version
yourls.version(function(result, response) {
  console.log(result.version)
  //=> "1.7"
})
```

Optionally, a `db` flag can be enabled for the YOURLS database version to also be included in the result.

``` javascript
// Get YOURLS database version as well
yourls.version(true, function(result, response) {
  console.log(result.version)
  //=> "1.7"
  console.log(result.db_version)
  //=> "482"
})
```

---

``` javascript
// Get version of this library
console.log(yourls.VERSION)
//=> "3.0.0"
```

The current version of this library.

## Migrating from v1

If you've been using v1 then you can find details about what's changed and a guide on how to migrate to v2 below:

https://github.com/neocotic/yourls-api/wiki/Migrating-from-v1

You can also find the code and documentation for the v1 below:

https://github.com/neocotic/yourls-api/tree/1.0.0

## Bugs

If you have any problems with this library or would like to see changes currently in development you can do so
[here](https://github.com/neocotic/yourls-api/issues).

However, if you believe that your issue is with YOURLS itself, please take a look a
[their issues](https://github.com/YOURLS/YOURLS/issues) instead.

## Contributors

If you want to contribute, you're a legend! Information on how you can do so can be found in
[CONTRIBUTING.md](https://github.com/neocotic/yourls-api/blob/master/CONTRIBUTING.md). We want your suggestions and pull
requests!

A list of YOURLS API contributors can be found in
[AUTHORS.md](https://github.com/neocotic/yourls-api/blob/master/AUTHORS.md).

## License

Copyright © 2017 Alasdair Mercer

See [LICENSE.md](https://github.com/neocotic/yourls-api/blob/master/LICENSE.md) for more information on our MIT license.
