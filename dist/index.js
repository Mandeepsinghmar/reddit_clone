"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const Post_1 = require("./entities/Post");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const server_1 = require("@apollo/server");
const hello_1 = require("./resolvers/hello");
const standalone_1 = require("@apollo/server/standalone");
const utils_1 = require("type-graphql/dist/utils");
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    await orm.getMigrator().up();
    const server = new server_1.ApolloServer({
        schema: await (0, utils_1.buildSchema)({
            resolvers: [hello_1.HelloResolver],
            validate: false,
        }),
    });
    const { url } = await (0, standalone_1.startStandaloneServer)(server, {
        listen: { port: 4000 },
    });
    console.log(`🚀 Server listening at: ${url}`);
    const post = orm.em.create(Post_1.Post, {
        title: 'my first post',
    });
    await orm.em.persistAndFlush(post);
    const posts = await orm.em.find(Post_1.Post, {});
    console.log(posts);
};
main().catch((err) => console.error(err));
//# sourceMappingURL=index.js.map