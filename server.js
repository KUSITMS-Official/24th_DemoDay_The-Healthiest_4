const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const router = express.Router();

/* for pagination */
const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

/* image upload */
let multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/image");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var path = require("path");

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return callback(new Error("PNG, JPG만 업로드하세요"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});

/* DB 연결 */
var db;
var id_list, nick_list, mail_list;
const MongoClient = require("mongodb").MongoClient;
MongoClient.connect(
  "mongodb+srv://admin:health1234@cluster0.g6wfe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  function (err, client) {
    if (err) return console.log(err);

    db = client.db("The_Healthiest");
    db.collection("User")
      .find({}, { projection: { user_id: 1, _id: 0 } })
      .toArray(function (err, user_id) {
        //console.log(user_id);
        id_list = user_id;
        if (err) return done(err);
      });
    db.collection("User")
      .find({}, { projection: { nickname: 1, _id: 0 } })
      .toArray(function (err, nickname) {
        // console.log(nickname);
        nick_list = nickname;
        if (err) return done(err);
      });
    db.collection("User")
      .find({}, { projection: { email: 1, _id: 0 } })
      .toArray(function (err, email) {
        //console.log(email);
        mail_list = email;
        if (err) return done(err);
      });

    app.listen(8080, function () {
      // console.log("listening on 8080");
    });

    const mongoose = require("mongoose");
    module.exports = () => {
      function connect() {
        mongoose.connect("localhost:8080", function (err) {
          if (err) {
            console.error("mongodb connection error", err);
          }
          console.log("mongodb connected");
        });
      }
      connect();
      mongoose.connection.on("disconnected", connect);
      require("mypage/mailbox");
    };
  }
);

var path = require("path");
app.use(express.static(path.join(__dirname, "public")));

/* page rendering */

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/main/main_before_login.html");
});

app.get("/main", function (req, res) {
  res.sendFile(__dirname + "/views/main/main_after_login.html");
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/views/main/login.html");
});

app.get("/join", function (req, res) {
  res.render("main/join.ejs", {
    id_list: id_list,
    nick_list: nick_list,
    mail_list: mail_list,
  });
  //res.sendFile(__dirname+'/views/main/join.html');
});

app.get("/info", function (req, res) {
  res.sendFile(__dirname + "/views/main/info_before_login.html");
});

app.get("/health", function (req, res) {
  res.sendFile(__dirname + "/views/main/health_before_login.html");
});

app.get("/community_main", function (req, res) {
  res.sendFile(__dirname + "/views/main/communitymain_before_login.html");
});

app.get("/challenge_main", function (req, res) {
  res.sendFile(__dirname + "/views/main/challengemain_before_login.html");
});

app.get("/hometraining_main", function (req, res) {
  res.sendFile(__dirname + "/views/main/hometraining_before_login.html");
});

app.get("/info2", function (req, res) {
  res.sendFile(__dirname + "/views/main/info_after_login.html");
});

app.get("/health2", function (req, res) {
  res.sendFile(__dirname + "/views/main/health_after_login.html");
});

app.get("/hometraining_main2", function (req, res) {
  res.sendFile(__dirname + "/views/main/hometraining_after_login.html");
});

/* community */

app.get("/community", function (req, res) {
  res.render("community/comm_list.ejs");
});

app.get("/community/free", function (req, res) {
  db.collection("Post")
    .find()
    .toArray(function (error, result) {
      // console.log(result);
      res.render("community/comm_free.ejs", { posts: result });
    });
});

app.get("/community/bodytype", function (req, res) {
  db.collection("Post")
    .find()
    .toArray(function (error, result) {
      res.render("community/comm_body.ejs", { posts: result });
    });
});

app.get("/community/crew", function (req, res) {
  res.render("community/comm_crew.ejs");
});

app.get("/community/tips", function (req, res) {
  res.render("community/comm_tips.ejs");
});

app.get("/community/meal", function (req, res) {
  res.render("community/comm_meal.ejs");
});

