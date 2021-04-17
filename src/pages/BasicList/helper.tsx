import moment from 'moment'


//这里会根据init.data.layout.tabs下data中记录的类型(找key)，然后记录，之后来对init.data.dataSource中的数据类型进行适配
export const setFildsAdaper = (data) => {

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



    //对时间类型对象进行特殊处理
    export  const submintAdaptor = (formValues) => {

        const result ={}

        //对象所有属性循环
        Object.keys(formValues).forEach((key)=>{
            result[key] = formValues[key]
            if(moment.isMoment(formValues[key])){
                result[key] = moment(formValues[key]).format()
            }
        })
        
        return result
    }
    