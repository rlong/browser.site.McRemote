//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//

var selector=selector||{};selector.selectAll=function(listSpecifier,root){var nList=listSpecifier;if(listSpecifier instanceof NodeList){return nList;}
if(undefined!=root){return root.querySelectorAll(listSpecifier);}
return document.querySelectorAll(listSpecifier);}
selector.selectAllAndApply=function(listSpecifier,func,root){var nList=selector.selectAll(listSpecifier,root);for(var i=0,count=nList.length;i<count;i++){var target=nList.item(i);func.apply(target);}
return nList;};selector.addEventListener=function(listSpecifier,eventName,func,root){return selector.selectAllAndApply(listSpecifier,function(){this.addEventListener(eventName,func);},root);};selector.addClass=function(listSpecifier,className,root){return selector.selectAllAndApply(listSpecifier,function(){this.classList.add(className);},root);}
selector.removeClass=function(listSpecifier,className,root){return selector.selectAllAndApply(listSpecifier,function(){this.classList.remove(className);},root);}
