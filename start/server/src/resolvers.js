const { paginateResults } = require("./utils");

module.exports = {
  Query: {
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      allLaunches.reverse(); // 시간순서대로 원하기에

      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches // results를 allLaunches라 한다
      });
      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        // cursor가 존재한다면 배열 마지막 것에 바로 전에 존재
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false
        // paginated results의 마지막 커서가 마지막 아이템 커서와 같다면 더이상 결과가 없는 것임
        // 주목할 것은 ? 다음에는 true자리라고 알고 있지만, 수식을 넣어서 다시한번 가정없이 bool값을 뽑고 있다.
      };
    },
    launch: (_, { id }, { dataSources }) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),
    me: async (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
  },
  Mission: {
    //특별히 정하지 않으면 기본사이즈는 large이다.
    missionPatch: (mission, { size } = { size: "LARGE" }) => {
      // 첫번째는 부모로부터 오는 mission object이다.
      return size === "SMALL"
        ? mission.missionPatchSmall
        : mission.missionPatchLarge;
    }
  },
  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id })
  },
  User: {
    trips: async (_, __, { dataSources }) => {
      // get ids of launches by user
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

      if (!launchIds.length) return [];
      return dataSources.launchAPI.getLaunchesByIds({ launchIds }) || [];
    }
  }
};
