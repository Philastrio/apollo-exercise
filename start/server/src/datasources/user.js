const { DataSource } = require("apollo-datasource");
const isEmail = require("isemail");

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
    /* initialize: 설정옵션들을 통과시키기 위해 쓰인다. 
    그래서 이걸 사용해 graph API's context에 접근한다
    this.context: graph API's context로서 모든 resolver와 공유하는 것임
     */
  }

  async findOrCreateUser({ email: emailArg } = {}) {
    /* email: emailArg => email이 반드시 속성으로 들어오지만, 이를 별칭으로
    emailArg라고 부르는 것이다 */
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.users.findOrCreate({ where: { email } });
    return users && users[0] ? users[0] : null;
    /* store: apollo에서 쓰는 명령어. 
    해석>> context를 통해서 전해진 email이 있으면 그걸로, 아니면 입력된 이메일이 있으면 email변수에 저장하라. 
    users들 중에서 변수 email로 찾은 users를 users 변수라 한다. (찾은 결과물은 배열형태)
    그리고 만약 변수 users가 존재하고 결과물의 배열의 첫번째라면 그결과물을 반환하고 그렇지 않으면 null값이다. 
    즉, email은 유일한 값이어야 하기에 2개 이상 존재하면 안되고, 존재하면 잘못된 것이기 때문이다. 
     */
  }

  async bookTrips({ launchIds }) {
    /* 여기 들어오는 것을 launchIds라고 하지만, 특별한 제한은 없다.*/
    // 다만 bookTrips 함수와 bookTrip 함수가 다른 점은
    // bookTrips함수는 수많은 launchIds! 즉 복수!이기에 그 많은 id중에 하나를 찾아서 예약하는 것이다
    const userId = this.context.user.id;
    // 먼저 공통으로 전달되는 user id가 존재하면 그걸 userId라 하고
    if (!userId) return;
    // userId가 없으면 그냥 종료한다. 여기서 끝난다.  // return은 함수실행을 종료하고, 주어진 값을 함수 호출지점으로 반환한다.
    // userId가 존재하면 다음으로 넘어간다
    let results = [];

    for (const launchId of launchIds) {
      // launchIds에서 launchId가 존재하는지 계속확인해서 존재하면
      const res = await this.bookTrip({ launchId });
      // res값으로 UserAPI에서 bookTrip라는 함수를 이용해서 launchId로 예약한다.
      if (res) results.push(res);
      // res값이 존재하면 results 변수라는 배열에 res를 집어넣는다
    }

    return results;
    // 그리고 results를 반환한다
  }

  async bookTrip({ launchId }) {
    // bookTrip함수는 오직 1개의 launchId를 가지고 예약한다
    const userId = this.context.user.id;
    //UserAPI를 통해 공통으로 전해지는 user의 id가 존재하면 이를 userId라 한다
    const res = await this.store.trips.findOrCreate({
      // UserAPI에 trips에 저장된 곳에서, 어디냐면(where) userId, launchId으로 찾으면
      // 이를 res 변수에 저장한다
      where: { userId, launchId }
    });
    return res && res.length ? res[0].get() : false;
    // res가 존재하고 이 길이가 있으면 res 배열변수 첫번째에서 이를 얻고(get=즉 저장하는 것), 그렇지 않으면 false가 된다.
    // 왜냐하면 userId랑 lauchId는 딱 1개밖에 존재하지 않기 때문이다.
  }

  async cancelTrip({ launchId }) {
    const userId = this.context.user.id;
    // 취소는 오직 로그인한 사람만 취소할 수 있기에 로그인한 user.id를 받는다
    return !!this.store.trips.destroy({ where: { userId, launchId } });
    // !! 부정이 두번이니 긍정이다.
    // UserAPI(this)에 저장된 trips에서 userId, launchId를 찾아서 파괴한다
  }

  async getLaunchIdsByUser() {
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId }
      // UserAPI에 저장된 trips에서 userId를 가지고 찾은 모든 것을 found라 한다. 이는 배열이 될 것이다.
    });
    return found && found.length
      ? found.map(l => l.dataValues.launchId).filter(l => !!l)
      : [];
    // map: 요소가 키, 값 쌍인 Array 또는 다른 순회가능한 객체요소의 삽입순서대로 원소를 순회한다
    // found가 존재하면 이것을 l이라 하면, 이를 다시 l.dataValues.launchId로 재구성한다.
    // found가 없으면 빈 배열만 반환한다
  }

  async isBookedOnLaunch({ launchId }) {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;
    // 공통된 적용되는 context의 user에 id가 존재하면 이를 userId에 할당한다
    const found = await this.store.trips.findAll({
      where: { userId, launchId }
    });
    // UserAPI에 저장된 trips에서 userId, launchId를 가지고 찾은 값 배열을 found라 한다
    return found && found.length > 0;
    // found가 존재하고 길이기 0보다 크면 함수는 종료한다
  }
}

module.exports = UserAPI;
