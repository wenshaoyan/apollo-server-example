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
            type: GraphQLString
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
            resolve: function (root, args) {
                return {id: 1, name: '2'};
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

router.post('/graphql', graphqlKoa({schema: myGraphQLSchema}));
router.get('/graphql', graphqlKoa({schema: myGraphQLSchema}));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);