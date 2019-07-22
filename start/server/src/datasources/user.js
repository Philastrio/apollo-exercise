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
    그래서 이걸 사용해 graph API context에 접근한다
     */
  }
}
