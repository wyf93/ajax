function ajax(options) {

	//数据编码
	function encodeData() {
		var name;
		var value;
		if(data) {
			if(typeof data === 'string') {
				data = data.split('&');
				for(var i=0;i<data.length;i++) {
					name = data[i].spilt('=')[0];
					value = data[i].spilt('=')[1];
					data = encodeURIComponent(name) + '=' + encodeURIComponent(value);
				}
				data = data.replace('/%20/g', '+');
			} else if(typeof data === 'object') {
				var arr = [];
				for(var key in data) {
					name = encodeURIComponent(key);
					value = encodeURIComponent(data[key].toString());
					arr.push(name + '=' + value);
				}
				data = arr.join('&').replace('/%20/g', '+0');
			}
			//若使用get方法或jsonp,则手动添加到URl中
			if(type === 'get' || dataType === 'jsonp') {
				url += url.indexOf('?')>-1 ? data:'?' + data;
			}
		}
	}

	//XMLHttpRequerst
	function createXHR() {
		function getXHR() {
			if(window.XMLHttpRequest) {
				return new XMLHttpRequest();
			} else {
				//遍历IE中不同版本的ActiveX对象
				var versions = ["Microsoft", "msxm3", "msxml2", "msxml1"];
				for(var i=0;i<versions.length;i++) {
					try {
						var version = versions[i] + ".XMLHTTP";
						return new ActiveXObject(version);
					} catch(e) {

					}
				}
			}
		}
		//创建对象
		xhr = getXHR();
		xhr.open(type, url, async);
		//设置请求头
		if(type === 'post' && !contentType) {
			//若是post提交，则设置content-Type 为application/x-www-four-urlencoded
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
		} else if(contentType) {
			xhr.setRequestHeader("Content-Type", contentType);
		}
		//添加监听
		xhr.onreadystatechange = function () {
			if(xhr.readyState === 4) {
				if (timeOut !== undefined) {
	                //由于执行abort()方法后，有可能触发onreadystatechange事件，
	                //所以设置一个timeout_bool标识，来忽略中止触发的事件。
	                if (timeout_bool) {
	                    return;
	                }
	                clearTimeout(timeout_flag);
	            }
				if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
					success(xhr.responseText);
				} else {
					error(xhr.status, xhr.statusText);
				}
			}
		}
		//发送请求
		xhr.send(type === 'get'? null:data);
		setTime(); //请求超时
	}

	//创建jsonp
	function createJsonp() {
	    var script = document.createElement("script"),
	        timeName = new Date().getTime() + Math.round(Math.random() * 1000),
	        callback = "JSONP_" + timeName;

	    window[callback] = function(data) {
	    	clearTimeout(timeout_flag);
	        document.body.removeChild(script);
	        success(data);
	    }
	      script.src = url +  (url.indexOf("?") > -1 ? "" : "?") + "callback=" + callback;
	    script.type = "text/javascript";
	    document.body.appendChild(script);
	    setTime(callback, script);
	}

	var timeout_flag = null, //定时器标识
	    timeout_bool = false;//是否请求超时
	//设置请求超时
	function setTime(callback, script) {
	    if (timeOut !== undefined) {
	        timeout_flag = setTimeout(function() {
	            if (dataType === "jsonp") {
	                delete window[callback];
	                document.body.removeChild(script);

	            } else {
	                timeout_bool = true;
	                xhr && xhr.abort();
	            }
	            console.log("timeout");

	        }, timeOut);
	    }
	}

	var url = options.url || '', //请求的链接
		type = (options.type || 'get').toLowercase(), //请求方法，默认为get
		data = options.data || null, //请求的数据
		contentType = options.contentType || '', //请求头
		dataType = options.dataType || '', //请求的数据类型
	    async = options.async === undefined && true, //是否异步，默认为true
	    timeOut = options.timeOut, //超时时间
	    before = options.before || function(){}, //发送之前执行的函数
	    error = options.error || function(){},　//发生错误执行的函数
	    success = options.success || function(){} //请求成功的回调函数
	    var timeout_bool = false, //是否请求超时
        timeout_flag = null, //超时标识
        xhr = null; //xhr对角
	    encodeData();
	    before();
	    if (dataType === "jsonp") {
	        createJsonp();
	    } else {
	        createXHR();
	    }
}

//数据编码
function encodeData() {
	var name;
	var value;
	if(data) {
		if(typeof data === 'string') {
			data = data.split('&');
			for(var i=0;i<data.length;i++) {
				name = data[i].spilt('=')[0];
				value = data[i].spilt('=')[1];
				data = encodeURIComponent(name) + '=' + encodeURIComponent(value);
			}
			data = data.replace('/%20/g', '+');
		} else if(typeof data === 'object') {
			var arr = [];
			for(var key in data) {
				name = encodeURIComponent(key);
				value = encodeURIComponent(data[key].toString());
				arr.push(name + '=' + value);
			}
			data = arr.join('&').replace('/%20/g', '+0');
		}
		//若使用get方法或jsonp,则手动添加到URl中
		if(type === 'get' || dataType === 'jsonp') {
			url += url.indexOf('?')>-1 ? data:'?' + data;
		}
	}
}

//XMLHttpRequerst
function createXHR() {
	function getXHR() {
		if(window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else {
			//遍历IE中不同版本的ActiveX对象
			var versions = ["Microsoft", "msxm3", "msxml2", "msxml1"];
			for(var i=0;i<versions.length;i++) {
				try {
					var version = versions[i] + ".XMLHTTP";
					return new ActiveXObject(version);
				} catch(e) {

				}
			}
		}
	}
	//创建对象
	xhr = getXHR();
	xhr.open(type, url, async);
	//设置请求头
	if(type === 'post' && !contentType) {
		//若是post提交，则设置content-Type 为application/x-www-four-urlencoded
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
	} else if(contentType) {
		xhr.setRequestHeader("Content-Type", contentType);
	}
	//添加监听
	xhr.onreadystatechange = function () {
		if(xhr.readyState === 4) {
			if (timeOut !== undefined) {
                //由于执行abort()方法后，有可能触发onreadystatechange事件，
                //所以设置一个timeout_bool标识，来忽略中止触发的事件。
                if (timeout_bool) {
                    return;
                }
                clearTimeout(timeout_flag);
            }
			if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
				success(xhr.responseText);
			} else {
				error(xhr.status, xhr.statusText);
			}
		}
	}
	//发送请求
	xhr.send(type === 'get'? null:data);
	setTime(); //请求超时
}

//创建jsonp
function createJsonp() {
    var script = document.createElement("script"),
        timeName = new Date().getTime() + Math.round(Math.random() * 1000),
        callback = "JSONP_" + timeName;

    window[callback] = function(data) {
    	clearTimeout(timeout_flag);
        document.body.removeChild(script);
        success(data);
    }
      script.src = url +  (url.indexOf("?") > -1 ? "" : "?") + "callback=" + callback;
    script.type = "text/javascript";
    document.body.appendChild(script);
    setTime(callback, script);
}

var timeout_flag = null, //定时器标识
    timeout_bool = false;//是否请求超时
//设置请求超时
function setTime(callback, script) {
    if (timeOut !== undefined) {
        timeout_flag = setTimeout(function() {
            if (dataType === "jsonp") {
                delete window[callback];
                document.body.removeChild(script);

            } else {
                timeout_bool = true;
                xhr && xhr.abort();
            }
            console.log("timeout");

        }, timeOut);
    }
}