# 🟢  NodeJS GraphQL Composer

 A tiny and minimalist, with minimum dependencies tool, which allows you to use, split and organize the native GQL files in your NodeJs project.

<br>
<br>
<br>

<center><img width="600px" style="max-width: 100%; margin-right: auto;  margin-left: auto; " src="https://raw.githubusercontent.com/nudelx/node-gql-schema-composer/main/doc/title_img.png"/></center>

---
## How it works?

You can use native gql files in your nodejs/graphql project. You can split and organize it according to your needs. You can call it as you want, you can nest it as you need. Keep your gql files small and simple.

<img style="max-width: 100%; margin-right: auto;  margin-left: auto; " src="https://raw.githubusercontent.com/nudelx/node-gql-schema-composer/main/doc/organize.png"/>



## Example:

### Using promise chain:

```js
const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { composeSchema } = require('node-gql-schema-composer')

const app = express()
composeSchema('./gql')
  .then(schema => {
    app.use('/graphql', graphqlHTTP({
      schema: buildSchema(schema),
      rootValue: { hello: () => { return 'Hello world!' }}
      graphiql: true,
    }))
  })
  .then(() => app
    .listen(4000, () => console.log('Now browse to localhost:4000/graphql')))

```
### Using async/await syntax:
```js
const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { composeSchema, dumpToFile, readFolder } = require('node-gql-schema-composer')

const start = async function () {

  const app = express()
  const schema = await composeSchema('./gql')

  app.use('/graphql', graphqlHTTP({
    schema: buildSchema(schema),
    rootValue: { hello: () => { return 'Hello world!' }}
    graphiql: true,
  }))

  app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'))
}


start()
```

### With Apollo Server:
```js
const express = require('express')
const { buildSchema } = require('graphql')
const { composeSchema, dumpToFile } = require('node-gql-schema-composer')
const  { ApolloServer } = require( 'apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require( 'apollo-server-core')
const http = require( 'http')
const Query = {
  hello: () => {
    return 'Hello world!'
  },
}


async function startApolloServer(resolvers) {
  const app = express()
  const typeDefs = buildSchema(await composeSchema('./gql'))
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()
  server.applyMiddleware({ app })
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve))
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}

startApolloServer({ Query })
 
```

### Dump to the schema file:

```js
const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { composeSchema, dumpToFile } = require('node-gql-schema-composer')

const start = async function () {

  const app = express()
  const schema = await composeSchema('./gql')

  app.use('/graphql', graphqlHTTP({
    schema: buildSchema(schema),
    rootValue: { hello: () => { return 'Hello world!' }}
    graphiql: true,
  }))

  app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'))
}

dumpToFile('./gql')  // it will create a composed schema file in the root folder

start()
```
<img style="max-width: 100%; margin-right: auto;  margin-left: auto; " src="https://raw.githubusercontent.com/nudelx/node-gql-schema-composer/main/doc/dump.png"/>

<br><br>

### Auto restart with `nodemon`: 

You can the files extension to the nodemon and enjoy the auto-restarting behaviors on each change in gql files.
Just add the following tweak to your script in the `package.json` file:

```js
 "start": "nodemon --watch **/*.gql index.js"
```

and now your nodemon will be also sensitive to the changes in your `.gql` files:
```bash
❯ yarn start
yarn run v1.22.17
$ nodemon --watch **/*.gql index.js
[nodemon] 2.0.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): gql/index.gql
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
Now browse to localhost:4000/graphql

[nodemon] restarting due to changes...
[nodemon] starting `node index.js`
[nodemon] restarting due to changes...
[nodemon] starting `node index.js`
Now browse to localhost:4000/graphql
```

<br>

## Inside

The module provides 3 simple functions:
```js
  function composeSchema( path ) {...}

  /*  async function which will compose on-the-fly all your chunks .gql files
  *   into one schema used by graphql
  *   
  *   PARAMS: 
  *     < path:string > the place where you will have all your .gql files/folders 
  */
```

```js
  function dumpToFile( path, name ) {...}

  /*  a simple dump function which will compose all your chunks .gql files
  *   into one schema and will write it into one single file in the root folder, according to the name, which is has a default *   name "schema"
  *   
  *   PARAMS: 
  *     < path:string > the place where you will have all your .gql files/folders 
  *     < name:string | optional> the name of dump file ( default: "schema.gql")
  */
```

```js
  function readFolder( path, name ) {...}

  /*  async internal function which will read and find all your .gql|.graphql files under provided path 
  */
```

Made with ❤️ by Nudelman Alex 