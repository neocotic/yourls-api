                                  ___                                           
                                 /\_ \                                    __    
     __  __    ___   __  __  _ __\//\ \     ____            __     _____ /\_\   
    /\ \/\ \  / __`\/\ \/\ \/\`'__\\ \ \   /',__\ _______ /'__`\  /\ '__`\/\ \  
    \ \ \_\ \/\ \L\ \ \ \_\ \ \ \/  \_\ \_/\__, `\\______\\ \L\.\_\ \ \L\ \ \ \ 
     \/`____ \ \____/\ \____/\ \_\  /\____\/\____//______/ \__/.\_\\ \ ,__/\ \_\
      `/___/> \/___/  \/___/  \/_/  \/____/\/___/         \/__/\/_/ \ \ \/  \/_/
         /\___/                                                      \ \_\      
         \/__/                                                        \/_/      

[yourls-api][] is a JavaScript library that provides bindings for the [YOURLS][]
API using JSONP.

This library is only compatible with [YOURLS][] version **1.5.1** or newer.

## Connect

``` javascript
yourls.connect(url[, credentials])
```

## Shorten

``` javascript
yourls.shorten(url[, keyword], callback(data)[, context])
```

## Stats

``` javascript
yourls.stats([filter][, limit], callback(data)[, context])
```

## URL

``` javascript
yourls.url(url)
```

### Expand

``` javascript
yourls.url.expand(callback(data)[, context])
```

### Stats

``` javascript
yourls.url.stats(callback(data)[, context])
```

## Miscellaneous

``` javascript
yourls.noConflict()
yourls.VERSION
```

## Bugs

If you have any problems with this library or would like to see the changes
currently in development you can do so here;

https://github.com/neocotic/yourls-api/issues

## Questions?

Take a look at `docs/yourls.html` to get a better understanding of what the code
is doing.

If that doesn't help, feel free to follow me on Twitter, [@neocotic][].

However, if you want more information or examples of using this library please
visit the project's homepage;

http://neocotic.com/yourls-api

[@neocotic]: https://twitter.com/#!/neocotic
[yourls]: http://yourls.org
[yourls-api]: http://neocotic.com/yourls-api
