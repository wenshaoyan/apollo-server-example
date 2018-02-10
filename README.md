## 目录
- [简介](#简介)
- [安装](#安装)
- [快速使用](#快速使用)


## 简介
apollo-server是一个在nodejs上构建grqphql服务端的web中间件。支持express，koa ，hapi等框架。
[apollo-server官方文档](https://www.apollographql.com/docs/apollo-server/)


## 安装

根据不同的web框架进行安装安装

npm install graphql apollo-server-express

npm install graphql apollo-server-hapi

npm install graphql apollo-server-koa

npm install graphql apollo-server-restify

npm install graphql apollo-server-lambda

npm install graphql apollo-server-micro

npm install graphql apollo-server-azure-functions

npm install graphql apollo-server-adonis

## 快速使用  

### express
npm install --save apollo-server-express graphql express body-parser

```js
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
```


### koa
npm install --save apollo-server-koa graphql koa koa-bodyparser koa-router
```js
/**
 * Created by wenshao on 2018/2/10.
 */
'use strict';
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
```

### 其他框架参考官方文档

