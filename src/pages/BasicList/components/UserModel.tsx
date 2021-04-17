import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, message } from 'antd';
import { useRequest } from 'umi'
import FormBuilder from '../build/FormBuilder'
import ActionBuilder from '../build/ActionBuilder'
import moment from 'moment'

const UserModel = (props) => {

    const [form] = Form.useForm();

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    //不合适
    // const [url, setUrl] = useState('')
    // const [method, setmethod] = useState('')
    // const [values, setValues] = useState('')

    console.log('选择的record:');
    console.log(props.record);

    //第一个参数是要执行的函数，第二个参数是一个列表，列表中的值变化时执行函数
    // useEffect(() => {

    //     if(props.record===null){
    //         form.resetFields()
    //     }else{
    //         //如果传入的是null或者undefined，哪不会生效
    //         form.setFieldsValue(props.record)
    //     }

    // }, [props.record])


    //默认get请求
    const init = useRequest(props.modelUrl, {
        //是直接执行还是手动调用执行，true是手动执行run()，默认是false
        manual: true
    });

    // const request = useRequest({
    //     url: url,
    //     method: method,
    //     body: JSON.stringify(values)
    // }, {

    //     manual: true
    // });

    const request = useRequest(
        (values) => {
            console.log('request发送的参数为：')
            console.log(values)
            return {
                url: `https://public-api-v2.aspirantzhang.com${values.url}`,
                method: values.method,
                //body: JSON.stringify(values)
                //data和body相比，可以自动把对象json化
                data:{
                    ...values,
                    'X-API-KEY':'antd',
                    'create_time':moment(values.create_time).format(),
                    'update_time':moment(values.create_time).format(),
                },
            }
        }

        , {

            manual: true
        });




    useEffect(() => {
        if (props.visible) {


            //在弹出对话框之前先清空
            form.resetFields()

            //当进行编辑操作的是否，如果发现init.data有变化了，那就要把值添加到form表单中
            init.run();


            /**
             * 返回的数据为：
             * layout：form表单的结构，这里只显示tabs的第一个
             * dataSource：是表单中预先填充的数据
             * actions：form表单的按钮
         * data:{
                    "page": {
                        "title": "User Edit",
                        "type": "page"
                    },
                    "layout": {
                        "tabs": [
                            {
                                "name": "basic",
                                "title": "Basic",
                                "data": [
                                    {
                                        "title": "Username",
                                        "dataIndex": "username",
                                        "key": "username",
                                        "type": "text",
                                        "disabled": true
                                    },
                                    {
                                        "title": "Display Name",
                                        "dataIndex": "display_name",
                                        "key": "display_name",
                                        "type": "text"
                                    },
                                    {
                                        "title": "Group",
                                        "dataIndex": "groups",
                                        "key": "groups",
                                        "type": "tree",
                                        "data": [
                                            {
                                                "id": 70,
                                                "parent_id": 0,
                                                "name": "最高权限组AA",
                                                "create_time": "2021-04-09T10:05:23+08:00",
                                                "delete_time": null,
                                                "status": 1,
                                                "value": 70,
                                                "title": "最高权限组AA",
                                                "depth": 1
                                            },
                                            {
                                                "id": 69,
                                                "parent_id": 0,
                                                "name": "Group 001",
                                                "create_time": "2020-11-24T15:25:11+08:00",
                                                "delete_time": null,
                                                "status": 1,
                                                "value": 69,
                                                "title": "Group 001",
                                                "depth": 1
                                            },
                                            {
                                                "id": 68,
                                                "parent_id": 0,
                                                "name": "Group 0033",
                                                "create_time": "2020-11-02T16:11:24+08:00",
                                                "delete_time": null,
                                                "status": 1,
                                                "value": 68,
                                                "title": "Group 0033",
                                                "depth": 1
                                            },
                                            {
                                                "id": 53,
                                                "parent_id": 0,
                                                "name": "Admin Group",
                                                "create_time": "2020-09-21T00:10:30+08:00",
                                                "delete_time": null,
                                                "status": 1,
                                                "value": 53,
                                                "title": "Admin Group",
                                                "depth": 1
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Create Time",
                                        "dataIndex": "create_time",
                                        "key": "create_time",
                                        "type": "datetime"
                                    },
                                    {
                                        "title": "Update Time",
                                        "dataIndex": "update_time",
                                        "key": "update_time",
                                        "type": "datetime"
                                    },
                                    {
                                        "title": "Status",
                                        "dataIndex": "status",
                                        "key": "status",
                                        "type": "switch",
                                        "data": [
                                            {
                                                "title": "Enabled",
                                                "value": 1
                                            },
                                            {
                                                "title": "Disabled",
                                                "value": 0
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "actions": [
                            {
                                "name": "actions",
                                "title": "Actions",
                                "data": [
                                    {
                                        "component": "button",
                                        "text": "Reset",
                                        "type": "dashed",
                                        "action": "reset"
                                    },
                                    {
                                        "component": "button",
                                        "text": "Cancel",
                                        "type": "default",
                                        "action": "cancel"
                                    },
                                    {
                                        "component": "button",
                                        "text": "Submit",
                                        "type": "primary",
                                        "action": "submit",
                                        "uri": "/api/admins/206",
                                        "method": "put"
                                    }
                                ]
                            }
                        ]
                    },
                    "dataSource": {
                        "id": 206,
                        "username": "admin0",
                        "display_name": "",
                        "create_time": "2020-10-22T15:38:51+08:00",
                        "update_time": "2020-10-31T13:28:21+08:00",
                        "status": 1,
                        "groups": [
                            53
                        ]
                    }
                }
             * 
             * 
             * 
             */

        }
    }, [props.visible])


    //监听编辑请求的返回数据
    useEffect(() => {
        //发现有返回数据时，开始设置form
        if (init.data) {

            console.log("请求的返回:")
            console.log(init.data.dataSource)
            /**
             * {
                "id": 206,
                "username": "admin0",
                "display_name": "",
                "create_time": "2020-10-22T15:38:51+08:00",(在处理时间时，需要把其转换为moment)
                "update_time": "2020-10-31T13:28:21+08:00",
                "status": 1,
                "groups": [
                    53
                ]
            }
             * 
             * 
            */
            //这样写无法单独处理create_time和update_time这2个时间类型
            //form.setFieldsValue(init.data.dataSource);

            //可以这样写进行覆盖
            // form.setFieldsValue({
            //     ...init.data.dataSource,
            //     create_time:moment(init.data.dataSource.create_time),
            //     update_time:moment(init.data.dataSource.update_time),

            // });

            //也可以写个适配器来匹配类型（只能设置value，但是对switch这种控件不生效）
            form.setFieldsValue(setFildsAdaper(init.data));

        }

    }, [init.data])



    //这里会根据init.data.layout.tabs下data中记录的类型(找key)，然后记录，之后来对init.data.dataSource中的数据类型进行适配
    const setFildsAdaper = (data) => {

        if (data?.layout?.tabs && data?.dataSource) {


            //需要返回的，处理好的数据
            const result = {}

            data.layout.tabs.forEach((tab) => {
                tab.data.forEach((field) => {
                    if (field.type === 'datetime') {

                        result[field.key] = moment(data.dataSource[field.key])
                    } else {
                        result[field.key] = data.dataSource[field.key]
                    }
                    //如果还有其他类型需要单独处理在这里添加else if就可以了
                })
            })

            return result;
        } else {
            return {};
        }

    }







    //点击提交
    const onFinish = (values) => {

        // if (record === null) {
        //     dispatch({
        //         type: 'users/add',
        //         payload: { ...values },
        //     })
        // } else {
        //     dispatch({
        //         type: 'users/edit',
        //         payload: { ...values, key: record.key },
        //     })
        // }



        //setuse的操作都是异步的，可能导致赋值还没有完毕就提前提交
        //setValues(values)

        //表单中的数据都在values中
        request.run(values)
        message.success('成功提交')
        props.handleFinish()

    };





    //点击model中按钮时的处理
    //传入的参数为：
    //    {
    //         "component": "button",
    //         "text": "Delete",
    //         "type": "default",
    //         "action": "delete",
    //         "uri": "/api/admins/delete",
    //         "method": "post"
    //     }
    const actionHandel = (action) => {
        //1.出发表单提交动作
        //2.得到表单提交参数
        //3.发送到后端
        console.log('点击了：')
        console.log(action)

        switch (action.action) {
            case 'submit':

                //setuse的操作都是异步的，可能导致赋值还没有完毕就提前提交
                // setUrl(action.uri)
                // setmethod(action.method)
                //比较好的处理方法是在form中把input隐藏：

                form.setFieldsValue({ url: action.uri, method: action.method })
                form.submit()
                break;

            case 'cancel':

                props.handleCancel()

                break;
            default:
                break;
        }

    }


    return (
        <Modal
            //点击周围不会自动关闭
            maskClosable={false}
            title={props.title}
            visible={props.visible}
            onOk={() => {
                form.submit()
            }}
            onCancel={props.handleCancel}
            forceRender
            footer={ActionBuilder(init?.data?.layout?.actions[0].data, actionHandel)}
        >

            <Form
                initialValues={{ create_time: moment(), update_time: moment(), status: true }}
                form={form}
                name="basic"
                {...layout}
                onFinish={onFinish}
                onFinishFailed={() => {
                    message.error('提交失败');
                }}
            >

                {FormBuilder(init?.data?.layout?.tabs[0].data)}


                {/* 隐藏属性 */}
                <Form.Item
                    key='url'
                    name='url'
                >
                    <Input hidden={true} />
                </Form.Item>

                <Form.Item
                    name='method'
                    key='method'
                >
                    <Input hidden={true} />
                </Form.Item>

            </Form>






        </Modal>
    )
}

export default UserModel