app.get("/community/grouporder", function (req, res) {
  res.render("community/comm_go.ejs");
});

/* community write pages */

app.get("/community/free/write", function (req, res) {
  res.render("community/comm_write_free.ejs");
});

app.get("/community/grouporder/write", function (req, res) {
  res.render("community/comm_write_go.ejs");
});

app.get("/community/meal/write", function (req, res) {
  res.render("community/comm_write_meal.ejs");
});

app.get("/community/crew/write", function (req, res) {
  res.render("community/comm_write_crew.ejs");
});

app.get("/community/bodytype/write", function (req, res) {
  res.render("community/comm_write_body.ejs");
});

app.get("/community/tips/write", function (req, res) {
  res.render("community/comm_write_tips.ejs");
});

app.get("/community/detail/:id", function (req, res) {
  db.collection("Post").findOne(
    { post_id: parseInt(req.params.id) },
    function (err, result) {
      db.collection("Comment")
        .find()
        .toArray(function (err, result2) {
          res.render("community/comm_detail.ejs", {
            data: result,
            data2: result2,
          });
        });
      if (err) {
        console.log(err);
      }
    }
  );
});

/*my page */

app.get("/mypage/ask", function (req, res) {
  res.render("mypage/askTheHealthiest.ejs");
});

app.post("/add", function (req, res) {
  // console.log("전송완료");
  // console.log(res.body);
  db.collection("User").insertOne({
    user_id: req.body.id,
    pwd: req.body.pwd,
    name: req.body.name,
    birth: req.body.birthday,
    nickname: req.body.nickname,
    email: req.body.email,
    agree: req.body.check_info,
  });
});

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

app.use(
  session({ secret: "비밀코드", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {
    res.redirect("/main");
  }
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pwd",
      session: true,
      passReqToCallback: false,
    },
    function (input_id, input_pwd, done) {
      // console.log(input_id, input_pwd);
      db.collection("User").findOne(
        { user_id: input_id },
        function (err, result) {
          console.log(result);
          if (err) return done(err);
          if (!result) {
            return done(null, false, {
              message: "존재하지 않는 아이디입니다.",
            });
          }
          if (input_pwd == result.pwd) {
            user_idplz = result.user_id;
            return done(null, result);
          } else {
            return done(null, false, { message: "비밀번호가 틀렸습니다." });
          }
        }
      );
    }
  )
);

//민선 section

//세션만들기 로그인 성공시 발동
passport.serializeUser(function (user, done) {
  done(null, user.user_id);
});

//이 세션 데이터를 가진 사람을 DB에서 찾아주세요 (마이페이지 접속시 발동)
passport.deserializeUser(function (id, done) {
  db.collection("User").findOne({ user_id: id }, function (err, result) {
    done(null, result);
  });
});

// 마이페이지 닉네임 불러와야하는 페이지들

function 로그인했니(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send("로그인 안했음");
  }
}

app.get("/mypage", 로그인했니, function (req, res) {
  // console.log(req.user);
  res.render("mypage/mypage.ejs", { user_id: req.user.user_id });
});

app.get("/mypage/bodytype", 로그인했니, function (req, res) {
  // console.log(req.user);
  res.render("mypage/bodytype.ejs", { user_id: req.user.user_id });
});

app.get("/mypage/challengeExsisted", 로그인했니, function (req, res) {
  // console.log(req.user);
  res.render("mypage/challengeExsisted.ejs", { user_id: req.user.user_id });
});

app.get("/mypage/challengeNone", 로그인했니, function (req, res) {
  // console.log(req.user);
  res.render("mypage/challengeNone.ejs", { user_id: req.user.user_id });
});

app.get("/mypage/mywriting", 로그인했니, function (req, res) {
  // console.log(req.user);
  res.render("mypage/mywriting.ejs", { user_id: req.user.user_id });
});

