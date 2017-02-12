//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//

var jsonbroker=jsonbroker||{};jsonbroker.client=jsonbroker.client||{};jsonbroker.client.buildBridge=function(){if(0===location.protocol.indexOf("http")){return new jsonbroker.client.BrowserBridge();}
if(jsonbroker.client.MobileBridge){return new jsonbroker.client.MobileBridge();}
if(jsonbroker.client.DesktopBridge){return new jsonbroker.client.DesktopBridge();}
throw"Could not Find Appropriate Bridge";};jsonbroker.client.onFault=function(){if(console&&console.error){console.error(arguments)}};jsonbroker.client.onResponse=function(){};jsonbroker.client.proxies={};jsonbroker.client.registerProxy=function(proxyName,proxy){jsonbroker.client.proxies[proxyName]=proxy;};jsonbroker.client.forwardFault=function(){var proxy=jsonbroker.client.proxies[arguments[2]];if(proxy){arguments[2]=proxy;var method=proxy[arguments[5]];if(method){arguments[5]=method;var methodOnFault=method.onFault;if(methodOnFault){methodOnFault.apply(methodOnFault,arguments);return;}}
var proxyOnFault=proxy.onFault;if(proxyOnFault){proxyOnFault.apply(proxyOnFault,arguments);return;}}
jsonbroker.client.onFault.apply(jsonbroker.client.onFault,arguments);};jsonbroker.client.forwardResponse=function(){var proxy=jsonbroker.client.proxies[arguments[2]];if(proxy){arguments[2]=proxy;var method=proxy[arguments[5]];if(method){arguments[5]=method;var methodOnResponse=method.onResponse;if(methodOnResponse){methodOnResponse.apply(methodOnResponse,arguments);return;}}
var proxyOnResponse=proxy.onResponse;if(proxyOnResponse){proxyOnResponse.apply(proxyOnResponse,arguments);return;}}
jsonbroker.client.onResponse.apply(jsonbroker.client.onResponse,arguments);};
