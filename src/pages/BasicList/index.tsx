import React, { useState, useEffect } from 'react'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Row, Col, Tag, Card, Table, Space, Button, Pagination, message, Modal } from 'antd';
import styles from './index.less'
import { useRequest } from 'umi'
import ColBuilder from './build/ColBuilder'
import ActionBuilder from './build/ActionBuilder'
import UserModel from './components/UserModel'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const index = () => {

    const { confirm } = Modal;

    const [tableColum, setTableColum] = useState([])

    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [modelVisible, setModelVisible] = useState(false)
    const [modelUrl, setModelUrl] = useState(false)

    const [modelTitle, setModelTitle] = useState("")

    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRows, setSelectedRows] = useState([])


    //确认page, perPage变化后在发起请求
    useEffect(() => {
        init.run()
    }, [page, perPage])




    //可以直接获取数据，而不需要走dva
    const init = useRequest(`https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${page}&per_page=${perPage}`)
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
        console.log(dataSourceTmp,tableColum)



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
            //修改数据
            case 'modal':

                const newUri = action.uri?.replace(/:\w+/g, (filed) => {
                    //匹配/:id,/:test 等,然后在record找到id或者test的内容对:id或者:test进行替换为具体值
                    console.log(filed)
                    return record[filed.replace(':', '')]
                })
                setModelUrl(newUri)
                setModelVisible(true)
                setModelTitle("添加")

                break;

            case 'page':

                break;

            case 'reload':

                init.run()
                break;

            case 'delete':
                //如果是批量删除record是空，如果是点某一行对某个按钮删除，那么record不wei空
                console.log('delete:')
                console.log(record,selectedRows)
        
                confirm({
                    title: '您确认要删除吗？',
                    icon: <ExclamationCircleOutlined />,
                    //如果record是空表示是批量删除，否则是删除某一个
                    content: batchOverview(record?[record]:selectedRows),
                    onOk() {
                        console.log('OK');
                        
                        return request.run({
                            url:action.uri,
                            method:action.method,
                            type:'delete',
                            ids:record?[record.id]:selectedRows,
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




    const searchLayout = () => {

    }

    const beforeTableLayout = () => {
        return (
            <Row>
                <Col xs={24} sm={12}></Col>
                <Col xs={24} sm={12} className={styles.tableToolbar}>
                    <Space>
                        {/* <Button type="primary">add</Button>
                        <Button type="primary">add2</Button>
                         */}
                        {ActionBuilder(init?.data?.layout?.tableToolBar, actionHandel, false)}

                    </Space>

                </Col>
            </Row>
        )
    }

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

    const batchLayout = () => {

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
                {batchLayout()}
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
