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
    type Starship {
        id: ID!
        name: String!
        length(unit:Int=1): Float
    }
    enum Episode {
      NEWHOPE
      EMPIRE
      JEDI
    }
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
    union UnionVehicle = Airplane | Car
    input ReviewInput {
        stars: Int!
        commentary: String
    }
    type Query {
        users: [User]
        starships: [Starship]
        episodes: Episode
        vehicles:Vehicle
        unionVehicles: UnionVehicle
        testInput(field:ReviewInput): Int
        relay: Query
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
            return [{id: 1, name: 'wenshao', create_time: new Date()}];
        },
        starships() {
            return [{id: 1, name: '1', length: 1.1}];
        },
        episodes() {
            return 'EMPIRE';
        },
        vehicles() {
            return {maxSpeed: 1, licensePlate: 'test'}
        },
        unionVehicles() {
            return {maxSpeed: 1, licensePlate: 'test'}
        },
        testInput(root, {field}, context) {
            console.log(field);
            return 1;
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
            return unit === 1 ? root.length : root.length / 1000;
        }
    },
    Vehicle: {
        __resolveType(obj, context, info) {
            if (obj.wingspan) {
                return 'Airplane';
            }

            if (obj.licensePlate) {
                return 'Car';
            }
            return null;
        }
    },
    UnionVehicle: {
        __resolveType(obj, context, info) {
            if (obj.wingspan) {
                return 'Airplane';
            }

            if (obj.licensePlate) {
                return 'Car';
            }
            return null;
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