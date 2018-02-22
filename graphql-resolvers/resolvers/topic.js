/**
 * Created by wenshao on 2018/02/08
 * topic相关的操作
 */
'use strict';

const {getThrift} = require('thrift-node-core');
const CommonService = 'CommonService';

module.exports = {

    TopicBank: {
        _sid() {
            return '1';
        },
        async topics(root, args, context) {
            const client = getThrift(CommonService).getProxyClient();
            return await client.topicSelect();
        },
        tb_name(root, args, context) {
            console.log('root');
        }
    },
    Topic: {
        _sid() {
            return '2';
        },
        async topicOptions(root, args, context) {
            const client = getThrift(CommonService).getProxyClient();
            return client.topicOptionSelect();
        }
    },
    TopicOption: {
        _sid(){
            return '3';
        }
    },
    Vehicle: {
        __resolveType(obj, context, info){
            if(obj.wingspan){
                return 'Airplane';
            }

            if(obj.licensePlate){
                return 'Car';
            }
            return null;
        }
    },
};