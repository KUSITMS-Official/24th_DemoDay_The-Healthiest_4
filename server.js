const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
const router = express.Router();


//DB연결
var db;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://admin:health1234@cluster0.g6wfe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(err, client){
    if (err) return console.log(err)

    db = client.db('The_Healthiest');


    app.listen(8080, function(){
        console.log('listening on 8080');
    });

const mongoose = require('mongoose');
module.exports = () => {
  function connect() {
    mongoose.connect('localhost:8080', function(err) {
      if (err) {
        console.error('mongodb connection error', err);
      }
      console.log('mongodb connected');
    });
  }
  connect();
  mongoose.connection.on('disconnected', connect);
  require('mypage/mailbox'); 
};
    
    //글쓰기(add)
    app.post('/addPost', function (req, res) {
        db.collection('Counter').findOne({ name:'게시물개수'}, function (err, result) {
            var totalPost = result.totalPost;   
            var dataPost = { title: req.body.title, content: req.body.content, post_id: totalPost + 1,
                created_at: new Date()+(3600000*9), updated_at: new Date()+(3600000*9), category: req.body.category, subcategory: req.body.subcategory,
                user_id: req.user.user_id
            }
            db.collection('Post').insertOne(dataPost, function (에러, 결과) { //post라는 collection에 insertOne
                //counter collection의 totalPost도 1 증가시키기
                //updateOne(어떤 데이터를 수정할지, 수정값(operator: ~), function())
                db.collection('Counter').updateOne({ name: '게시물개수' }, { $inc: { totalPost: 1 } }, function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    res.redirect("community/" + req.body.category) //render든 redirect든 바꾸어야 함
                })
            });
        });;
    });
});


var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


/* page rendering */

app.get('/', function(req, res){
    res.sendFile(__dirname+'/views/main/main_before_login.html');
});

app.get('/main', function(req, res){
    res.sendFile(__dirname+'/views/main/main_after_login.html');
});

app.get('/login', function(req, res){
    res.sendFile(__dirname+'/views/main/login.html');
});

app.get('/join', function(req,  res){
    res.sendFile(__dirname+'/views/main/join.html');
});

app.get('/info', function(req, res){
    res.sendFile(__dirname+'/views/main/info_before_login.html');
});

app.get('/health', function(req, res){
    res.sendFile(__dirname+'/views/main/health_before_login.html');
});

app.get('/community_main', function(req, res){
    res.sendFile(__dirname+'/views/main/communitymain_before_login.html');
});

app.get('/challenge_main', function(req, res){
    res.sendFile(__dirname+'/views/main/challengemain_before_login.html');
});

app.get('/hometraining_main', function(req, res){
    res.sendFile(__dirname+'/views/main/hometraining_before_login.html');
});

app.get('/info2', function(req, res){
    res.sendFile(__dirname+'/views/main/info_after_login.html');
});

app.get('/health2', function(req, res){
    res.sendFile(__dirname+'/views/main/health_after_login.html');
});

app.get('/hometraining_main2', function(req, res){
    res.sendFile(__dirname+'/views/main/hometraining_after_login.html');
});


/* community */

app.get('/community', function (req, res) {
    res.render('community/comm_list.ejs');
});

app.get('/community/free', function (req, res) {
    db.collection('Post').find().toArray(function(error, result){
        console.log(result)
        res.render('community/comm_free.ejs', { posts : result})
      })
});

app.get('/community/bodytype', function (req, res) {
    db.collection('Post').find().toArray(function(error, result){
        console.log(result)
        //const { page = 1, limit = 10} = req.query;
        res.render('community/comm_body.ejs', { posts : result})
      });
});

app.get('/community/crew', function (req, res) {
    res.render('community/comm_crew.ejs');
});

app.get('/community/tips', function (req, res) {
    res.render('community/comm_tips.ejs');
});

app.get('/community/meal', function (req, res) {
    res.render('community/comm_meal.ejs');
});

app.get('/community/grouporder', function (req, res) {
    res.render('community/comm_go.ejs');
});

/* community write pages */

app.get('/community/free/write', function(req, res){
    res.render('community/comm_write_free.ejs');
});

app.get('/community/grouporder/write', function(req, res){
    res.render('community/comm_write_go.ejs');
});

app.get('/community/meal/write', function(req, res){
    res.render('community/comm_write_meal.ejs');
});

app.get('/community/crew/write', function(req, res){
    res.render('community/comm_write_crew.ejs');
});


app.get('/community/bodytype/write', function(req, res){
    res.render('community/comm_write_body.ejs');
});


app.get('/community/tips/write', function(req, res){
    res.render('community/comm_write_tips.ejs');
});

app.get('/community/detail/:id', function (req, res) {
    db.collection('Post').findOne({ post_id: parseInt(req.params.id) }, function (err, result) {
            if (err) {
                console.log(err)
            }
            console.log(result);
            res.render('community/comm_detail.ejs', { data: result });
    });
})

/* challenge */

app.get("/challenge/introduce", function (req, res) {
    res.sendFile(__dirname+"/views/challenge/challenge-introduce.html");
});

