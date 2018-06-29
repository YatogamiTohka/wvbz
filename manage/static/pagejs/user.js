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
                fixed: true
            }, {
                field: 'userName',
                title: '用户名',
                width: 100,
                fixed: true
            }, {
                field: 'mobile',
                title: '手机',
                width: 110,
                align: 'center',
                fixed: true
            }, {
                // field: 'address',
                title: '收货地址',
                width: '20%',
                minWidth: 200,
                fixed: true,
                templet: function(d) {
                    var address = d.address,
                        addressText = [];

                    if (address && address.length) {
                        $.each(address, function(key, item) {
                            var itemText = '地址' + (key + 1) + '（' + (item.receiver || '--') + '，' + (item.receiverMobile || '--') + '，' + (item.receiverAddress || '--') + '）<br>';
                            addressText.push(itemText);
                        });
                        return addressText.join('');
                    } else {
                        return '';
                    }
                }
            }, {
                field: 'trueName',
                title: '真实姓名',
                width: 80
            }, {
                field: 'sex',
                title: '性别',
                width: 50,
                align: 'center'
            }, {
                field: 'city',
                title: '城市',
                minWidth: 80
            }, {
                // field: 'companyName',
                title: '公司信息',
                minWidth: 150,
                templet: function(d) {
                    var companyName = d.companyName || null,
                        companyTel = d.companyTel || null;

                    var itemText = '';
                    if (companyName && companyTel) {
                        itemText = companyName + '（' + companyTel + '）';
                    } else if (companyName && !companyTel) {
                        itemText = companyName;
                    } else if (!companyName && companyTel) {
                        itemText = companyTel;
                    }
                    return itemText;
                }
            }, {
                field: 'orderCount',
                title: '订单量',
                width: 60,
                align: 'center',
                templet: function(d) {
                    if (d.orderCount) {
                        return '<a title="查看该用户订单" href="propertyCategory.html" target="_self" class="text-orange">' + d.orderCount + '</a>';
                    } else {
                        return '0';
                    }
                }
            }, {
                field: 'status',
                title: '状态',
                width: 60,
                align: 'center',
                templet: function(d) {
                    if (d.status) {
                        return '<a title="点击禁用" lay-event="updateStatus" class="text-orange">启用</a>';
                    } else {
                        return '<a title="点击启用" lay-event="updateStatus" class="text-gray">禁用</a>';
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
                minWidth: 180,
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
                title: '新增用户',
                shadeClose: true,
                shade: 0.3,
                area: ['600px', '500px'],
                content: 'userModify.html?do=add'
            });
        },
        //重置密码
        resetPassword: function() {
            var checkStatus = table.checkStatus('dataList'),
                data = checkStatus.data;

            var len = data.length;
            if (!len) {
                layer.msg('请选择用户');
            } else {
                //TODO
                console.log(data);

                parent.layer.confirm('确定要重置选中的用户密码吗？<br>重置后密码为888888', function(index) {
                    parent.layer.closeAll();
                    //TODO
                });
            }
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

        //启用/禁用
        if (obj.event === 'updateStatus') {
            var status = data.status,
                statusText = (status) ? '禁用' : '启用',
                statusVal = (status) ? 0 : 1;

            parent.layer.confirm('确定要' + statusText + '（' + userName + '）吗？', function(index) {
                parent.layer.closeAll();
                //TODO
            });
        }
        //修改
        else if (obj.event === 'edit') {
            parent.layer.open({
                type: 2,
                title: '修改用户（' + userName + '）',
                shadeClose: true,
                shade: 0.3,
                area: ['600px', '500px'],
                content: 'userModify.html?do=edit&id=' + id
            });
        }
        //重置密码
        else if (obj.event === 'reset') {
            parent.layer.confirm('确定要重置（' + userName + '）的密码吗？<br>重置后密码为888888', function(index) {
                parent.layer.closeAll();
                //TODO
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