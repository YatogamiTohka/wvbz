//接口调试路径
const path = 'http://192.168.1.118:8080';

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

//图片上传（layer, upload, $, 主体, 定义参数）
function uploadImages(layer, upload, $, mainObj, option) {
    var imgInput = mainObj.find('input'),
        imgList = mainObj.find('.sys-upload-body-list');

    var options = $.extend({
        elem: '.sys-upload-button',
        url: '',
        multiple: false,
        size: 2048,
        number: 5,
        exts: 'jpg|png|gif|jpeg',
        choose: function(obj) {
            var files = this.files = obj.pushFile();

            obj.preview(function(index, file, result) {
                var imgItem = $('<span class="sys-upload-body-img"><img src="' + result + '" alt="' + file.name + '"><i class="sys-upload-body-img-del" title="删除"></i></span>');

                //删除图片
                imgItem.find('.sys-upload-body-img-del').on('click', function() {
                    delete files[index];
                    imgItem.remove();
                    uploadListIns.config.elem.next()[0].value = '';
                });
                imgInput.val('123');

                if (!option.multiple) {
                    imgList.html(imgItem);
                } else {
                    imgList.append(imgItem);
                }
            });
        },
        //上传成功
        done: function(res) {
            // imgInput.val('123');
        },
        //上传失败
        error: function(index, upload) {
            // imgList.html('');
            // layer.msg('上传失败，请重新上传');
        }
    }, option);

    var uploadListIns = upload.render(options);
}

//公共表格参数
function setTableOptions(option) {
    var options = $.extend({
        id: 'dataList',
        elem: '#dataList',
        url: '',
        method: 'post',
        where: {},
        response: {
            statusCode: 'SUCCESS',
            countName: 'objects.total',
            dataName: 'objects.list'
        },
        request: {
            pageName: 'pageNum',
            limitName: 'pageSize'
        },
        cellMinWidth: 80,
        page: {
            layout: ['prev', 'page', 'next', 'count', 'limit', 'skip'],
            groups: 5
        },
        limits: [20, 50, 100],
        limit: 0,
        height: 0,
        cols: []
    }, option);

    return options;
}