app.get("/challenge/certification", function (req, res) {
    res.sendFile(__dirname+"/views/challenge/challenge-certification.html");
});

app.get("/challenge/payment", function (req, res) {
    res.sendFile(__dirname+"/views/challenge/challenge-payment.html");
});

app.get("/challenge/stamp", function (req, res) {
    res.sendFile(__dirname+"/views/challenge/challenge-stamp.html");
});

/*my page */ 


app.get('/mypage/ask', function (req, res) {
    res.render('mypage/askTheHealthiest.ejs');
});




app.post('/add', function(req, res){
    console.log('전송완료');
    console.log(req.body);
    db.collection('User').insertOne({user_id: req.body.id, 
        pwd: req.body.pwd, name: req.body.name, birth: req.body.birthday, 
        nickname: req.body.nickname, email: req.body.email, agree: req.body.check_info});
})

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 

app.post('/login', passport.authenticate('local', {
    failureRedirect : '/login'
}), function(req, res){
    res.redirect('/main');
});


passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pwd',
    session: true,
    passReqToCallback: false,
}, function(input_id, input_pwd, done){
    console.log(input_id, input_pwd);
    db.collection('User').findOne({user_id: input_id}, function(err, result){
        console.log(result);
        if (err) return done(err);
        if (!result) {
            console.log(5)
            return done(null, false, {message : '존재하지 않는 아이디입니다.'})
        }
        if (input_pwd == result.pwd){
            user_idplz = result.user_id;
            return done(null, result)
        } else {
            return done(null, false, {message:'비밀번호가 틀렸습니다.'})
        }
    })
}));

//민선 section

//세션만들기 로그인 성공시 발동
passport.serializeUser(function(user, done){
    done(null, user.user_id)
});

//이 세션 데이터를 가진 사람을 DB에서 찾아주세요 (마이페이지 접속시 발동)
passport.deserializeUser(function(id, done){
    db.collection('User').findOne({user_id : id}, function(err,result) {
      done(null, result)
    })
});



// 마이페이지 닉네임 불러와야하는 페이지들 

function 로그인했니(req, res, next){
    if (req.user){
        next()
    } else {
        res.send('로그인 안했음')
    }
}

app.get('/mypage', 로그인했니, function(req,res){
        console.log(req.user);
        res.render('mypage/mypage.ejs', {user_id : req.user.user_id});   
});

app.get('/mypage/bodytype', 로그인했니, function (req, res) {
    console.log(req.user);
    res.render('mypage/bodytype.ejs', {user_id : req.user.user_id});
});

app.get('/mypage/challengeExsisted', 로그인했니, function (req, res) {
    console.log(req.user);
    res.render('mypage/challengeExsisted.ejs', {user_id : req.user.user_id});
});

app.get('/mypage/challengeNone', 로그인했니, function (req, res) {
    console.log(req.user);
    res.render('mypage/challengeNone.ejs', {user_id : req.user.user_id});
});


app.get('/mypage/mywriting', 로그인했니, function (req, res) {
    console.log(req.user);
    res.render('mypage/mywriting.ejs', {user_id : req.user.user_id});
});

app.get('/mypage/revisingwriting', 로그인했니, function (req, res) {
    console.log(req.user);
    res.render('mypage/revisingwriting.ejs', {user_id : req.user.user_id});
});
app.get('/mypage/settingAccount', 로그인했니, function (req, res) {
    console.log(req.user);
    res.render('mypage/setting.ejs', {user_id : req.user.user_id});
});
app.get('/mypage/settingCommunity', 로그인했니, function (req, res) {
    console.log(req.user);
    res.render('mypage/setting2.ejs', {user_id : req.user.user_id});
});
app.get('/mypage/symptom', 로그인했니, function (req, res) {
    console.log(req.user);
    res.render('mypage/symptom.ejs', {user_id : req.user.user_id});
});
app.get('/mypage/mail', 로그인했니, function (req, res) {
    console.log(req.user)
    res.render('mypage/mail.ejs', {user_id : req.user.user_id});
});


//쪽지 보내기
app.post('/addmail', function(req, res){
    console.log('메세지 전송');
    db.collection('Mail').insertOne({
        sender: req.user.user_id,
        reciever: req.body.reciever, 
        send_time: new Date()+(3600000*9),
        title: req.body.title,
        file: req.body.file, 
        content: req.body.content});
})



//쪽지함에 쪽지 불러오기 

app.get('/mypage/mailbox', function (req, res) {
    console.log(req.user.user_id)
    db.collection('Mail').find().toArray(function (err, result){
        console.log(result)
        res.render('mypage/mailbox.ejs', { mail: result, user_id : req.user.user_id})
    })
    
});



//쪽지 불러오기 

app.get('/mypage/checkmail', function (req, res) {
    console.log(req.user.user_id)
    db.collection('Mail').find().toArray(function (err, result){
        console.log(result)
        res.render('mypage/checkmail.ejs', { mail: result, user_id : req.user.user_id})
    })
    
});


