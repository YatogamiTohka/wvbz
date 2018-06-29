//日期格式化
Date.prototype.format = function(format) {
    /* 
     * eg:format="yyyy-MM-dd hh:mm:ss"; 
     */
    var o = {
        "M+": this.getMonth() + 1, // month  
        "d+": this.getDate(), // day  
        "h+": this.getHours(), // hour  
        "m+": this.getMinutes(), // minute  
        "s+": this.getSeconds(), // second  
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter  
        "S": this.getMilliseconds() // millisecond  
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

//获取路径参数（会自动判断编码方式 并解码）
function getUrlParam(name, transformFn) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var resultArray = window.location.search.substr(1).match(reg);

    if (!resultArray) {
        return null;
    }

    var value = resultArray[2];

    // 指定不使用编码转换方法时，直接返回原参数值
    if (transformFn === false) {
        return value;
    }
    // 使用指定的 编码转换方法 转换参数值
    else if (typeof transformFn == "function") {
        return transformFn(value);
    }

    if (!value) {
        return value;
    }

    // 使用 escape 才可能生成 %u 的编码
    if (value.indexOf("%u") >= 0) {
        return unescape(value);
    }
    // 没有 escape 且至少有3个 % 时，才认为是 encodeURI 的值
    else if (/(%.+){3}/g.test(value)) {
        return decodeURI(value);
    }

    return unescape(value);
}