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
    #时间类型
    scalar Date
    type User{
        id:Int!
        name:String!
        create_time:Date
    }
    type UnitMs{
        a:String
    }
    type UnitS{
        b:String
    }
    
    type Starship {
        id: ID!
        name: String!
        length(unit:Int=1): Float
    }

    type Query {
        users: [User]
        starships: [Starship]
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
    Query: {
        users(root, args, context) {
            return [{id: 1, name: 'wenshao',create_time: new Date()}];
        },
        starships() {
            return [{id:1,name:'1',length:1.1}];
        }
    },
    Mutation: {
        addUser(root, args, context) {
            return {id: 2, name: 'wenshao'};
        }
    },
    Date: {
        parseValue(value) {
            return new Date(value);
        },
        serialize(value) {
            return value.getTime();
        }
    },
    Starship: {
        length(root, {unit}, context) {
            console.log(root, unit);
            return root.length;
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