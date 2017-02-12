//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//

var actuator=actuator||{};actuator.touchSupported=true
try{document.createEvent("TouchEvent");}catch(e){actuator.touchSupported=false;}
actuator.startEvent="mousedown";actuator.commitEvent="click";if(actuator.touchSupported){actuator.startEvent="touchstart";actuator.commitEvent="touchend";}
actuator.ClassList=function(htmlElement){this._htmlElement=htmlElement;}
actuator.ClassList.prototype.remove=function(activeClass){activeClass=" "+activeClass;var clazz=this._htmlElement.getAttribute("class");if(!clazz){return;}
clazz=clazz.replace(activeClass,"");this._htmlElement.setAttribute("class",clazz);}
actuator.ClassList.prototype.add=function(activeClass){activeClass=" "+activeClass;var clazz=this._htmlElement.getAttribute("class");if(!clazz){this._htmlElement.setAttribute("class",activeClass);return;}
clazz=clazz+activeClass;this._htmlElement.setAttribute("class",clazz);}
actuator.currentTarget=null;actuator.updateCurrentTarget=function(nextTarget,activeClass){if(nextTarget==actuator.currentTarget){return;}
if(null!=actuator.currentTarget){actuator.currentTarget.classList.remove(activeClass);}
if(null!=nextTarget){nextTarget.classList.add(activeClass);}
actuator.currentTarget=nextTarget;}
actuator.setupActuator=function(listSpecifier,activeClass,onActuateStart,onActuateCommit){listSpecifier=selector.selectAllAndApply(listSpecifier,function(){if(!this.classList){this.classList=new actuator.ClassList(this);}});listSpecifier=selector.addEventListener(listSpecifier,actuator.startEvent,function(e){actuator.updateCurrentTarget(e.currentTarget,activeClass);if(onActuateStart){onActuateStart.call(this,e);}
if(actuator.touchSupported){e.currentTarget.startActuationY=e.touches[0].clientY;e.stopPropagation();}});listSpecifier=selector.addEventListener(listSpecifier,actuator.commitEvent,function(e){if(null==actuator.currentTarget){return;}
actuator.updateCurrentTarget(null,activeClass);if(onActuateCommit){onActuateCommit.call(this,e);}});if(actuator.touchSupported){listSpecifier=selector.addEventListener(listSpecifier,"touchmove",function(e){if(null==actuator.currentTarget){return;}
var verticalTravel=actuator.currentTarget.startActuationY-e.touches[0].clientY;if(-15>verticalTravel||15<verticalTravel){actuator.updateCurrentTarget(null,activeClass);return;}});}else{listSpecifier=selector.addEventListener(listSpecifier,"mouseout",function(e){actuator.updateCurrentTarget(null,activeClass);});}};
