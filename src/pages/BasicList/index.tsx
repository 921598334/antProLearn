import React, { useState, useEffect } from 'react'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Row, Col, Tag, Card, Table, Space, Button, Pagination, message, Modal, Tooltip, Form, InputNumber } from 'antd';
import styles from './index.less'
import { useRequest, useIntl, history } from 'umi'
import ColBuilder from './build/ColBuilder'
import ActionBuilder from './build/ActionBuilder'
import SearchBuilder from './build/SearchBuilder'
import UserModel from './components/UserModel'
import { ExclamationCircleOutlined, VideoCameraTwoTone, SearchOutlined } from '@ant-design/icons';
import { values } from 'lodash';
import { submintAdaptor } from './helper'
//需要安装
import { stringify } from 'qs'


const index = () => {


    //国际化
    const lang = useIntl();

    const { confirm } = Modal;
    const [searchForm] = Form.useForm();
    const [tableColum, setTableColum] = useState([])
    //搜索区域的显示与不显示
    const [state, setState] = useState(false)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [modelVisible, setModelVisible] = useState(false)
    const [modelUrl, setModelUrl] = useState('')

    const [modelTitle, setModelTitle] = useState("")

    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRows, setSelectedRows] = useState([])


    //确认page, perPage变化后在发起请求
    useEffect(() => {
        init.run()
    }, [page, perPage])

    //model的url设置完成后在显示对话框,关闭对话框的时候需要情况地址
    useEffect(() => {
        if (modelUrl) {
            setModelVisible(true)

        }
    }, [modelUrl])



    //可以直接获取数据，而不需要走dva
    //2哥功能，一个是分页查询，另一个是搜索查询
    // const init = useRequest(`https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${page}&per_page=${perPage}`)
    const init = useRequest(
        (values) => {
            message.loading("正在发送请求.....")
            console.log('init发送的参数values为：')
            console.log(values)
            const valuesPara = submintAdaptor(values)
            console.log('init发送的参数valuesPara为：')
            console.log(valuesPara)
            return {
                url: `https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${page}&per_page=${perPage}`,
                method: 'get',
                params: valuesPara,
                paramsSerializer: (params) => {
                    //参数对象中如果有数组，那对数组用逗号进行分割，合成一个字符串
                    return stringify(params, { arrayFormat: 'comma' })
                }
            }
        }
        , {

            onError: () => {

            },
            // //得到后端成功返回全部数据(需要添加这个)
            // formatResult: (res) => {
            //     return res
            // },
            // //如果没有上面的formatResult的化话，只接收返回数据有data的json，加上后data有后端返回的所有数据
            // //{"success":true,"message":"Add successfully.","data":[]}
            // onSuccess: (data) => {
            //     console.log("成功时返回：")
            //     console.log(data)
            //     //添加成功就关闭
            //     message.success(data.message)
            // },
        });

    console.log('init的数据为：')
    console.log(init)




    const request = useRequest(
        (values) => {
            message.loading("正在发送请求.....")
            console.log('request发送的参数为：')
            console.log(values)
            return {
                url: `https://public-api-v2.aspirantzhang.com${values.url}`,
                method: values.method,
                //body: JSON.stringify(values)
                //data和body相比，可以自动把对象json化
                //post请求参数放在data里面，get请求参数发在params中
                data: {
                    ...values,
                    'X-API-KEY': 'antd',
                },
            }
        }
        , {
            manual: true,
            onError: () => {

            },
            //得到后端成功返回全部数据(需要添加这个)
            formatResult: (res) => {
                return res
            },
            //如果没有上面的formatResult的化话，只接收返回数据有data的json，加上后data有后端返回的所有数据
            //{"success":true,"message":"Add successfully.","data":[]}
            onSuccess: (data) => {
                console.log("成功时返回：")
                console.log(data)
                //添加成功就关闭
                message.success(data.message)
            },
        });










    useEffect(() => {
        console.log('tableColumn发生了变化：')
        console.log(init?.data?.layout?.tableColumn)
        if (init?.data?.layout?.tableColumn) {
            setTableColum(ColBuilder(init?.data?.layout?.tableColumn, actionHandel))
        }
    }, [init?.data?.layout?.tableColumn])






    //关闭修改对话框
    const handleCancel = () => {
        console.log('点击取消，关闭对话框')
        setModelVisible(false)
        setModelUrl('')
    };


    const onFinish = () => {
        console.log('点击提交，关闭对话框')
        setModelVisible(false)

        //刷新页面
        init.run()
    };



    const simpleColum = () => {


        return [
            // tableColum[0] || {},
            // tableColum[1] || {}
            ColBuilder(init?.data?.layout?.tableColumn, actionHandel)[0] || {},
            ColBuilder(init?.data?.layout?.tableColumn, actionHandel)[1] || {},
        ]

    }


    //批量删除对话框
    const batchOverview = (dataSourceTmp) => {

        console.log('点击了删除,需要删除的数据和col为：')
        console.log(dataSourceTmp, tableColum)



        return <Table
            size='small'
            rowKey="id"
            dataSource={dataSourceTmp}
            columns={simpleColum()}
            pagination={false}
        />
    }


    const actionHandel = (action, record) => {

        console.log('点击了：')
        console.log(action)
        console.log(record)


        console.log('当前tableColum:')
        console.log(tableColum)


        switch (action.action) {
            //修改数据与添加
            case 'modal':

                var newUri = action.uri?.replace(/:\w+/g, (filed) => {
                    //匹配/:id,/:test 等,然后在record找到id或者test的内容对:id或者:test进行替换为具体值
                    console.log(filed)
                    return record[filed.replace(':', '')]
                })
                setModelUrl(newUri)

                setModelTitle("添加")

                break;
            //单叶设置
            case 'page':
                newUri = action.uri?.replace(/:\w+/g, (filed) => {
                    //匹配/:id,/:test 等,然后在record找到id或者test的内容对:id或者:test进行替换为具体值
                    console.log(filed)
                    return record[filed.replace(':', '')]
                })
                //页面跳转
                history.push('/basic-list' + newUri)
                break;

            case 'reload':

                init.run()
                break;

            case 'delete':
                //如果是批量删除record是空，如果是点某一行对某个按钮删除，那么record不wei空
                console.log('delete:')
                console.log(record, selectedRows)

                confirm({
                    //国际化
                    // title: lang.formatMessage({
                    //     id:'basicList.actionHandle.confirmTitle'
                    // },{
                    //     operationName:action.action
                    // }),
                    title: '您确认要删除吗？',
                    icon: <ExclamationCircleOutlined />,
                    //如果record是空表示是批量删除，否则是删除某一个
                    content: batchOverview(record ? [record] : selectedRows),
                    onOk() {
                        console.log('OK');

                        return request.run({
                            url: action.uri,
                            method: action.method,
                            type: 'delete',
                            ids: record ? [record.id] : selectedRows,
                        })
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });

                break;
            default:
                break;
        }

    }



    //根据返回的tableColum构建搜索区
    const searchLayout = () => {

        return state ?
            <Card className={styles.searchFrom}>

                <Form
                    form={searchForm}
                    onFinish={(values) => {
                        init.run(values)
                    }}
                >
                    <Row gutter={24}>
                        <Col sm={6}>
                            <Form.Item
                                key='id'
                                label='ID'
                                name='id'

                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        {SearchBuilder(init.data?.layout?.tableColumn)}
                    </Row>

                    <Row>
                        <Col sm={12}>
                        </Col>

                        <Col sm={12} className={styles.tableToolbar}>
                            <Space className={styles.tableToolbar}>
                                <Button type='primary' htmlType='submit'>submit</Button>
                                <Button htmlType='reset' onClick={() => {
                                    init.run();
                                    searchForm.resetFields();
                                }}>clearn</Button>
                            </Space>
                        </Col>


                    </Row>
                </Form>

            </Card>
            : ''
    }

    const beforeTableLayout = () => {
        return (
            <Row>
                <Col xs={24} sm={12}></Col>
                <Col xs={24} sm={12} className={styles.tableToolbar}>
                    <Space>

                        <Tooltip title="search">
                            <Button type={state ? 'primary' : 'default'} shape="circle" icon={<SearchOutlined />} onClick={() => { setState(!state) }} />
                        </Tooltip>
                        {ActionBuilder(init?.data?.layout?.tableToolBar, actionHandel, false)}

                    </Space>

                </Col>
            </Row>
        )
    }

    //显示分页
    const afterTableLayout = () => {
        return (
            <Row>
                <Col xs={24} sm={12}>
                    {/* <Space>
                        {ActionBuilder(init?.data?.layout?.batchToolBar, actionHandel)}
                    </Space> */}
                </Col>

                <Col xs={24} sm={12} className={styles.tableToolbar}>

                    <Pagination
                        current={init?.data?.meta.page || 0}
                        total={init?.data?.meta.total || 1}
                        pageSize={init?.data?.meta.per_page || 10}
                        onChange={(_page, _perPage) => {
                            console.log('当前选择了：')
                            console.log(_page)
                            console.log('当前显示：')
                            console.log(_perPage)

                            //useState是异步获取数据，也就是下面代码可能同时执行,为了确保值修改后在进行执行，需要useEffect
                            setPage(_page)
                            setPerPage(_perPage)
                            // //通过这个函数可以重新发起请求
                            // init.run()
                        }}
                    />
                </Col>
            </Row>
        )
    }





    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (_selectedRowKeys, _selectedRows) => {
            console.log('选择发生了变化')
            console.log(_selectedRowKeys)
            console.log(_selectedRows)

            setSelectedRowKeys(_selectedRowKeys)
            setSelectedRows(_selectedRows)

        },
    }




    const batchToolBar = () => {

        if (selectedRowKeys?.length > 0) {
            return <Space>{ActionBuilder(init?.data?.layout?.batchToolBar, actionHandel)}</Space>
        } else {
            return null
        }
    }




    return (



        <PageContainer>
            { searchLayout()}

            <Card>
                {beforeTableLayout()}
                <Table
                    rowKey="id"
                    dataSource={init?.data?.dataSource}
                    columns={
                        tableColum
                    }
                    rowSelection={rowSelection}
                    loading={init?.data === undefined}
                    pagination={false}
                />


                {afterTableLayout()}

            </Card>


            <UserModel
                visible={modelVisible}
                handleFinish={onFinish}
                handleCancel={handleCancel}
                modelUrl={modelUrl}
                title={modelTitle}
            ></UserModel>

            <FooterToolbar extra={batchToolBar()} />
        </PageContainer>

    )
}


export default index
