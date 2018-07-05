//接口调试路径
const path = 'http://192.168.1.17:8080';

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


// 二次封装的 ajax 对象，对外提供 baseAjax、get、post、put、byDelete 方法，每个方法的使用方式 均与 $.ajax 相同
var hcAjax = (function () {
    var myAjax = {};

    // 获取 类ajax 方法的options参数（会兼容 不带URL的单参数 与 加了URL的双参数）
    var getAjaxOptions = function (url, options) {
        if (typeof url === 'object') {
            options = url;
            url = undefined;
        }
        else {
            options = options || {};
            options.url = url;
        }

        return options;
    };

    // 默认的错误提示方法
    var defaultErrorAlert = function (errorMessage, callback) {
        var options = {
            // 默认的 winodw 引用为 当前页面
            windowContext: 'self',
            errorMessage: (errorMessage !== undefined) ? errorMessage : '',
            // （针对异步方式的弹窗）默认 在弹窗销毁时，也会执行callback（因为有时 layer的弹层会被其它弹层销毁掉）
            isDestroyCallback: true
        };

        // 支持 参数对象类型的 errorMessage
        if (typeof errorMessage === 'object') {
            // 合并参数
            $.extend(options, errorMessage);
        }

        // 指定的window对象，如果没有值，则默认使用 本页面的 window对象
        var targetWindow = window[options.windowContext] || window;

        // 如果指定的 window 对象没有 layer，则使用本页面所在 window 对象的 layer
        var targetLayer = targetWindow.layer || window.layer;

        // 如果页面有引入 layer ，则使用 layer.alert 方式弹窗，否则 使用浏览器自带的 alert
        if (targetLayer && targetLayer.alert) {
            targetLayer.alert(options.errorMessage, {
                // 弹窗关闭后，根据 参数中的isDestroyCallback 决定是否调用 callback
                end: (options.isDestroyCallback ? callback : undefined),

                // 不显示右上角关闭按钮
                closeBtn: 0
            }, callback);
        }
        else {
            targetWindow.alert(options.errorMessage);
            callback && callback();
        }
    };
    // 依次从 错误代码集合、响应信息字段、默认错误信息 中获取 错误提示信息
    var getErrorMessage = function (responseJSON) {
        return constVariable.ERROR_CODE_MAP[responseJSON.code] || responseJSON.msg || constVariable.SYSTEM_BUSY_TEXT;
    };
    // 构建 错误提示参数
    var createErrorAlertOptions = function (errorMessage, alertOptions) {
        return $.extend({
            errorMessage: getErrorMessage(errorMessage)
        }, alertOptions);
    };
    // 登录超时的处理逻辑
    var doLogoff = function () {
        window.top.location.href = constVariable.LOGIN_URL;
    };

    // 对 ajax 进行二次封装的主体实现。相比 $.ajax ，额外支持 options.codeError、options.alert 方法（可以很灵活地自定义异常处理）。并且对登录超时做了自动处理，对其它异常自动进行提示
    var baseAjax = function (url, options) {
        options = getAjaxOptions(url, options);

        // 业务规定的默认值，都可以写在这里
        var ajaxOptions = $.extend({
            dataType: 'json'
        }, options);

        // 主要处理ajax事件回调
        var processAjaxOptions = function (bizDeferred) {
            // 保存原参数的 success、error 引用
            var originalSuccessCallback = options.success || $.noop;
            var originalErrorCallback = options.error || $.noop;
            // 可以通过 options.alert 自定义 错误提示方式
            var errorAlert = options.alert || defaultErrorAlert;

            // 默认对 success 进行通用业务处理
            ajaxOptions.success = function (responseJSON, textStatus, jqXHR) {
                var responseCode = responseJSON.code;

                // 先处理通用异常
                if (responseCode === constVariable.USER_LOGOFF_CODE) {
                    var logoffAlertOptions = createErrorAlertOptions(responseJSON, options.alertOptions);

                    // 通过判断 提示回调 的参数长度，区分 同步/异步 弹窗
                    if (errorAlert.length >= 2) {
                        // 异步方式的弹窗，则将 默认跳转行为 放在回调方法中（所以在 options.alert 方法内可以通过不执行此 此回调 来阻止默认行为）
                        errorAlert(logoffAlertOptions, doLogoff);
                    }
                    else {
                        // 同步方式的弹窗，可以在 options.alert 执行后返回 false 来阻止登录会话过期时 跳转到登录页面 的默认行为
                        if (errorAlert(logoffAlertOptions) !== false) {
                            doLogoff();
                        }
                    }

                    // 发生异常 则不执行后续流程
                    return;
                }

                // 根据 code 判断 此次请求是否返回正常数据
                if (responseCode !== constVariable.AJAX_SUCCESS_CODE) {
                    console.warn('ajax 数据请求完成，但响应数据异常，业务状态码 [%s] ，提示信息 [%s]' , responseCode, responseJSON.msg);

                    // 创建 错误提示参数 TODO: 支持外部自定义扩展 ERROR_CODE_MAP
                    var errorAlertOptions = createErrorAlertOptions(responseJSON, options.alertOptions);

                    // 没有设置业务错误处理回调 options.codeError ，或者该回调没有返回 false ，则会自动调用错误提示方法
                    if (!options.codeError || (options.codeError.call(this, responseJSON, textStatus, jqXHR) !== false)) {
                        // 提供 快捷取消默认错误提示 的设置（将 options.alert 设置为 false，则不会出现默认提示）
                        if (options.alert !== false) {
                            errorAlert(errorAlertOptions);
                        }
                    }

                    // 貌似并没有什么方法能让外部控制 errorAlert 的默认行为，除非将 errorAlert 也包装成 Deferred 对象
                    bizDeferred && bizDeferred.reject(responseJSON, textStatus, jqXHR);

                    return;
                }

                // 请求成功后返回的真正数据
                var dataObjects = responseJSON.objects || {};

                // 业务数据正常返回下，再调用原来的success方法（第一个参数改为 响应数据的objects属性，完整的响应数据由第四个参数传递）
                originalSuccessCallback.call(this, dataObjects, textStatus, jqXHR, responseJSON);

                // done方法接收的参数 与 success 方法相同的参数，保持一致性的调用习惯
                bizDeferred && bizDeferred.resolve(dataObjects, textStatus, jqXHR, responseJSON);
            };

            // 默认对 error 进行通用错误处理
            ajaxOptions.error = function (jqXHR, textStatus, errorThrown) {
                // 如果没有默认错误提示，且外部错误回调也没有返回 false ，则会自动调用错误提示方法
                if ((options.alert !== false) && (originalErrorCallback.call(this, jqXHR, textStatus, errorThrown) !== false)) {
                    var errorMessageMap = {
                        0: constVariable.NETWORK_ERROR_TEXT,
                        // 404 时，传入接口地址 url （已去掉查询参数）
                        404: constVariable.NOT_FOUND_TEXT.replace('%url', options.url.replace(/\?.*$/, '')),
                    };

                    errorAlert(errorMessageMap[jqXHR.status] || constVariable.SYSTEM_BUSY_TEXT);
                }

                bizDeferred && bizDeferred.reject(jqXHR, textStatus, errorThrown);
            };

            // console.log('ajaxOptions', ajaxOptions);
        };

        // 如果指定返回 $.ajax 原生 Deferred 对象，则不额外包装一层 处理业务错误的 Deferred 对象
        if (options.returnOriginalDeferred === true) {
            delete options.returnOriginalDeferred;
            processAjaxOptions();

            return $.ajax(ajaxOptions);
        }

        // 默认返回的 Deferred 对象会处理 返回值状态（非 SUCCESS 弹窗提示业务错误，成功状态会返回 objects 字段的值）
        return $.Deferred(function (deferred) {
            processAjaxOptions(deferred);
            $.ajax(ajaxOptions);
        });
    };
    myAjax.baseAjax = baseAjax;

    // get 方法需要单独加 `cache: false` 选项
    myAjax.get = function (url, options) {
        return baseAjax($.extend({
            cache: false,
            method: 'get'
        }, getAjaxOptions(url, options)));
    };

    // 为 post、put、delete 方法 提供快捷方式
    $.each(['post', 'put', 'delete'], function (i, method) {
        myAjax[method] = function (url, options) {
            var ajaxSettings = $.extend({
                method: method,
                // 非 GET 类型的请求，发送数据时 使用JSON格式
                contentType: 'application/json'
            }, getAjaxOptions(url, options));

            // 如果发送的数据是对象，则自动转成 JSON 格式
            if ($.isPlainObject(ajaxSettings.data)) {
                ajaxSettings.data = JSON.stringify(ajaxSettings.data);
            }

            return baseAjax(ajaxSettings);
        };
    });
    // 因为 delete 是关键字，所以给方法取别名，方便外部使用 '.' 运算符进行调用
    myAjax.byDelete = myAjax['delete'];

    /**
     * @method baseAjax 对 $.ajax 进行二次封装的主体实现，支持 与 $.ajax 一致的调用方式和参数设置。
     *              内置逻辑处理：
     *                  对登录超时做了自动处理，对其它异常自动进行提示。
     *                  请求成功后，将响应数据转为 json 格式，并将其中的 objects 数据结果 传给 success 方法。
     * @param {string|Object} url 与 $.ajax 的第一个参数用法相同：若参数为字符串类型，则当作请求地址。若为参数为对象类型，则当作 options 参数处理
     * @param {Object} options 与 $.ajax 的第二个参数用法相同，额外支持以下几个配置项
     * @param {function} options.codeError 业务错误时（响应数据的code不为'SUCCESS'）会调用的方法。当该回调返回 false 时，可以阻止默认的错误处理逻辑
     * @param {function} options.alert 自定义异常处理方法，用于替换 默认的错误处理逻辑。 TODO: 该属性名不要局限在 alert 上，而是要表现出 可以提供自定义异常处理逻辑。
     *              当该方法可以提供同步（参数列表只定义一个参数）或异步（参数列表有至少两个参数）回调方式：
     *                  使用同步方式，若该方法没有返回false。则登录超时后 会自动跳转到登录页面。
     *                  对于异步方式，则跳转登录页面的方法会作为回调方法的第二个参数传入，由外部决定是否调用第二个参数来决定 是否跳转至登录页面。
     *              应用场景：有些错误并不想打扰到用户（比如自动完成的提示列表、登录失败可能要把信息显示在输入框下面），就需要使用自定义异常处理方法。
     * @param {Object} options.alertOptions 用于设置 默认错误处理弹窗属性 的参数
     * @param {string=self} options.alertOptions.windowContext 设置弹窗所属的window对象（默认值是self，可选的有效值为 parent/top ）
     * @param {string} options.alertOptions.errorMessage 优先级最高的错误提示信息。该属性的值 可以覆盖 错误码对应的文本值
     * @param {boolean=true} options.alertOptions.isDestroyCallback 由于默认的layer.alert弹窗 可能会被其它弹层销毁掉，所以可以用该字段指定 在弹窗销毁时，是否执行 callback 回调。
     *              应用场景：若不希望 登录超时的自动跳转功能 被后续的弹层覆盖后 马上触发，可以设置此值为 false（不建议，但有些特定的场景确实需要）
     * @param {boolean=false} returnOriginalDeferred 指定 Deferred返回值的类型。若值为 true，则返回调用$.ajax之后的原生返回值 Deferred 对象。若值为 false，则返回 额外包装一层 处理业务错误的 Deferred 对象
     * @return {Deferred} jQuery 的 Deferred 对象。该对象有 done 、 fail 、 always 等常用方法，类似于 Promise。
     */
    return myAjax;
})();