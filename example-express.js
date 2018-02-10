/**
 * Created by wenshao on 2018/2/10.
 */
'use strict';
const express = require('express');
const Body = require('body-parser');
const {graphqlExpress} = require('apollo-server-express');
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
const app = new express();
const PORT = 3000;

// Body is needed just for POST.
app.use(Body());

app.post('/graphql', graphqlExpress({schema: myGraphQLSchema}));
app.get('/graphql', graphqlExpress({schema: myGraphQLSchema}));
app.listen(PORT);