app.get("/mypage/revisingwriting", 로그인했니, function (req, res) {
  // console.log(req.user);
  res.render("mypage/revisingwriting.ejs", { user_id: req.user.user_id });
});
app.get("/mypage/settingAccount", 로그인했니, function (req, res) {
  // console.log(req.user);
  res.render("mypage/setting.ejs", { user_id: req.user.user_id });
});
app.get("/mypage/settingCommunity", 로그인했니, function (req, res) {
  // console.log(req.user);
  res.render("mypage/setting2.ejs", { user_id: req.user.user_id });
});
app.get("/mypage/symptom", 로그인했니, function (req, res) {
  // console.log(req.user);
  res.render("mypage/symptom.ejs", { user_id: req.user.user_id });
});
app.get("/mypage/mail", 로그인했니, function (req, res) {
  // console.log(req.user);
  res.render("mypage/mail.ejs", { user_id: req.user.user_id });
});

//쪽지 보내기
app.post("/addmail", function (req, res) {
  db.collection("CounterForMail").findOne(
    { name: "메일갯수" },
    function (err, result) {
      var totalMail = result.totalMail;
      var dataMail = {
        sender: req.user.user_id,
        mail_id: totalMail + 1,
        reciever: req.body.reciever,
        send_time: new Date() + 3600000 * 9,
        title: req.body.title,
        file: req.body.file,
        content: req.body.content,
      };

      db.collection("Mail").insertOne(dataMail, function (err, result) {
        db.collection("CounterForMail").updateOne(
          { name: "메일갯수" },
          { $inc: { totalMail: 1 } },
          function (err, result) {
            if (err) {
              // console.log(err);
            }
            res.redirect("/mypage/mailbox");
          }
        );
      });
    }
  );
});

//쪽지함에 쪽지 불러오기

app.get("/mypage/mailbox", function (req, res) {
  // console.log(req.user.user_id);
  db.collection("Mail")
    .find()
    .toArray(function (err, result) {
      res.render("mypage/mailbox.ejs", {
        mail: result,
        user_id: req.user.user_id,
      });
    });
});

//쪽지 (디테일) 불러오기

app.get("/mypage/checkmail/:id", function (req, res) {
  db.collection("Mail").findOne(
    { mail_id: parseInt(req.params.id) },
    function (err, result) {
      if (err) {
        console.log(err);
      }
      // console.log(result);
      res.render("mypage/checkmail.ejs", { mail: result });
    }
  );
});

//정인

passport.deserializeUser(function (nickname, done) {
  db.collection("User").findOne({ nickname: nickname }, function (err, result) {
    done(null, result);
  });
});

/* Post & Comment */

//글쓰기(add)
app.post("/addPost", function (req, res) {
  db.collection("Counter").findOne(
    { name: "게시물개수" },
    function (err, result) {
      var totalPost = result.totalPost;
      var dataPost = {
        title: req.body.title,
        content: req.body.content,
        post_id: totalPost + 1,
        created_at: new Date() + 3600000 * 9,
        updated_at: new Date() + 3600000 * 9,
        category: req.body.category,
        subcategory: req.body.subcategory,
        categoryname: req.body.categoryname,
        file: req.body.이미지,
        nickname: req.user.nickname,
        likeCount: 0,
      };
      db.collection("Post").insertOne(dataPost, function (에러, 결과) {
        //post라는 collection에 insertOne
        //counter collection의 totalPost도 1 증가시키기
        //updateOne(어떤 데이터를 수정할지, 수정값(operator: ~), function())
        db.collection("Counter").updateOne(
          { name: "게시물개수" },
          { $inc: { totalPost: 1 } },
          function (err, result) {
            if (err) {
              console.log(err);
            }
            // console.log(req.user);
            res.redirect("community/" + req.body.category);
          }
        );
      });
    }
  );
});

