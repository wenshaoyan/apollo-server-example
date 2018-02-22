/**
 * Created by wenshao on 2018/02/08
 * topic相关的操作
 */
'use strict';

const {getThrift} = require('thrift-node-core');
const CommonService = 'CommonService';
module.exports = {
    async topicBanks(root, args, context) {
        const client = getThrift(CommonService).getProxyClient();
        const re= await client.topicBankSelect();
        re.forEach(v => v.topics = [{
            topic_id:1111,
            topic_title:'11111111'
        }])
        return re;
    },
    async topics() {
        const client = getThrift(CommonService).getProxyClient();
        return client.topicSelect();
    },
    topicOptions() {
        const client = getThrift(CommonService).getProxyClient();
        return client.topicOptionSelect();
    },
    airplanes() {
        return {maxSpeed:1,wingspan:2};
    },
    cars() {
        return {maxSpeed:2,licensePlate:'1111'};
    },
    vehicles() {
        return {maxSpeed:1,wingspan:1};
    }
};
