import React, { useState, useEffect } from 'react'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Row, Col, Tag, Card, Table, Space, Button, Pagination, message } from 'antd';
import styles from './index.less'
import { useRequest } from 'umi'
import ColBuilder from './build/ColBuilder'
import ActionBuilder from './build/ActionBuilder'
import UserModel from './components/UserModel'

const index = () => {

    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [modelVisible, setModelVisible] = useState(false)
    const [modelUrl, setModelUrl] = useState(false)

    const [modelTitle, setModelTitle] = useState("")
    
    //确认page, perPage变化后在发起请求
    useEffect(() => {
        init.run()
    }, [page, perPage])

    //可以直接获取数据，而不需要走dva
    const init = useRequest(`https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${page}&per_page=${perPage}`)
    console.log('init的数据为：')
    console.log(init)





    //关闭修改对话框
    const handleCancel = () => {
        setModelVisible(false)
    };

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

        message.success('成功提交')
        setModelVisible(false)
    };









    const searchLayout = () => {

    }

    const beforeTableLayout = () => {
        return (
            <Row>
                <Col xs={24} sm={12}>111</Col>
                <Col xs={24} sm={12} className={styles.tableToolbar}>
                    <Space>
                        {/* <Button type="primary">add</Button>
                        <Button type="primary">add2</Button>
                         */}
                        {ActionBuilder(init?.data?.layout?.tableToolBar)}

                    </Space>

                </Col>
            </Row>
        )
    }

    const afterTableLayout = () => {
        return (
            <Row>
                <Col xs={24} sm={12}>
                    <Space>
                        {ActionBuilder(init?.data?.layout?.batchToolBar)}
                    </Space>
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






    return (



        <PageContainer>
            { searchLayout()}

            <Button onClick={() => {
                setModelUrl("https://public-api-v2.aspirantzhang.com/api/admins/add?X-API-KEY=antd")
                setModelVisible(true)
                setModelTitle("添加")
            }}>
                add
            </Button>


            <Button onClick={() => {
                setModelUrl("https://public-api-v2.aspirantzhang.com/api/admins/206?X-API-KEY=antd")
                setModelVisible(true)
                setModelTitle("修改")
            }}>
                edit
            </Button>



            <Card>
                {beforeTableLayout()}
                <Table
                    rowKey="id"
                    dataSource={init?.data?.dataSource}
                    columns={

                        ColBuilder(init?.data?.layout?.tableColumn)

                        // //拼接添加一列作为id,ID显示在最前面
                        // [{ title: 'ID', dataIndex: 'id', key: 'id' }]
                        //     //concat内部的数组不能为undefined，所以如果是undefined，那就传入默认的空数组
                        //     .concat(init?.data?.layout?.tableColumn || [])
                        //     .filter((item) => {
                        //         //过滤，如果返回为真就保留，返回为false就剔除
                        //         return item.hideInColumn !== true
                        //     })


                    }

                    loading={init?.data === undefined}
                    pagination={false}
                />


                {afterTableLayout()}
                {batchLayout()}
            </Card>


            <UserModel
                visible={modelVisible}
                onFinish={onFinish}
                handleCancel={handleCancel}
                //record={record}
                modelUrl={modelUrl}
                title={modelTitle}
            ></UserModel>

        </PageContainer>



    )
}


export default index
