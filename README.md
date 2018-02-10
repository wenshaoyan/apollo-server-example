## 目录
- [简介](#简介)
- [安装](#安装)
- [快速使用](#快速使用)
- [配置](#配置)


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
- [Hapi](https://www.apollographql.com/docs/apollo-server/servers/hapi.html)
- [Lambda](https://www.apollographql.com/docs/apollo-server/servers/lambda.html)
- [Micro](https://www.apollographql.com/docs/apollo-server/servers/micro.html)
- [Restify](https://www.apollographql.com/docs/apollo-server/servers/restify.html)
- [Azure Functions](https://www.apollographql.com/docs/apollo-server/servers/azure-functions.html)
- [Adonis](https://www.apollographql.com/docs/apollo-server/servers/adonis.html)


## 配置
Apollo server 传染对象进行配置

| 名称             | 类型           |   默认值       | 必填 | 描述 |
| --------        | -----:         | :----:        | :----: | :----: |
| schema          | GraphQLSchema  |   无          | 是     |GraphQL的Schema对象        
| context         | Object         |   {}          |否      |在GraphQL执行时候传递的上下文对象
| rootValue       | Object         |   undefined    |否      |第一个执行resolve时候的root对应的值
| formatError     | Function       |   无           |否      |当执行resolve时出现异常则回调用这个函数
| validationRules | Function       |   无           |否      |添加额外的GraphQL验证规则应用到客户机指定查询
| formatParams    | Function       |   无           |否      |如果有多个resolve则只在第一个时候执行
| formatResponse  | Function       |   无           |否      |当执行完所有的resolve之后调用
| tracing         | Boolean        |   false        |否      |收集每个resolve执行的信息 包括执行时间 参数 返回值等信息

### 简单的使用实例
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
```