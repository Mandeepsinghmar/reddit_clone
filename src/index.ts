import { __prod__ } from './constants';
import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import { Post } from './entities/Post';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import mikroConfig from './mikro-orm.config';
import { ApolloServer } from '@apollo/server';
import { HelloResolver } from './resolvers/hello';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql/dist/utils';

const main = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(mikroConfig);
  await orm.getMigrator().up();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
  });
  // const { url } = await startStandaloneServer(server, {
  //   listen: { port: 4000 },
  // });

  // console.log(`🚀 Server listening at: ${url}`);
  const app = express();
  // server.applyMiddleware({ app });

  app.get('/', (req, res) => {
    res.send('hello');
  });
  app.listen(4000, () => {
    console.log('server starts on 4000: localhost');
  });
  const post = orm.em.create(Post, {
    title: 'my first post',
  });
  await orm.em.persistAndFlush(post);

  const posts = await orm.em.find(Post, {});
  console.log(posts);
};

main().catch((err) => console.error(err));
