const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const { createStore } = require("./utils");
const resolvers = require("./resolvers");

const LaunchAPI = require("./datasources/launch");
const UserAPI = require("./datasources/user");

const store = createStore();

/* context fuction은 매번 Graphql 작업이 내 API를 칠때마다 이 request object를 
authorization headers에서 읽어낸다

한번 인증되면 사용자를 object에서 뽑아내서 data source에서 사용자정보를 읽어 데이터에
접근할수 있게 권한을 부여한다
 */
const server = new ApolloServer({
  context: async ({req} => {
    // 매 requset마다 auth를 체크한다
    const auth = (req.header)
  })
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store })
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