//댓글쓰기
app.post("/addComment", function (req, res) {
  db.collection("Counter").findOne({ name: "댓글수" }, function (err, result) {
    var totalComment = result.totalComment;
    var dataPost = {
      content: req.body.content,
      comment_id: totalComment + 1,
      created_at: new Date() + 3600000 * 9,
      updated_at: new Date() + 3600000 * 9,
      post_id: req.body.post_id,
      nickname: req.user.nickname,
    };
    db.collection("Comment").insertOne(dataPost, function (에러, 결과) {
      //post라는 collection에 insertOne
      //counter collection의 totalPost도 1 증가시키기
      //updateOne(어떤 데이터를 수정할지, 수정값(operator: ~), function())
      db.collection("Counter").updateOne(
        { name: "댓글수" },
        { $inc: { totalComment: 1 } },
        function (err, result) {
          if (err) {
            console.log(err);
          }
          res.redirect("community/detail/" + parseInt(req.body.post_id));
        }
      );
    });
  });
});

//이미지 업로드
app.post("/upload", upload.single("이미지"), function (req, res) {
  res.send("업로드완료");
});

//댓글 지우기
app.delete("/deleteComment", function (req, res) {
  req.body.comment_id = parseInt(req.body.comment_id);
  // console.log(req.body);

  var 삭제할데이터 = {
    comment_id: req.body.comment_id,
    nickname: req.user.nickname,
  };

  db.collection("Comment").deleteOne(삭제할데이터, function (err, result) {
    //Comment collection에 있는 것을 delete. req.body에는 ajax요청으로 data: {comment_id : ~} 정보가 담겨옴
    if (err) {
      console.log(err);
    }
  });
  res.send("삭제 완료");
});

app.post("/index/:id", function (req, res) {
  TestData.findById(req.params.id, function (err, theUser) {
    if (err) {
      console.log(err);
    } else {
      theUser.likes += 1;
      theUser.save();
      console.log(theUser.likes);
      res.send({ likeCount: theUser.likes }); //something like this...
    }
  });
});

//like

//post, user, liked(?)를 불러온다
//if not liked
//Liked.objects.create(user=request.user, post = post)  //liked가 없으면 Liked(model)에 user와 post 정보를 담은 object 생성
//post.likeCount += 1
//save

//else
//liked = Liked.objects.get(user=req.user, post=post)  //post와 user에 대한 정보를 담은 정보를 get으로 받아옴
//post.likeCount -= 1
//save
//liked delete(지워야 다시 create 가능하니까)

app.delete("/:id/likePost", async (req, res, next) => {
  db.collection("Counter").findOne(
    { name: "글공감수" },
    function (err, result) {}
  );
});

// 호

app.get("/challenge/introduce", function (req, res) {
  res.sendFile(__dirname + "/views/challenge/challenge-introduce.html");
});

app.get("/challenge/certification", function (req, res) {
  res.sendFile(__dirname + "/views/challenge/challenge-certification.html");
});

app.get("/challenge/payment", function (req, res) {
  //console.log(req.user.user_id);
  res.sendFile(__dirname + "/views/challenge/challenge-payment.html");
});

app.post("/pay", function (req, res) {
  console.log("집어넣기 도전");
  db.collection("Challenge").insertOne({
    user_id: req.user.user_id,
    stamp_count: 0,
    image_upload: false,
    certification: "yet",
  });
  console.log("집어넣기 성공");
});

app.get("/challenge/stamp", function (req, res) {
  console.log(req.user.user_id);
  db.collection("Challenge").findOne(
    { user_id: req.user.user_id },
    function (err, result) {
      res.render("challenge/challenge_stamp.ejs", {
        count: result.stamp_count,
        certification: result.certification,
        img_upload: result.image_upload,
      });
    }
  );
});

const { Db } = require("mongodb");
var date;
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploadImage");
  },
  filename: function (req, file, cb) {
    date = new Date().getDate();
    cb(null, date + ".jpg");
  },
});

var upload = multer({ storage: storage });

app.post(
  "/challenge/certification",
  upload.single("imageInput"),
  function (req, res) {
    res.sendFile(__dirname + "/views/challenge/challenge-payment.html");
  }
);
