import { DataSource } from "apollo-datasource";
import isEmail from "isemail";

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
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.users.findOrCreateUser({ where: { email } });
    return users && users[0] ? users[0] : null;
    /* store: apollo에서 쓰는 명령어. 
    해석>> context를 통해서 전해진 email이 있으면 그걸로, 아니면 입력된 이메일이 있으면 email변수에 저장하라. 
    users들 중에서 변수 email로 찾은 users를 users 변수라 한다. (찾은 결과물은 배열형태)
    그리고 만약 변수 users가 존재하고 결과물의 배열의 첫번째라면 그결과물을 반환하고 그렇지 않으면 null값이다. 
    즉, email은 유일한 값이어야 하기에 2개 이상 존재하면 안되고, 존재하면 잘못된 것이기 때문이다. 
     */
  }
  
  async bookTrips ({launchIds}) {
    const userId = this.context.user.id
  }
  }
}
