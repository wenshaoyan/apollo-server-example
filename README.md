## 目录
- [简介](#简介)
- [安装](#安装)
- [快速使用](#快速使用)
- [配置](#配置)
- [graphql-tools快速构建](#graphql-tools快速构建)
- [graphql-schema类型](#graphql-schema类型)
- [github-api-v4设计规范分析](#github-api-v4设计规范分析)
- [设计规范项目实例](#设计规范项目实例)
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
安装
```text
npm install --save apollo-server-express graphql express body-parser
```
实例 [源码](https://github.com/wenshaoyan/apollo-server-example/blob/master/example-express.js)
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
安装
```text
npm install --save apollo-server-koa graphql koa koa-bodyparser koa-router
```
实例 [源码](https://github.com/wenshaoyan/apollo-server-example/blob/master/example-koa.js)
```js
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
[源码](https://github.com/wenshaoyan/apollo-server-example/blob/master/example-option.js)
```js
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
### 自定义拦执行截器
[源码](https://github.com/wenshaoyan/apollo-server-example/blob/master/example-custom.js)
```js
/**
 * Created by wenshao on 2018/2/10.
 */
'use strict';
const Koa = require('koa');
const Body = require('koa-bodyparser');
const router = require('koa-router')();
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt
} = require('graphql');

/**
 * 自定义异常类
 */
class RequestException extends Error{
    constructor() {
        super();
        this.name = "RequestException";
        this.code = null;
        this.message = null;
        this.serverName = null;
        this.methodName = null;
        this.fullMessage = null;
    }
}


const reIpv4 = '.*:.*:.*:(.*)';
/**
 * 中间件
 * 1 自定义context 可以传入ctx对象
 * 2 增加resolve执行的信息
 * 3 自定义日志输出
 * 4 错误处理统一处理
 * @param options
 * @return {function(*=, *)}
 */
function graphqlKoaLog(options) {
    const {graphqlKoa} = require('apollo-server-koa');
    const logger = options.log && 'info' in options.log ? options.log : console;
    return async (ctx, next) => {
        await graphqlKoa({
            schema: options.schema,
            context: {  // 传入ctx  也可以增加其他值  如用户信息等
                ctx: ctx,
            },
            tracing: true,
            formatError(error){
                if (typeof error === 'object') {
                    if (typeof error.originalError === 'object'
                        &&
                        error.originalError.name === 'RequestException' ) { // 自定义的请求异常 则进行拦截
                        error.message = 'thrift error';     // 返回到前端message
                        return error;
                    }
                }
                return error;
            },
            formatResponse(data, all) { // data 为返回到前端的全部数据  all为执行resolve相关的信息 类似ctx
                let ipv4 = ctx.ip.match(reIpv4);
                if (ipv4 instanceof Array && ipv4.length === 2) ipv4 = ipv4[1];
                else if (ipv4 === null) ipv4 = ctx.ip;
                else ctx.ipv4 = ipv4;   // 找到ip
                if (ctx.method !== 'OPTIONS') logger.info(ipv4, `${data.extensions.tracing.duration / 1000}ms`,
                    '\n============query=======\n',all.query, '\n============variables=======\n', all.variables);
                delete data.extensions; // 前端不需要 则删除
                return data;
            }
        })(ctx);
    }
}


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
            resolve: function (root, args, context) {
                const re = new RequestException();
                re.code = 1;
                re.message = '查询失败';
                throw re;
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

router.post('/graphql', graphqlKoaLog({
    schema: myGraphQLSchema,
}));
router.get('/graphql', graphqlKoaLog({
    schema: myGraphQLSchema
}));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);
```
## graphql-tools快速构建
graphql-tools([官网](https://www.apollographql.com/docs/graphql-tools/))是使用graphql固定的语法构建schema。

安装
```text
npm install graphql-tools 
```

### 实例

```js
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
```


## graphql-schema类型
### 标量类型（Scalar Types)
- Int：有符号 32 位整数。
- Float：有符号双精度浮点值。
- String：UTF‐8 字符序列。
- Boolean：true 或者 false。
- ID：ID 标量类型表示一个唯一标识符，通常用以重新获取对象或者作为缓存中的键。ID 类型使用和 String 一样的方式序列化；然而将其定义为 ID 意味着并不需要人类可读型。

- 自定义标量类型

<br>
typeDefs

```js 
#时间类型 
scalar Date
```
resolvers

```js
const resolvers = {
    Date: {
        parseValue(value) {// 序列化
            return new Date(value);
        },
        serialize(value) {// 反序列化
            return value.getTime();
        }
    }
};

```
### 对象类型和字段（Object Types）
一个 GraphQL schema 中的最基本的组件是对象类型，它就表示你可以从服务上获取到什么类型的对象，以及这个对象有什么字段。使用 GraphQL schema language，我们可以这样表示它：
```text
type Character {
  name: String!
  appearsIn: [Episode]!
}
```
- Character 是一个 GraphQL 对象类型，表示其是一个拥有一些字段的类型。你的 schema 中的大多数类型都会是对象类型。
- name 和 appearsIn 是 Character 类型上的字段。这意味着在一个操作 Character 类型的 GraphQL 查询中的任何部分，都只能出现 name 和 appearsIn 字段。
- String 是内置的标量类型之一 —— 标量类型是解析到单个标量对象的类型，无法在查询中对它进行次级选择。后面我们将细述标量类型。
- String! 表示这个字段是非空的，GraphQL 服务保证当你查询这个字段后总会给你返回一个值。在类型语言里面，我们用一个感叹号来表示这个特性。
- [Episode]! 表示一个 Episode 数组。因为它也是非空的，所以当你查询 appearsIn 字段的时候，你也总能得到一个数组（零个或者多个元素）。


### 参数（Arguments）
GraphQL 对象类型上的每一个字段都可能有零个或者多个参数，例如下面的 length 字段：

typeDefs
```text
type Starship {
    id: ID!
    name: String!
    length(unit:Int=1): Float
}
```

resolvers
```js
const resolvers = {
    Starship: {
            length(root, {unit}, context) {
                return unit === 1 ? root.length : root.length /1000;
            }
        }
}
```

### 查询和变更类型（The Query and Mutation Types）
一个schema 中大部分的类型都是普通对象类型，但是一个 schema 内有两个特殊类型,
每一个 GraphQL 服务都有一个 query 类型，可能有一个 mutation 类型。这两个类型和常规对象类型无差，但是它们之所以特殊，是因为它们定义了每一个 GraphQL 查询的入口。因此如果你看到一个像这样的查询：

typeDefs
```text
type Query{
    test:Int
}
type Mutation{
    test:Int
}
schema {
  query: Query
  mutation: Mutation
}
```

### 枚举类型（Enumeration Types） 
枚举类型限制了值在可选范围之内。枚举类型只能为String类型

typeDefs
```text
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```
### 列表和非空（Lists and Non-Null） 
对象类型、标量以及枚举是 GraphQL 中你唯一可以定义的类型种类。但是当你在 schema 的其他部分使用这些类型时，或者在你的查询变量声明处使用时，你可以给它们应用额外的类型修饰符来影响这些值的验证。我们先来看一个例子：

typeDefs
```text
type Character {
  name: String!
  appearsIn: [Episode]!
}

```

### 接口（Interfaces）
跟许多类型系统一样，GraphQL 支持接口。一个接口是一个抽象类型，它包含某些字段，而对象类型必须包含这些字段，才能算实现了这个接口。

typeDefs
```text
interface Vehicle {
    maxSpeed: Int
}
type Airplane implements Vehicle {
    maxSpeed: Int
    wingspan: Int
}

type Car implements Vehicle {
    maxSpeed: Int
    licensePlate: String
}
type Query {
    vehicles:Vehicle
}
```

resolvers
```js
const resolvers = {
    Query: {
        vehicles() {
            return {maxSpeed:1,licensePlate:'test'}
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
    }
}

```

### 联合类型（Union Types） 
联合类型和接口十分相似，但是它并不指定类型之间的任何共同字段。联合类型的成员需要是具体对象类型；你不能使用接口或者其他联合类型来创造一个联合类型。

typeDefs
```text
union UnionVehicle = Airplane | Car
type Query {
    unionVehicles:UnionVehicle
}
```

resolvers
```js
const resolvers = {
    Query: {
        unionVehicles() {
            return {maxSpeed:1,licensePlate:'test'}
        }
    },
    UnionVehicle: {
        __resolveType(obj, context, info){
            if(obj.wingspan){
                return 'Airplane';
            }

            if(obj.licensePlate){
                return 'Car';
            }
            return null;
        }
    }
}
```

### 输入类型（Input Types） 
前端传入的对象,通过args进行传入到后端。和输出对象类似,但是关键字为input。输入对象和输出对象不能混用。

typeDefs
```text
input ReviewInput {
    stars: Int!
    commentary: String
}
type Query {
    testInput(field:ReviewInput): Int
}
```

resolvers
```js
const resolvers = {
    Query: {
         testInput(root, {field}, context) {
            console.log(field);
            return 1;
        }
    }
}
```


## github-api-v4设计规范分析
github-api-v4采用的为graphql规范，之前的版本都为Rest规范。<br>
[文档地址](https://developer.github.com/v4/) 文档grapiql<br> 
[grapiql地址](https://developer.github.com/v4/explorer/)  (需要使用github账号进行登录才能使用)<br>

### schema设计
- queries:查询。
- mutations:修改。

### type设计
- scalars:标量
- objects:输出对象
- enums:枚举
- interfaces:接口
- unions:联合对象
- input objects:输入对象

### 命名规范
- scalar:首字母大写，尽量以单个的单词简单命名。如Int String。
- object:首字母大写吗，如Deployment DeploymentStatus。
- enum:首字母大写，如果enum对应object中的字段，则以object名称加上字段名称。如DeploymentState。
- interface:首字母大写，如Node Actor。
- union:首字母大写，如PullRequestTimelineItem。
- input object:和object一致。
- query:首字母小写，如查询结果集为单个对象，则为对象名，如果为查询的结果集为多数组，则为对象的复数。如license查询返回的为license，
licenses查询方法返回的为[License]。
- mutation:首字母小写，根据 动词+object。可参考的动词:<br>
add: 增加简单记录，影响单个对象，如addStar。<br>
create: 创建复杂记录，影响多个对象，如createProject。<br>
remove: 删除简单记录，影响单个对象，如removeStar。<br>
delete: 删除复杂记录，影响多个对象，如deleteProject。<br>
update: 更新记录，如updateProject。<br>




## 设计规范项目实例
根据上面的github api的设计规范可以得出适应自己项目的一些规范。下面为作者本人的项目的规范，可供参考。

### 目录结构
- graphql-type
   - enums.graphql
   - input-objects.graphql
   - interfaces.graphql
   - objects.graphql
   - schema.graphql
   - unions.graphql
- graphql-resolvers
   - mutations // 对应的所有mutation操作，按业务划分不同的文件
   - queries // 对应的所有query操作，按业务划分不同的文件
   - resolvers // 对应的所有resolve操作，按业务划分不同的文件
### 项目地址
https://github.com/wenshaoyan/apollo-server-example
