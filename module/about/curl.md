

Scratch
=======



curl -d '["request",{},"remote_gateway.AboutService",1,0,"getAboutInformation",{}]' http://127.0.0.1:8081/_dynamic_/open/services



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
curl -d '["request",{},"remote_gateway.AboutService",1,0,"getAboutInformation",{}]' http://$HOST:$PORT/_dynamic_/open/services
```
