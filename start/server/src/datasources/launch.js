import { RESTDataSource } from "apollo-datasource-rest";

class LaunchAPI extends RESTDataSource {
  constructor() {
    /* constructor: class내에서 객체를 생성하고 초기화하기 위한 특별한 메서드 */
    super(); /* super: 부모 생성자(여기서는 constructor) 호출 */
    this.baseURL = `https://api.spacexdata.com/v2/`;
    /* LaunchAPI는 RESTDataSource의 속성을 가지는데 
    constuctor로 RESTDataSource의 속성을 초기화시키고
    super()로 초기화한 LaunchAPI(RESTDataSource속성을 지닌)을 부르고
    this(이렇게 불러진 함수)에는 baseURL라는 변수?가 있는데 거기에 주소를 넣는다는 의미임
    */
  }

  launchReducer(launch) {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_data_unix}`,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: this.launchReducer.links.mission_patch
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.name,
        type: launch.rocket.rocket_type
      }
    };
  }

  async getAllLaunches() {
    const response = await this.get("launches");
    return Array.isArray(response)
      ? response.map(launch => this.launchReducer(launch))
      : [];
  }

  async getLaunchByID() {
    const response = await this.get("launches", { flight_number: launchId });
    return this.launchReducer(response[0]);
    /* launchId를 받으면 response라는 배열 0번째부터 반환하라는 의미
     */
  }

  getLaunchesByIds({ launchIds }) {
    return Promise.all(
      launchIds.map(launchId => this.getLaunchByID({ launchId }))
    );
    /* 
    promise all: 배열 내 모든 값을 이행하라는 의미임. 즉 getLaunchByID으로 launchId가 배열로 정리되었으면
    이것을 map함수로 다시 정리한다
    (map함수: 키와 값의 쌍을 지정하며, 각 쌍의 삽입 순서도기억한다. 키와 값은 아무것이나 상관없다)
    즉, launchId를 얻은 것은 this(LaunchAPI의 launchId)로 지정하는 것이다.
    */
  }
}

export default LaunchAPI;
