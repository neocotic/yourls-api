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

## Connect

```
yourls.connect(url, [credentials])
```

## Shorten

```
yourls.shorten(url, [keyword], callback, [context])
```

## Stats

```
yourls.stats([filter], [limit], callback, [context])
```

## URL

```
yourls.url(url)
```

### Expand

```
yourls.url.expand(callback, [context])
```

### Stats

```
yourls.url.stats(callback, [context])
```

## Further Information

If you want more information or examples of using this library please visit the
project's homepage;

http://neocotic.com/yourls-api

[yourls]: http://yourls.org
[yourls-api]: http://neocotic.com/yourls-api