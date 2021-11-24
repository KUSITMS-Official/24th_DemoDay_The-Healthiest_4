const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var db;
const MongoClient = require('mongodb').MongoClient;
app.use(express.urlencoded({ extended: true }));

MongoClient.connect('mongodb+srv://admin:health123@cluster0.g6wfe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(err, client) {
    if (err) {
        return console.log(err)
    }
    db = client.db('The_Healthiest');

    //ejs 설치
    app.set('view engine', 'ejs');

    //연결 성공시
    app.listen(8080, function () {
        console.log('listening on 8080');
    });

    //글쓰기(add)
    app.post('/add', function (req, res) {
        db.collection('Counter').findOne({ name:'게시물개수'}, function (err, result) {
            var totalPost = result.totalPost;   
            db.collection('Post').insertOne({ title: req.body.title, content: req.body.content, post_id: totalPost + 1, created_at: new Date()+(3600000*9), updated_at: new Date()+(3600000*9), }, function (에러, 결과) { //post라는 collection에 insertOne
                //counter collection의 totalPost도 1 증가시키기
                //updateOne(어떤 데이터를 수정할지, 수정값(operator: ~), function())
                db.collection('Counter').updateOne({ name: '게시물개수' }, { $inc: { totalPost: 1 } }, function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    res.send("제목: " + req.body.title + "\n내용: " + req.body.content + "\n저장 완료"); //render든 redirect든 바꾸어야 함

                })
            });
        });;
    });

});


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
        res.render('community/comm_free.ejs', { posts : result })
      })
});

app.get('/community/bodytype', function (req, res) {
    res.render('community/comm_body.ejs');
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

app.get('/community/write', function(req, res){
    res.render('community/comm_write.ejs');
})


app.get('/community/detail/:id', function (req, res) {
    db.collection('Post').findOne({ post_id: parseInt(req.params.id) }, function (err, result) {
        if (err) {
            console.log(err)
        }
        res.render('community/detail.ejs', { posts : result })
    })
})

app.get('/community/detail', function (req, res) {
    res.render('community/comm_detail.ejs');
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

app.get('/mypage', function (req, res) {
    res.render('mypage/mypage.ejs');
});

app.get('/mypage/ask', function (req, res) {
    res.render('mypage/askTheHealthiest.ejs');
});

app.get('/mypage/bodytype', function (req, res) {
    res.render('mypage/bodytype.ejs');
});

app.get('/mypage/challengeExsisted', function (req, res) {
    res.render('mypage/challengeExsisted.ejs');
});

app.get('/mypage/challengeNone', function (req, res) {
    res.render('mypage/challengeNone.ejs');
});

app.get('/mypage/mail', function (req, res) {
    res.render('mypage/mail.ejs');
});

app.get('/mypage/mailbox', function (req, res) {
    res.render('mypage/mailbox.ejs');
});

app.get('/mypage/mywriting', function (req, res) {
    res.render('mypage/mywriting.ejs');
});

app.get('/mypage/revisingwriting', function (req, res) {
    res.render('mypage/revisingwriting.ejs');
});
app.get('/mypage/settingAccount', function (req, res) {
    res.render('mypage/setting.ejs');
});
app.get('/mypage/settingCommunity', function (req, res) {
    res.render('mypage/setting2.ejs');
});
app.get('/mypage/symptom', function (req, res) {
    res.render('mypage/symptom.ejs');
});