layui.use(['form', 'layer', 'table'], function() {
    var form = layui.form,
        layer = layui.layer,
        table = layui.table,
        $ = layui.jquery;

    //初始化表格分页和高度
    var pageSize = 20,
        tableHeight = 'full-151';

    //初始化表格数据
    table.render({
        id: 'dataList',
        elem: '#dataList',
        url: 'data/user.json',
        cellMinWidth: 80,
        page: {
            layout: ['prev', 'page', 'next', 'count', 'limit', 'skip'],
            groups: 5
        },
        limits: [20, 50, 100],
        limit: pageSize,
        height: tableHeight,
        cols: [
            [{
                checkbox: true,
                width: 40,
                fixed: true
            }, {
                field: 'id',
                title: 'ID',
                width: 60,
                align: 'center',
            }, {
                field: 'userName',
                title: '分类名称',
                width: 150,
                align: 'center'
            }, {
                field: 'mobile',
                title: '固定值',
                width: 150,
                align: 'center',
            }, {
                field: 'trueName',
                title: '加点系数',
                width: 150,
                 align: 'center'
            }, {
                field: 'sex',
                title: '退点系数',
                width: 150,
                align: 'center'
            }, {
                field: 'time',
                title: '创建时间',
                width: 150,
                 align: 'center'
            }, {
                title: '操作',
                width: 180,
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
                content: 'propertyCategoryModify.html?do=add'
            });
        },
        //删除
        delData: function() {
            var checkStatus = table.checkStatus('dataList'),
                data = checkStatus.data;

            var len = data.length;
            if (!len) {
                layer.msg('请选择用户');
            } else {
                //TODO
                console.log(data);

                parent.layer.confirm('确定要删除选中的用户吗？', function(index) {
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
            userName = data.userName;

        //修改
        if (obj.event === 'edit') {
            parent.layer.open({
                type: 2,
                title: '修改用户（' + userName + '）',
                shadeClose: true,
                shade: 0.3,
                area: ['600px', '500px'],
                content: 'userModify.html?do=edit&id=' + id
            });
        }
        //删除
        else if (obj.event === 'del') {
            parent.layer.confirm('确定要删除（' + userName + '）吗？', function(index) {
                parent.layer.closeAll();
                //TODO
            });
        }
    });
});