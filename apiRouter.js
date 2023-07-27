const express = require("express");
const mysql = require('mysql');
const router = express.Router();
const bodyParser = require('body-parser');


// 处理POST请求的中间件
router.use(bodyParser.json());


// 数据库连接函数
function dbConnection() {
  // 连接上数据库
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zhang3025',
    database: 'matchdb'
  });
  connection.connect((err) => {
    if (err) {
      console.log('error', err);
      return;
    }
    console.log("sussess")
  });
  return connection;
}

function dbClosed(connection) {
  // 关闭连接
  connection.end((error) => {
    if (error) {
      console.error('数据库关闭连接时出错：', error);
      return;
    }
    console.log('数据库连接已关闭。');
  });
}

// 登录接口
router.post("/login", (req, res) => {
  // 用于判断是否是管理者
  var isRoot;
  var exist;
  const options = {
    raw: true
  };
  // 连接上数据库
  const connection = dbConnection();

  // 查询数据
  var query = 'SELECT username,password FROM user';
  connection.query(query, options, (err, results, fields) => {
    // if (err) throw err;
    if (err) {
      console.error('执行查询时出错：', err);
      return;
    }
    for (var i = 0; i < results.length; i++) {
      const username = req.body.username;
      const password = req.body.password;
      if (username == results[i].username && password == results[i].password) {
        console.log("存在");
        exist = true;
        if (username == "root" && password == "888888") {
          isRoot = true;
          break;
        } else {
          isRoot = false;
          break;
        }
      } else {
        exist = false;
        isRoot = false;
      }
    }
    res.send({
      status: 0,
      msg: "POST请求成功",
      data: { exist, isRoot }
    })
  });
  // 关闭数据库
  dbClosed(connection);
})

// 注册接口
router.post("/register", (req, res) => {
  var done;
  const connect = dbConnection();
  const data = req.body
  const query = 'INSERT INTO user (username, password,phone,gender) VALUES (?,?,?,?)';
  connect.query(query, [data.name, data.password, data.contact, data.gender], (err, result) => {
    if (err) {
      console.error('执行插入操作时出错：', err);
      done = false;
      return;
    }
    console.log('数据插入成功。');
    done = true;
    console.log(data);
    res.send({
      status: 0,
      msg: "POST请求成功",
      done: done
    })
  });
  dbClosed(connect);
})
// 获取组队大厅信息
router.get("/getTeamList", (req, res) => {
  const options = {
    row: true,
  }
  console.log("getTeamList接口被调用");
  const connect = dbConnection();
  const query = 'SELECT * FROM matchinfo'
  connect.query(query, options, (error, results,) => {
    if (error) {
      console.error('执行查询时出错：', error);
      return;
    }
    console.log(results);
    res.send({
      status: 0,
      msg: "GET请求成功",
      data: results
    })
  })
  dbClosed(connect);
})

// 获取历史组队信息
router.get("/getHistory", (req, res) => {
  console.log("getHistory接口被调用");
  const options = {
    row: true,
  }
  const connect = dbConnection();
  const query = 'select * from history';
  connect.query(query, options, (error, results) => {
    if (error) {
      console.error('执行查询时出错：', error);
      return;
    };
    console.log(results);
    res.send({
      status: 0,
      msg: "GET请求成功",
      data: results
    })
  })
  dbClosed(connect);
})

// 个人中心接口
router.get("/getUser", (req, res) => {
  console.log("getUser接口被调用");
  const connect = dbConnection();
  var options = { row: true };
  var query = 'SELECT username,phone,school,province FROM user where username = "user"';
  connect.query(query, options, (error, results) => {
    if (error) {
      console.error('执行查询时出错：', error);
      return;
    };
    console.log(results);
    res.send({
      status: 0,
      msg: "GET请求成功",
      data: results
    })
  });
  dbClosed(connect);
})

// 获取已读消息
router.get("/getRead", (req, res) => {
  console.log("getRead接口被调用");
  const connect = dbConnection();
  const options = {
    raw: true
  };
  var query = 'SELECT date,name,address FROM message where status = 1';
  connect.query(query, options, (err, results) => {
    if (err) {
      console.error('执行查询时出错：', err);
      return;
    }
    console.log(results);
    res.send({
      status: 0,
      msg: "GET请求成功",
      data: results
    })
  })
  dbClosed(connect);
})

// 获取未读消息
router.get("/getUnRead", (req, res) => {
  console.log("getUnRead接口被调用");
  const connect = dbConnection();
  const options = {
    raw: true
  };
  var query = 'SELECT date,name,des FROM message where status = 0';
  connect.query(query, options, (err, results) => {
    if (err) {
      console.error('执行查询时出错：', err);
      return;
    }
    console.log(results);
    res.send({
      status: 0,
      msg: "GET请求成功",
      data: results
    })
  })
  dbClosed(connect);
  /* const tableData = [{
    date: '12987122',
    name: '好滋好味鸡蛋仔',
    desc: '荷兰优质淡奶，奶香浓而不腻',
    detail: 'xiaoqingjianjijisgkghasdjk'
  }, {
    date: '12987123',
    name: '好滋好味鸡蛋仔',
    desc: '荷兰优质淡奶，奶香浓而不腻',
    detail: 'xiaoqingjianjijisgkghasdjk'
  }, {
    date: '12987123',
    name: '好滋好味鸡蛋仔',
    desc: '荷兰优质淡奶，奶香浓而不腻',
    detail: 'xiaoqingjianjijisgkghasdjk'
  }, {
    date: '12987123',
    name: '好滋好味鸡蛋仔',
    desc: '荷兰优质淡奶，奶香浓而不腻',
    detail: 'xiaoqingjianjijisgkghasdjk'
  }];
  res.send({
    status: 0,
    msg: "GET请求成功",
    data: tableData
  }) */
})

// 获取比赛资讯
router.get("/getMatch", (req, res) => {
  console.log("getMatch接口被调用");
  const connect = dbConnection();
  const options = {
    raw: true
  };
  var query = 'SELECT date,name,des,detail FROM matchnews ';
  connect.query(query, options, (err, results) => {
    if (err) {
      console.error('执行查询时出错：', err);
      return;
    }
    console.log(results);
    res.send({
      status: 0,
      msg: "GET请求成功",
      data: results
    })
  })
  dbClosed(connect);
  /* const tableData = [{
    date: '2016-05-02',
    name: '王小虎',
    desc: '这是一条概要1'
  }, {
    date: '2016-05-04',
    name: '王小虎',
    desc: '这是一条概要2'
  }, {
    date: '2016-05-01',
    name: '王小虎',
    desc: '这是一条概要3'
  }, {
    date: '2016-05-03',
    name: '王小虎',
    desc: '这是一条概要4'
  }, {
    date: '2016-05-01',
    name: '王小虎',
    desc: '这是一条概要5'
  }, {
    date: '2016-05-01',
    name: '王小虎',
    desc: '这是一条概要6'
  }, {
    date: '2016-05-01',
    name: '王小虎',
    desc: '这是一条概要7'
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    desc: '这是一条概要7'
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    desc: '这是一条概要7'
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    desc: '这是一条概要7'
  },
  ];
  res.send({
    status: 0,
    msg: "GET请求成功",
    data: tableData
  }) */
})

module.exports = router;