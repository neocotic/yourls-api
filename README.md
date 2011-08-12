# [YOURLS API](http://forchoon.com/projects/javascript/yourls-api/)

A JavaScript library that provides bindings for the [YOURLS](http://yourls.org)
API using JSONP.

## Important

The current release of [YOURLS](http://yourls.org) does not provide official
support for JSONP so this API cannot be used with it.

However, I have provided a
[patch](http://code.google.com/p/yourls/source/detail?r=659) which implements
full support for JSONP which [Ozh](http://planetozh.com/) has applied so these
changes should be included in the next stable release. If you're impatient or
are really keen and you're comfortable changing PHP files you can attempt to
make the change yourself (requires very few changes).

## Connecting

```
yourls.connect(url, [credentials])
```

This is the first step and where you'll provide the URL of the
[YOURLS](http://yourls.org) API you wish to connect to, baring in mind that the
URL should point to the `yourls-api.php` file and not just its directory. If
you're going to be connecting to a private YOURLS installation you'll also need
to provide either the username/password OR the signature token if you're
wanting to use [passwordless API
requests](http://code.google.com/p/yourls/wiki/PasswordlessAPI) (the signature
token takes precedence here).

``` javascript
var exampl = yourls.connect('http://exam.pl/yourls-api.php', {
    // username: 'admin',
    // password: 'qwerty',
    signature: '3002a61584'
});
```

Despite the name no connection or authentication is carried out at this point
and this initial method simply stores these values to prevent you from
specifying them with every API call.

## Shortening

```
yourls.shorten(url, [keyword], callback, [context])
```

This method shortens the URL provided optionally using a custom keyword/hash.

``` javascript
exampl.shorten('http://forchoon.com/projects/javascript/yourls-api/', 'yourls', function (data) {
    console.log(data.shorturl); // http://exam.pl/yourls
});
```

## Statistics

```
yourls.stats([filter], [limit], callback, [context])
```

This method fetches the statistics on all your links but also allows you to
filter and limit what is returned.

``` javascript
exampl.stats('last', 1, function (data) {
    var myLink = data.links.link_1;
    console.log(myLink.shorturl); // http://exam.pl/yourls
    console.log(myLink.url);      // http://forchoon.com/projects/javascript/yourls-api/
    console.log(myLink.title);    // YOURLS API | forchoon
    console.log(myLink.clicks);   // 1987
    // Overall statistics
    console.log(data.stats.total_links);  // 12
    console.log(data.stats.total_clicks); // 2011
});
```

## URL Information

```
yourls.url(url)
```

Unlike the other API calls this constructs an instance of a `yourls.url` for
the URL provided (which should be a shortened URL).

``` javascript
var myUrl = exampl.url('http://exam.pl/yourls');
```

Once you have this instance more operations become available that are
applicable only to the URL provided here.

### Expanding

```
yourls.url.expand(callback, [context])
```

This method fetches the original long URL for your link.

``` javascript
myUrl.expand(function (data) {
    console.log(data.keyword);  // yourls
    console.log(data.shorturl); // http://exam.pl/yourls
    console.log(data.longurl);  // http://forchoon.com/projects/javascript/yourls-api/
});
```

### Statistics

```
yourls.url.stats(callback, [context])
```

This method fetches the statistics for your link.

``` javascript
myUrl.stats(function (data) {
    console.log(data.link.shorturl); // http://exam.pl/yourls
    console.log(data.link.url);      // http://forchoon.com/projects/javascript/yourls-api/
    console.log(data.link.title);    // YOURLS API | forchoon
    console.log(data.link.clicks);   // 1987
});
```

## Is that all?

Well actually, no. These are simply examples for each API method but to
appreciate what is returned by each call you should read the [official YOURLS
API documentation](http://yourls.org/#API) as that determines what is returned
in the end.

All the parameters wrapped in square brackets `[...]` are optional and do not
need to be provided.

You may have also noticed that most API calls accept an optional `context`
parameter and none of the examples use it. I thought this might have over
complicated the examples so I decided to exclude this parameter. However, this
is a powerful parameter that allows you to apply a context to the `callback`
function so that the `this` keyword refers to `context`.