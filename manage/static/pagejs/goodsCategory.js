layui.use(['form', 'layer', 'table'], function() {
    var form = layui.form,
        layer = layui.layer,
        table = layui.table,
        $ = layui.jquery;

    //初始化表格高度
    var tableHeight = 'full-104';

    //初始化表格数据
    table.render({
        id: 'dataList',
        elem: '#dataList',
        url: 'data/goodsCategory.json',
        cellMinWidth: 80,
        height: tableHeight,
        cols: [
            [{
                checkbox: true,
                width: 40
            }, {
                field: 'id',
                title: 'ID',
                width: 60,
                align: 'center'
            }, {
                field: 'category',
                title: '分类名称'
            }, {
                field: 'property',
                title: '属性分类'
            }, {
                field: 'image',
                title: '分类图片',
                minWidth: 150,
                align: 'center',
                templet: function(d) {
                    if (d.image) {
                        return '<a title="查看图片" lay-event="image"><img layer-src="' + d.image + '" src="' + d.image + '" height="28"></a>';
                    } else {
                        return '';
                    }

                }
            }, {
                field: 'sort',
                title: '排序',
                width: 100,
                align: 'center'
            }, {
                field: 'status',
                title: '前台显示',
                width: 100,
                align: 'center',
                templet: function(d) {
                    if (d.status) {
                        return '<a title="点击隐藏" lay-event="updateStatus" class="text-orange">显示</a>';
                    } else {
                        return '<a title="点击显示" lay-event="updateStatus" class="text-gray">隐藏</a>';
                    }
                }
            }, {
                field: 'createTime',
                title: '创建时间',
                minWidth: 150,
                align: 'center',
                templet: function(d) {
                    return new Date(d.createTime).format('yyyy-MM-dd hh:mm:ss');
                }
            }, {
                field: 'handle',
                title: '操作',
                minWidth: 150,
                fixed: 'right',
                align: 'center',
                toolbar: '#tableHandleBar'
            }]
        ]
    });

    //公共工具条事件
    var active = {
        //新增
        addData: function() {
            parent.layer.open({
                type: 2,
                title: '新增分类',
                shadeClose: true,
                shade: 0.3,
                area: ['600px', '500px'],
                content: 'goodsCategoryModify.html?do=add'
            });
        },
        //删除
        delData: function() {
            var checkStatus = table.checkStatus('dataList'),
                data = checkStatus.data;

            var len = data.length;
            if (!len) {
                layer.msg('请选择分类');
            } else {
                //TODO
                console.log(data);

                parent.layer.confirm('确定要删除选中的分类吗？', function(index) {
                    parent.layer.closeAll();
                    //TODO
                });
            }
        }
    }

    $('.sys-handle-button-bar .layui-btn').on('click', function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //单元格工具条事件
    table.on('tool(dataList)', function(obj) {
        var data = obj.data;

        //基本参数
        var id = data.id,
            category = data.category;

        //显示/隐藏
        if (obj.event === 'updateStatus') {
            var status = data.status,
                statusText = (status) ? '隐藏' : '显示',
                statusVal = (status) ? 0 : 1;

            parent.layer.confirm('确定要' + statusText + '（' + category + '）吗？', function(index) {
                parent.layer.closeAll();
                //TODO
            });
        }
        //查看图片
        else if (obj.event === 'image') {
            if (data.image) {
                var imageJson = {
                    data: [{
                        pid: 1,
                        src: data.image + '?' + (+new Date())
                    }]
                };

                layer.photos({
                    photos: imageJson,
                    anim: 5
                });

                return false;
            }
        }
        //修改
        else if (obj.event === 'edit') {
            parent.layer.open({
                type: 2,
                title: '修改分类（' + category + '）',
                shadeClose: true,
                shade: 0.3,
                area: ['600px', '500px'],
                content: 'goodsCategoryModify.html?do=edit&id=' + id
            });
        }
        //删除
        else if (obj.event === 'del') {
            parent.layer.confirm('确定要删除（' + category + '）吗？', function(index) {
                parent.layer.closeAll();
                //TODO
            });
        }
    });
});