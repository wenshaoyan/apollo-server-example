/**
 * Created by wenshao on 2018/2/10.
 */
'use strict';
const Koa = require('koa');
const Body = require('koa-bodyparser');
const router = require('koa-router')();
const {graphqlKoa} = require('apollo-server-koa');
const {makeExecutableSchema} = require('graphql-tools');
const typeDefs = `
    type User{
        id:Int!,
        name:String!
    }
    type Query {
        users: [User]
    }
    type Mutation {
        addUser(name:String!):User
    }
    schema {
        query: Query
        mutation: Mutation  
    }
`;
const resolvers = {
    Query: {    // 对应到typeDefs中的 type Query
        users(root, args, context) {
            return [{id: 1, name: 'wenshao'}];
        }
    },
    Mutation: { // 对应到typeDefs中的 Mutation
        addUser(root, args, context) {
            return {id: 2, name: 'wenshao'};
        }
    }
};


const myGraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers
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