L.GeoJSON.AJAX=L.GeoJSON.extend({defaultAJAXparams:{dataType:"json",callbackParam:"callback",middleware:function(e){return e}},initialize:function(e,t){this._urls=[];if(e){if(typeof e==="string"){this._urls.push(e)}else if(typeof e.pop==="function"){this._urls=this._urls.concat(e)}else{t=e;e=undefined}}var a=L.Util.extend({},this.defaultAJAXparams);for(var r in t){if(this.defaultAJAXparams.hasOwnProperty(r)){a[r]=t[r]}}this.ajaxParams=a;this._layers={};L.Util.setOptions(this,t);if(this._urls.length>0){this.addUrl()}},addUrl:function(e){var t=this;if(e){if(typeof e==="string"){t._urls.push(e)}else if(typeof e.pop==="function"){t._urls=t._urls.concat(e)}}var t=this;var a=t._urls.length;var r=0;t.fire("beforeDataLoad");while(r<a){if(t.ajaxParams.dataType.toLowerCase()==="json"){L.Util.ajax(t._urls[r],function(e){var a=t.ajaxParams.middleware(e);t.addData(a);t.fire("dataLoaded")})}else if(t.ajaxParams.dataType.toLowerCase()==="jsonp"){L.Util.ajax(t._urls[r],{jsonp:true},function(e){var a=t.ajaxParams.middleware(e);t.addData(a);t.fire("dataLoaded")},t.ajaxParams.callbackParam)}r++}t.fire("dataLoadComplete")},refresh:function(e){e=e||this._urls;this.clearLayers();this.addUrl(e)},refilter:function(e){if(typeof e!=="function"){this.eachLayer(function(e){e.setStyle({stroke:true,clickable:true})})}else{this.eachLayer(function(t){if(e(t.feature)){t.setStyle({stroke:true,clickable:true})}else{t.setStyle({stroke:false,clickable:false})}})}}});L.geoJson.ajax=function(e,t){return new L.GeoJSON.AJAX(e,t)};L.Util.ajax=function(url,options,cb){var cbName,ourl,cbSuffix,scriptNode,head,cbParam;if(typeof options==="function"){cb=options;options={}}if(options.jsonp){head=document.getElementsByTagName("head")[0];cbParam=options.cbParam||"callback";if(options.callbackName){cbName=options.callbackName}else{cbSuffix="_"+(""+Math.random()).slice(2);cbName="L.Util.ajax.cb."+cbSuffix}scriptNode=L.DomUtil.create("script","",head);scriptNode.type="text/javascript";if(cbSuffix){L.Util.ajax.cb[cbSuffix]=function(e){head.removeChild(scriptNode);delete L.Util.ajax.cb[cbSuffix];cb(e)}}if(url.indexOf("?")===-1){ourl=url+"?"+cbParam+"="+cbName}else{ourl=url+"&"+cbParam+"="+cbName}scriptNode.src=ourl}else{if(window.XMLHttpRequest===undefined){window.XMLHttpRequest=function(){try{return new ActiveXObject("Microsoft.XMLHTTP.6.0")}catch(e){try{return new ActiveXObject("Microsoft.XMLHTTP.3.0")}catch(t){throw new Error("XMLHttpRequest is not supported")}}}}var response,request=new XMLHttpRequest;request.open("GET",url);request.onreadystatechange=function(){if(request.readyState===4&&request.status===200){if(window.JSON){response=JSON.parse(request.responseText)}else{response=eval("("+request.responseText+")")}cb(response)}};request.send()}};L.Util.ajax.cb={};