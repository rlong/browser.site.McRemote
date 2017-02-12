

Scratch
=======



```
```



-------------------------------------------------------------------------------

Environment
===========


```
export PORT=4130
export HOST=127.0.0.1
```


```
export PORT=8081
export HOST=127.0.0.1
```

-------------------------------------------------------------------------------



```
curl -d '["request",{},"remote_gateway.AppleScriptService:clipboard",1,0,"ping",[]]' http://$HOST:$PORT/_dynamic_/open/services```
```

```
curl -d '["request",{},"remote_gateway.AppleScriptService:clipboard",1,0,"get_clipboard",[]]' http://$HOST:$PORT/_dynamic_/open/services
```



```
curl -d '["request",{},"remote_gateway.AppleScriptService:clipboard",1,0,"set_clipboard",["clipboard set via curl"]]' http://$HOST:$PORT/_dynamic_/open/services
```
