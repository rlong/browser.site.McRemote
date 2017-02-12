//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//

var jsonbroker=jsonbroker||{};jsonbroker.client=jsonbroker.client||{};jsonbroker.client.BrowserBridge=function(url){if(url){this._url=url;}else{this._url="/_dynamic_/open/services";}}
jsonbroker.client.BrowserBridge.prototype.dispatch=function(){var args=Array.prototype.slice.call(arguments);var call=JSON.stringify(args);var xmlhttp=new XMLHttpRequest();xmlhttp.onreadystatechange=function(){if(this.readyState!=4){return;}
if(204==this.status){return;}
if(200===this.status){var brokerMessage=JSON.parse(this.responseText);if("response"===brokerMessage[0]){jsonbroker.client.forwardResponse.apply(jsonbroker,brokerMessage);return;}else if("fault"===brokerMessage[0]){jsonbroker.client.forwardFault.apply(jsonbroker,brokerMessage);return;}}
if(console){console.warn(xmlhttp);console.warn(arguments);}
args[0]="fault";var associativeParamaters=args[6];associativeParamaters["errorDomain"]="jsonbroker.BrowserBridge.HTTP_STATUS_"+this.status;associativeParamaters["faultCode"]=this.status;associativeParamaters["faultContext"]={"readyState":this.readyState};associativeParamaters["faultMessage"]=this.statusText;associativeParamaters["originator"]="jsonbroker.BrowserBridge";associativeParamaters["stackTrace"]=[];associativeParamaters["underlyingFaultMessage"]=null;jsonbroker.client.forwardFault.apply(jsonbroker,args);};xmlhttp.open("POST",this._url);xmlhttp.send(call);}
