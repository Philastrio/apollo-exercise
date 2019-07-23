const SQL = require("sequelize");

module.exports.paginateResults = ({
  after: cursor, // after를 받는데 이를 cursor라고 별칭으로 부른다
  pageSize = 20,
  results,
  getCursor = () => null // 아이템의 커서를 계산해서 함수에서 패스할수 있다
  /* after: any;
    pageSize?: number; // 하지만 기본은 20
    results: any;
    getCursor?: () => any; // 기본은 null값이다
}) => any */
}) => {
  if (pageSize < 1) return [];
  // pageSize가 1보다 작으면 빈 배열을 반환한다
  if (!cursor) return results.slice(0, pageSize);
  // cursor(게시판에서 아래 1,2 이런게 없다는 의미 같음)가 존재하지 않는다면
  // result에 0번부터 pageSize변수까지 잘라서 results에 반환한다

  const cursorIndex = results.findIndex(item => {
    /* findIndex 메서드는 콜백함수가 진리값을 반환할때까지 배열의 모든 배열 인덱스 0 ~ 마지막까지 한 번씩 콜백 함수를 실행하다 
  이러한 요소가 발견되면 findIndex는 해당 반복에 대한 색인을 즉시 반환한다. 즉 함수가 참 인것이 몇개인지 반환한다
  콜백이 진리 값을 반환하지 않거나 배열의 길이가 0인 경우 findIndex는 -1을 반환한다. Array #some과 다르게 배열에 존재하지
  않은 엔트리의 인덱스에 대해서도 콜백이 호출된다.
  */
    let itemCursor = item.cursor ? item.cursor : getCursor(item);
    // item.cursor가 존재하면 그걸로하고, 그렇치않으면 item을 가지고 만든다.
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? // cursorIndex가 존재하면
      cursorIndex === results.length - 1
      ? // results배열 길이에 1을 빼고
        []
      : // cursorIndex가 존재하지 않으면 => 즉 한 화면에 다 보이는 경우
        results.slice(
          cursorIndex + 1,
          Math.min(results.length, cursorIndex + 1 + pageSize)
        )
    : /* cursorIndex는 -1일 수 있다(findIndex는 없으면 -1을 반환하기 때문임)
        Math.min에서 cursorIndex + 1은 cursorIndex이 -1일 경우를 대비한 것임
        따라서 cursorIndex이 -1이라면 배열은 0~0까지로 첫번째만 반환하게 된다
         */
      results.slice(0, pageSize);
};

module.exports.createStore = () => {
  const Op = SQL.Op;
  const operatorsAliases = {
    $in: Op.in // $in이란 Op.in을 의미한다
  };

  const db = new SQL("database", "username", "password", {
    dialect: "sqlite",
    storage: "./store.sqlite",
    operatorsAliases,
    logging: false
  });

  const users = db.define("user", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: SQL.DATE,
    updateAt: SQL.DATE,
    email: SQL.STRING,
    token: SQL.STRING
  });

  const trips = db.define("trip", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: SQL.DATE,
    updateAt: SQL.DATE,
    launchId: SQL.INTEGER,
    userId: SQL.INTEGER
  });

  return { users, trips };
};
