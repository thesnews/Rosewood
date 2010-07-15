/*
 http://opensource.org/licenses/gpl-2.0.php GNU GPL 2.0
 http://opensource.org/licenses/gpl-2.0.php GNU GPL 2.0
 http://opensource.org/licenses/gpl-2.0.php GNU GPL 2.0
*/
window.Rose||(Rose={});
(function(){var d=window.location.toString();if(d.indexOf("index.php")!=-1)d=d.substr(0,d.indexOf("index.php"));Rose.basePath=d;String.implement({unencode:function(){return decodeURIComponent(unescape(this))},encode:function(){return escape(encodeURIComponent(this))}});Element.implement({noSelect:function(){this.onselectstart=this.ondragstart=$lambda(false);this.addEvent("mousedown",$lambda(false));this.setStyle("-moz-user-select","none")},dispose:function(){this.retrieve&&this.retrieve("disposeWatchers",
[]).each(function(a){a.dispose()});return this.parentNode?this.parentNode.removeChild(this):this},disposeWith:function(a){var b=$(a).retrieve("disposeWatchers",[]);b.push(this);$(a).store("disposeWatchers",b)}})})();window.Rose||(Rose={});
(function(){var d=new Class({_container:false,_message:false,_type:false,_defaultOptions:$H({container:$(document.body),id:"rose_statusMessage"}),_options:$H({}),initialize:function(){this.setOptions({})},setOptions:function(a){this._options=$H(a);this._options.combine(this._defaultOptions)},display:function(a,b){this._initContainer();var c="notice";if(b)c=b;this._setMessage(a);this._setType(c);this._show();setTimeout(function(){this._hide()}.bind(this),5E3)},_initContainer:function(){if(!this._container){$(window).getCoordinates();
this._container=new Element("div",{id:this._options.get("id"),tween:{duration:250}});var a=$("ticker");if(a){a=a.getCoordinates();this._container.setStyles({left:a.left,width:a.width,height:a.height})}$(this._options.get("container")).adopt(this._container)}},_show:function(){this._container.tween("opacity",1)},_hide:function(){this._container.tween("opacity",0)},_setMessage:function(a){a=new Element("div",{styles:{"margin-top":"5px"},html:a});this._container.empty();this._container.adopt(a)},_setType:function(a){this._type&&
this._container.removeClass(this._type);this._container.addClass(a);this._type=a}});if(!Rose.ui)Rose.ui={};Rose.ui.statusMessage=new d})();window.Rose||(Rose={});
(function(){var d=new Class({_element:false,_defaultOptions:$H({buttonClass:"rose_canvasButton",borderRadius:3,style:false,defaultStyle:false,disabledStyle:false}),_styles:$H({"default":{fill:"270-#f1f1f1-#e1e1e1:90-#999",stroke:"#c0c0c0",color:"#333",shadow:"#fff"},blue:{fill:"270-#4e6bb4-#405893:90-#999",stroke:"#369",color:"#fff",shadow:"#999"},gray:{fill:"270-#898989-#636363:90-#999",stroke:"#999",color:"#fff",shadow:"#333"}}),_options:$H({}),_disabled:false,_paper:false,_dimensions:{height:0,
width:0,innerHeight:0,innerWidth:0},_button:false,_text:false,_textShadow:false,_primaryIcon:false,_secondaryIcon:false,_context:"single",container:false,initialize:function(a,b){if(b)this._options=$H(b);this._options.combine(this._defaultOptions);this._element=$(a);var c=this._element.getCoordinates(),f=this.getText();this._dimensions.height=23;this._dimensions.innerHeight=22;this._dimensions.width=c.width+10;this._dimensions.innerWidth=this._dimensions.width-1;this.container=new Element("div",{styles:{margin:0,
padding:0,width:this._dimensions.innerWidth,"float":"left"}});this._options.get("buttonClass")&&this.container.addClass(this._options.get("buttonClass"));if(parseInt(this._element.getStyle("width"))){this._dimensions.width=parseInt(this._element.getStyle("width"))+10;this._dimensions.innerWidth=this._dimensions.width-1}if(parseInt(this._element.getStyle("height"))){this._dimensions.height=parseInt(this._element.getStyle("height"));this._dimensions.innerHeight=this._dimensions.height-1}this.container.inject(this._element,
"after");$(document.body).adopt(this._element);this._paper=Raphael(this.container,this._dimensions.width,this._dimensions.height);this._button=this._paper.rect(0,0,this._dimensions.innerWidth,this._dimensions.innerHeight,this._options.get("borderRadius"));this.setText(f);this.setPrimaryIcon();this.setSecondaryIcon();this._options.get("defaultStyle")||this._options.set("defaultStyle",this._styles.get("default"));this._options.get("style")&&this._options.set("defaultStyle",this._options.get("style"));
this._options.get("disabledStyle")||this._options.set("disabledStyle",this._options.get("defaultStyle"));this._element.get("class").length&&this._element.get("class").split(" ").each(function(e){if(this._styles.get(e))style=e}.bind(this));this.setStyle(this._options.get("defaultStyle"));this._registerEvents();this.registerClickTarget();this._element.setStyle("display","none");this._element.disposeWith(this.container);this._element.get("disable")&&this.setDisabled(true)},registerClickTarget:function(){this._element.setStyle("display",
"");this._element.setStyles({position:"absolute",top:this.container.getCoordinates().top,left:this.container.getCoordinates().left,width:this._button.attr("width"),height:this._button.attr("height"),display:"block",background:"#000",opacity:0.01,"z-index":1E5});this._disabled&&this._element.setStyle("display","none")},setText:function(a){this._text=this._paper.text(this._dimensions.width/2,this._dimensions.height/2,a);this._textShadow=this._paper.text(this._paper.width/2,this._paper.height/2-1,a);
this._textShadow.insertBefore(this._text);this._text.attr({"font-size":"10px","font-weight":"bold",fill:"#333"});this._textShadow.attr({"font-size":"10px","font-weight":"bold",fill:"#fff"})},getText:function(){if(this._element.get("label"))return this._element.get("label");switch(this._element.get("tag")){case "input":return this._element.get("value");case "a":case "span":return this._element.get("text")}},setStyle:function(a){this._button.attr({fill:a.fill,stroke:a.stroke});this._text.attr({fill:a.color});
this._textShadow.attr({fill:a.shadow})},setPrimaryIcon:function(){var a=this._element.get("icon");if(!a)return false;this._dimensions.width+=26;this._dimensions.innerWidth+=24;this._paper.setSize(this._dimensions.width,this._dimensions.height);this._button.attr({x:0,width:this._dimensions.innerWidth});this.container.setStyles({width:this._dimensions.innerWidth});this._text.attr({x:this._dimensions.width/2+10});this._textShadow.attr({x:this._dimensions.width/2+10});var b=this._dimensions.height;b%
2!=0&&b--;this._primaryIcon=this._paper.image(a,7,b/2-8,16,16)},setSecondaryIcon:function(){var a=this._element.get("secondary-icon");if(!a)return false;this._dimensions.width+=10;this._dimensions.innerWidth+=8;this._paper.setSize(this._dimensions.width,this._dimensions.height);this._button.attr({x:0,width:this._dimensions.innerWidth});this.container.setStyles({width:this._dimensions.innerWidth});var b=this._dimensions.height;b%2!=0&&b--;this._secondaryIcon=this._paper.image(a,this._dimensions.width-
16,b/2-2,6,4)},setDisabled:function(a){if(this._disabled=a){this._element.setStyle("display","none");this.setStyle(this._options.get("disabledStyle"));this._primaryIcon&&this._primaryIcon.attr({opacity:0.5});this._secondaryIcon&&this._secondaryIcon.attr({opacity:0.5})}else{this._element.setStyle("display","");this.setStyle(this._options.get("defaultStyle"));this._primaryIcon&&this._primaryIcon.attr({opacity:1});this._secondaryIcon&&this._secondaryIcon.attr({opacity:1})}},setContext:function(){},getNode:function(){return this._button.node},
_registerEvents:function(){this._button.node.onmouseover=function(){this.registerClickTarget()}.bind(this);this._element.addEvents({mousedown:function(a){this._disabled?a.stop():this._button.rotate(180,true)}.bind(this),mouseup:function(a){if(this._disabled)a.stop();else{this._button.rotate(0,true);this._element.get("tag")=="input"&&this._element.get("type")=="submit"&&$(this._button.node).getParents("form").length&&$(this._button.node).getParents("form")[0].submit()}}.bind(this)})}});Element.implement({canvasButton:function(a){if(this.retrieve("canvasButton"))return this.retrieve("canvasButton");
this.store("canvasButton",new d(this,a));return this},canvasButtonGroup:function(a){var b=this.getChildren().length;this.getChildren().each(function(c,f){var e=new d(c,a);c.store("canvasButton",e);var g=e._options.get("borderRadius");if(f>=1){if(f<b-1)g*=2;e._button.attr({x:"-"+e._options.get("borderRadius"),width:e._button.attr("width")+g});e._paper.path("M0 0L0 100").attr({stroke:e._button.attr("stroke")})}else e._button.attr({width:e._button.attr("width")+g})});return this}})})();
window.Rose||(Rose={});
(function(){var d=new Class({Implements:Options,_mask:false,_container:false,_title:false,_content:false,_buttons:false,_close:false,_loadingIndicator:false,options:{destroyOnClose:false,modalClass:"modal",mask:true,content:false,height:150,width:300,onSubmit:$empty,onCancel:$empty,onOpen:$empty,onClose:$empty},initialize:function(a){this.setOptions(a);this._container=(new Element("div",{"class":this.options.modalClass,styles:{position:"absolute",top:0,left:0,width:this.options.width,opacity:0},tween:{duration:250},
morhph:{duration:250}})).adopt(this.options.content);this._title=this._container.getFirst();this._content=this._container.getFirst().getNext();if(this._container.getChildren().length>2)this._buttons=this._container.getLast();if(this._title.getElements("a"))this._close=this._title.getElements("a").pop();this._close&&this._close.addEvent("click",this.close.bind(this));if(this._buttons){this._buttons.getElements("a.cancel").addEvent("click",this.options.onCancel.bind(this));this._buttons.getElements("a.submit").addEvent("click",
this.options.onSubmit.bind(this))}$(document.body).adopt(this._container);new Drag(this._container,{handle:this._title})},hide:function(a){var b=$empty;if(a)b=a;this._container.set("morph",{onComplete:b.bind(this),duration:250});this._container.morph({opacity:0,top:this._container.getCoordinates().top+50});this.options.onClose.bind(this).run([])},close:function(a){a&&a.stop();this.hide(function(){this._container.destroy()}.bind(this))},show:function(a){var b=$(window).getCoordinates(),c=this._container.getCoordinates(),
f=b.height/2-c.height/2;this._container.setStyles({left:b.width/2-c.width/2,top:f-50});b=$empty;if(a)b=a;this._container.set("morph",{onComplete:b.bind(this),duration:250});this._container.morph({opacity:1,top:f});this.options.onOpen.bind(this).run([])}});if(!Rose.ui)Rose.ui={};Rose.ui.simpleModal=d})();window.Rose||(Rose={});
(function(){var d=new Class({_defaultOptions:$H({stroke:"#999",fill:"r(0.25, 0.25)#fff-#ccc",shadowFill:"r(0.5, 0.5)#000-#fff",radius:12,duration:500,mask:true,maskFill:"#333",maskOpacity:0.75,textColor:"#fff",text:"Working..."}),_options:$H({}),_container:false,_paper:false,_circle:false,_shadow:false,_mask:false,_shadowOffset:false,_timer:false,initialize:function(a,b){this._container=$(a);if(b)this._options=$H(b);this._options.combine(this._defaultOptions);var c=this._options.get("radius")*8,f=
this._options.get("radius")*3,e=this._options.get("radius")*4;this._shadowOffset=this._options.get("radius")/2;this._paper=new Raphael(this._container,c,c);this._circle=this._paper.circle(e,f,this._options.get("radius"));this._shadow=this._paper.circle(e,f,this._options.get("radius"));this._shadow.toBack();this._circle.attr({fill:this._options.get("fill"),stroke:this._options.get("stroke"),"fill-opacity":1});this._shadow.attr({stroke:false,fill:this._options.get("shadowFill"),"fill-opacity":0.25});
if(this._options.get("mask")){this._shadow.attr({fill:"r(0.5, 0.5)#333-#666","fill-opacity":0.2});this._mask=this._paper.rect(0,0,c-2,c-2,4);this._mask.attr({fill:this._options.get("maskFill"),opacity:this._options.get("maskOpacity"),stroke:false});this._mask.toBack();this._paper.text(c/2,c-20,this._options.get("text")).attr({fill:this._options.get("textColor")})}this._container.fade("hide");this._container.set("tween",{duration:150})},show:function(){this._container.fade("in");this._animateUp();
this._timer=setInterval(this._animateUp.bind(this),this._options.get("duration")*2+250)},hide:function(){this._container.fade("out");setTimeout(function(){this._timer&&clearInterval(this._timer)}.bind(this),500)},_animateUp:function(){this._circle.animate({r:this._options.get("radius")*1.25},this._options.get("duration"),this._animateDown.bind(this));this._shadow.animateWith(this._circle,{r:(this._options.get("radius")+this._shadowOffset)*1.25,cy:this._options.get("radius")*3.5},this._options.get("duration"))},
_animateDown:function(){this._circle.animate({r:this._options.get("radius")},this._options.get("duration"));this._shadow.animateWith(this._circle,{r:this._options.get("radius"),cy:this._options.get("radius")*3},this._options.get("duration"))}});if(!Rose.ui)Rose.ui={};Rose.ui.throbber=d})();window.Rose||(Rose={});
(function(){var d=new Class({container:false,children:false,linkContainer:false,_defaultOptions:$H({linkContainerClass:"tab-box-header",linkActiveClass:"tab-header-active"}),_options:$H({}),initialize:function(a,b){if(b)this._options=$H(b);this._options.combine(this._defaultOptions);this.container=a;this.children=this.container.getChildren();this.linkContainer=new Element("div",{"class":this._options.get("linkContainerClass"),styles:{margin:0,padding:0}});this.linkContainer.injectBefore(this.container);
var c=this.children.length,f=this.container.getSize().x/c,e=0,g=this._options.get("linkActiveClass");this.children.each(function(h,j){var i=h.getFirst();this.linkContainer.grab(i);i.setStyles({display:"block","float":"left",width:f+"px","text-align":"center"});i.addEvent("click",function(k){k.stop();this.linkContainer.getChildren().removeClass(g);i.addClass(g);this.children.setStyle("display","none");h.setStyle("display","")}.bind(this));if(h.getSize().y>e){e=h.getSize().y;this.container.setStyle("height",
e+10)}j>0?h.setStyle("display","none"):i.addClass(g)}.bind(this))}});Element.implement({tabBox:function(a){new d(this,a);return this}});if(!Rose.ui)Rose.ui={};Rose.ui.tabBox=d})();window.Rose||(Rose={});
(function(){var d=new Class({_mask:false,_container:false,_titleContainer:false,_contentContainer:false,_buttonContainer:false,_loadingIndicator:false,_defaultOptions:$H({mode:"determinate",title:false,content:false,submit:"Save",cancel:"Cancel",destroyOnClose:false,loadingIndicator:true,mask:true,height:150,width:300,onSubmit:$empty,onCancel:$empty,onOpen:$empty,onClose:$empty}),_options:$H({}),initialize:function(a){if(a)this._options=$H(a);this._options.combine(this._defaultOptions);this._titleContainer=
new Element("div",{"class":"rose_modal_title",html:this._options.get("title")});this._options.get("mode")=="determinate"&&this._titleContainer.adopt((new Element("a",{href:"#","class":"rose_modal_closeLink",events:{click:this._destroy.bind(this)},styles:{position:"absolute",right:10,top:2}})).adopt(new Element("span",{text:"Close"})));this._contentContainer=new Element("div",{"class":"rose_modal_content",styles:{width:this._options.get("width"),height:this._options.get("height")}});this._buttonContainer=
new Element("div",{"class":"rose_modal_buttonBar",styles:{position:"absolute",bottom:0,left:0}});this._container=(new Element("div",{"class":"rose_modal_container",styles:{position:"fixed",opacity:0,top:0,left:0},tween:{duration:250},morph:{duration:250}})).adopt(this._titleContainer,this._contentContainer,this._buttonContainer);Browser.Engine.trident&&this._container.setStyle("border-width",1);this._updateContent();this._options.get("mode")=="determinate"&&this._updateButtons();this._options.set("onOpen",
this._options.get("onOpen").bind(this));this._options.set("onClose",this._options.get("onClose").bind(this));this._options.set("onCancel",this._options.get("onCancel").bind(this));this._options.set("onSubmit",this._options.get("onSubmit").bind(this));$(document.body).adopt(this._container)},display:function(){this._show();return this},close:function(a){if(a||this._options.get("destroyOnClose"))return this._destroy();this._hide();return this},set:function(a,b){this._options.has(a)&&this._options.set(a,
b);switch(a){case "content":this._updateContent();break;case "submit":case "cancel":case "mode":this._updateButtons();break}return this},loading:function(a){if(this._loadingIndicator){if(a){this._loadingIndicator.show();return this}this._loadingIndicator.hide();return this}},_show:function(a){var b=$(window).getCoordinates(),c=this._container.getCoordinates(),f=b.width/2-c.width/2;c=b.height/2-c.height/2;if(this._options.get("mask")){this._mask=new Element("div",{styles:{background:"#333",position:"fixed",
top:0,left:0,width:b.width,height:b.height,opacity:0},events:{click:this._destroy.bind(this)},tween:{duration:250}});this._mask.inject(this._container,"before")}this._container.setStyles({left:f,top:c-50});b=$empty;if(a)b=a;this._container.set("morph",{onComplete:b.bind(this),duration:250});this._container.morph({opacity:1,top:c});this._mask&&this._mask.tween("opacity",0.25);this._buttonContainer.getChildren("a").canvasButton();this._options.get("onOpen").bind(this).run([])},_hide:function(a){var b=
$empty;if(a)b=a;this._container.set("morph",{onComplete:b.bind(this),duration:250});this._container.morph({opacity:0,top:this._container.getCoordinates().top+50});this._mask&&this._mask.tween("opacity",0);this._options.get("onClose").bind(this).run([])},_destroy:function(a){a&&a.stop();this._hide(function(){this._container.destroy();this._mask&&this._mask.destroy()})},_handleSubmit:function(a){a.stop();this._options.get("onSubmit").bind(this).run([])},_handleCancel:function(a){a.stop();this._options.get("onCancel").bind(this).run([]);
this._destroy()},_updateContent:function(){this._contentContainer.empty();typeof this._options.get("content")=="object"?this._contentContainer.adopt(this._options.get("content")):this._contentContainer.set("html",this._options.get("content"));if(this._options.get("mode")=="determinate"){this._contentContainer.addClass("rose_modal_content");this._contentContainer.removeClass("rose_modal_contentIndeterminate")}else{this._contentContainer.addClass("rose_modal_contentIndeterminate");this._contentContainer.removeClass("rose_modal_content")}},
_updateButtons:function(){var a=[];this._buttonContainer.empty();this._buttonContainer.setStyle("display","none");this._options.get("submit")&&a.push(new Element("a",{href:"#","class":"active-button submit",text:this._options.get("submit"),events:{click:this._handleSubmit.bind(this)}}));this._options.get("cancel")&&a.push(new Element("a",{href:"#","class":"active-button cancel",text:this._options.get("cancel"),events:{click:this._handleCancel.bind(this)}}));if(this._options.get("loadingIndicator")){var b=
new Element("div",{styles:{"float":"left",width:"24px",height:"24px",position:"relative",top:"-3px"}});this._loadingIndicator=new Rose.ui.throbber(b,{radius:4,mask:false});a.push(b)}if(a.length){this._buttonContainer.setStyle("display","");this._buttonContainer.adopt(a)}}});if(!Rose.ui)Rose.ui={};Rose.ui.modal=d})();window.Rose||(Rose={});
(function(){var d=new Class({_defaultOptions:$H({content:false,submit:"Save",cancel:"Cancel",destroyOnClose:false,loadingIndicator:true,mask:true,onSubmit:$empty,onCancel:$empty,onOpen:$empty,onClose:$empty}),_options:$H({}),_container:false,_contentContainer:false,_topContainer:false,_bottomContainer:false,_buttonContainer:false,_loadingIndicator:false,_target:false,_boundClickObserver:false,initialize:function(a,b){if(b)this._options=$H(b);this._target=$(a);this._options.combine(this._defaultOptions);
this._topContainer=new Element("div",{"class":"rose_popupModal_top"});this._bottomContainer=new Element("div",{"class":"rose_popupModal_bottom"});var c=new Element("div",{"class":"rose_popupModal_content"});this._buttonContainer=new Element("div",{"class":"rose_popupModal_buttonBar"});this._container=(new Element("div",{"class":"rose_popupModal_container",styles:{position:"absolute"}})).adopt(this._topContainer,c,this._buttonContainer,this._bottomContainer);this._contentContainer=new Element("div",
{styles:{padding:"0 15px"}});c.adopt(this._contentContainer);this._updateContent();this._updateButtons();this._container.fade("hide");this._container.set("tween",{duration:100});$(document.body).adopt(this._container);this._boundClickObserver=function(){this.hide(true)}.bind(this)},show:function(){var a=this._target.getCoordinates(),b=a.top-this._container.getSize().y;a=a.left+a.width/2-this._container.getSize().x/2;this._container.setStyles({top:b,left:a});this._container.fade("in");$(document.body).addEvent("click",
this._boundClickObserver);this._container.addEvents({mouseenter:function(){$(document.body).removeEvent("click",this._boundClickObserver)}.bind(this),mouseleave:function(){$(document.body).addEvent("click",this._boundClickObserver)}.bind(this)});this._buttonContainer.getChildren("a").canvasButton();this._options.get("onOpen").bind(this).run([]);return this},hide:function(a){$(document.body).removeEvent("click",this._boundClickObserver);this._container.fade("out");a&&a===true&&this._destroy();this._options.get("onClose").bind(this).run([]);
return this},loading:function(a){if(this._loadingIndicator){if(a){this._loadingIndicator.show();return this}this._loadingIndicator.hide();return this}},getContents:function(){return this._contentContainer.getFirst()},getTarget:function(){return this._target},_destroy:function(){this.hide();setTimeout(function(){this._container.destroy()}.bind(this),150)},_updateContent:function(){this._contentContainer.empty();typeof this._options.get("content")=="object"?this._contentContainer.adopt(this._options.get("content")):
this._contentContainer.set("html",this._options.get("content"))},_handleSubmit:function(a){a.stop();this._options.get("onSubmit").bind(this).run([])},_handleCancel:function(a){a.stop();this._options.get("onCancel").bind(this).run([]);this.hide(true)},_updateButtons:function(){var a=[];this._buttonContainer.empty();this._buttonContainer.setStyle("display","none");this._options.get("submit")&&a.push(new Element("a",{href:"#","class":"active-button submit",text:this._options.get("submit"),events:{click:this._handleSubmit.bind(this)}}));
this._options.get("cancel")&&a.push(new Element("a",{href:"#","class":"active-button cancel",text:this._options.get("cancel"),events:{click:this._handleCancel.bind(this)}}));if(this._options.get("loadingIndicator")){var b=new Element("div",{styles:{width:"24px",height:"24px","float":"left"}});this._loadingIndicator=new Rose.ui.throbber(b,{radius:4,mask:false});a.push(b)}if(a.length){this._buttonContainer.setStyle("display","");this._buttonContainer.adopt(a)}}});if(!Rose.ui)Rose.ui={};Rose.ui.popupModal=
d})();window.Rose||(Rose={});
(function(){var d=new Class({_container:false,_slides:false,_pagerContainer:false,_defaultOptions:$H({autoStart:true,pauseOnHover:true,slideClass:"slide",descriptionClass:"description",pagerContainerClass:"pagers",pagerActiveClass:"active",showPagers:false,onStart:$empty,onStop:$empty,onNext:$empty,onPrevious:$empty}),_options:$H({}),_currentIndex:0,_boundSlideEvent:false,_boundPauseEvent:false,_boundPlayEvent:false,_timer:false,initialize:function(a,b){this._container=$(a);if(b)this._options=$H(b);
this._options.combine(this._defaultOptions);this._slides=a.getChildren();this._container.setStyles({position:"relative",overflow:"hidden"});this._pagerContainer=new Element("div");this._options.get("pagerContainerClass")&&this._pagerContainer.addClass(this._options.get("pagerContainerClass"));this._pagerContainer.injectBefore(this._container);var c=this._container.getSize().x;this._slides.each(function(f,e){f.setStyles({display:"block",position:"absolute",top:0,left:0});this._options.get("slideClass")&&
f.addClass(this._options.get("slideClass"));var g=f.getLast(),h=parseInt(g.getStyle("margin"));h||(h=10);g.setStyles({display:"block",position:"absolute",bottom:h/2+"px",left:h/2+"px",margin:"auto",width:c-h*2});this._options.get("descriptionClass")&&g.addClass(this._options.get("descriptionClass"));e>0&&f.fade("hide")}.bind(this));this._boundSlideEvent=this.next.bind(this);this._boundPlayEvent=this.start.bind(this);this._boundPauseEvent=this.pause.bind(this);this._buildPagers();this.start();this.goTo(0)},
start:function(){this._timer=setInterval(this._boundSlideEvent,5E3);if(this._options.get("pauseOnHover")){this._container.addEvent("mouseenter",this._boundPauseEvent);this._container.addEvent("mouseleave",this._boundPlayEvent)}},pause:function(){clearInterval(this._timer)},stop:function(){clearInterval(this._timer);if(this._options.get("pauseOnHover")){this._container.removeEvent("mouseenter",this._boundPauseEvent);this._container.removeEvent("mouseleave",this._boundPlayEvent)}},next:function(){this.goTo(this._currentIndex+
1)},previous:function(){this.goTo(this._currentIndex-1)},goTo:function(a){if(a>=this._slides.length)a=0;else if(a<0)a=this._slides.length-1;var b=this._slides[a];this._slides[this._currentIndex].fade("out");b.fade("in");this._currentIndex=a;b=false;if(b=this._options.get("pagerActiveClass")){this._pagerContainer.getChildren().removeClass(b);this._pagerContainer.getChildren(".pager"+a).addClass(b)}},_buildPagers:function(){for(var a=0;a<this._slides.length;a++)this._pagerContainer.adopt(new Element("a",
{href:"#",text:a+1,rel:a,"class":"pager"+a,events:{click:function(b){b.stop();this.stop();this.goTo(b.target.get("rel"))}.bind(this)}}))}});Element.implement({slideShow:function(a){new d(this,a);return this}})})();window.Rose||(Rose={});
(function(){if(!Rose.ui)Rose.ui={};var d=new Class({_options:$H({}),_defaults:$H({slideSelector:"slide",controlSelector:"control",controlContainerSelector:"controls",descriptionSelector:"description",onStart:$empty,onStop:$empty,onNext:$empty,onPrevious:$empty,onTick:$empty}),_container:false,initialize:function(a,b){this._container=a;if(b)this._options=$H(b);this._options.combine(this._defaults)}});Element.implement({multiBox:function(){new d(this);return this}});Rose.ui.multiBox=d})();
