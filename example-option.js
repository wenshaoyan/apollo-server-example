/**
 * Created by wenshao on 2018/2/10.
 */
'use strict';
const Koa = require('koa');
const Body = require('koa-bodyparser');
const router = require('koa-router')();
const {graphqlKoa} = require('apollo-server-koa');
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt
} = require('graphql');


const User = new GraphQLObjectType({
    name: 'User',
    description: 'User对象',
    fields: {
        id: {
            type: GraphQLInt
        },
        name: {
            type: GraphQLString,
            resolve(root, args, context) {
                console.log(root, context); // console: { id: 1, name: '2' } { test: true }
                return root.name;
            }

        },
    }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        user: {
            type: User,
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: function (root, args, context) {
                console.log(root,context);  // { test: false } { test: true }
                return {id: 1, name: 'wenshao'};
            }
        }
    }
});
const myGraphQLSchema = new GraphQLSchema({
    query: Query
});
const app = new Koa();
const PORT = 3000;

// Body is needed just for POST.
app.use(Body());

router.post('/graphql', graphqlKoa({
    schema: myGraphQLSchema,
    context: {
        test: true
    },
    rootValue: {
        test: false
    },
    formatError(error) {
        return error;
    },
    validationRules(validationContext) {
        return validationContext;
    },
    formatParams(params) {
        return params;
    },
    formatResponse(data, all) {
        // console.log(data);
        delete data.extensions;// 当加上 tracing: true 返回到前端的会有extensions对象的值 对前端来说这数据没有用 所有可以删除
        return data;
    },
    tracing: true
}));
router.get('/graphql', graphqlKoa({
    schema: myGraphQLSchema
}));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);