//  npm install express 
//  npm install request-ip  접속자의 ip를 구하는 모듈
//  npm install mysql2      DB연동 모듈
//  npm install ejs         ejs모듈


var http = require("http");
var express = require("express");
var fs = require("fs");
var ejs = require("ejs");
var requestip = require('request-ip');

//서버생성
var app = express();
var server = http.createServer(app);

//--------POST방식 접속시 데이터 request를 위한 설정----------
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));  // 한글인코딩 설정

//-------------------Mysql Connection----------------------
let mysqldb = require("mysql2");
const { Console } = require("console");
//mysqldb.autoCommit(true);   //자동커밋

//DB연결
let connection = mysqldb.createConnection({
    host : '127.0.0.1',
    port : 3306, 
    user : 'root',
    password : 'root',
    database : 'campusdb'
});
connection.connect();
//------------------------------------------------------------

//get(), post()을 이용해서 접속을 처리할 수 있다
//홈페이지로 이동하기 : http://127.0.0.1:10010/index
//get방식 접속
app.get('/index', function(request, response){
    fs.readFile(__dirname+'/index.html', 'utf-8', function(error, indexData){
        response.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
        response.end(indexData);
    });
});
//게시판 리스트
app.get('/list', function(request, response){
    let sql = "select userid, no, subject, hit, date_format(writedate, '%m-%d %H:%i')writedate ";
    sql += "from board order by no desc";
    
    //쿼리문 실행     쿼리문, 콜백함수
    connection.execute(sql, function(error, result){
        //선택한 레코드 수
        var totalRecord = result.length;
        console.log(result);
        console.log(__dirname);
        if(result.length>0){//선택한 레코드가 있으면 list페이지로 보내기
            fs.readFile(__dirname+'/list.ejs','utf-8', function(error, data){
                response.writeHead(200, {"Content-Type":"text/html; charset=utf-8 "});
                response.end(ejs.render(data,{
                        results : result,
                        parsing :{
                            totalRecord : totalRecord,
                            nowPage : 3,
                            startPage : 1,
                            onePageRecord : 5
                        } 
                    })
                );
            });
        }
    });
});
//글쓰기폼
app.get('/write',(req,res)=>{
    fs.readFile(__dirname+'/write.html','utf-8',function(error,data){
        if(!error){
            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
            res.end(data);
        }
    });
});
//글쓰기 DB등록
app.post('/writeOk',(req,res)=>{
    var userid = req.body.userid;
    var subject = req.body.subject;
    var content = req.body.content;

    var ip = requestip.getClientIp(req).substring(7); // 접속자 ip 구하기    ::ffff:127.0.0.1

    var sql = "insert into board(userid, subject, content, ip) values(?,?,?,?)";
    var bindData = [userid, subject, content, ip];
    //                (쿼리문, 데이터배열)
    connection.execute(sql, bindData, function(error, result){
        console.log(result);
        if(error || result.affectedRows/* 처리한 레코드수*/< 1){   //글쓰기 실패 시
            res.redirect('/write');
        }else{  //글쓰기 성공 시
            res.redirect('/list');
        }
    });
});
//글내용보기
app.get('/view',(req,res)=>{
    //get방식 접속 데이터
    let url = req.url;  //  /view?no=11
    let params = url.substring(url.indexOf('?')+1); //물음표 다음자리부터 끝까지
    let noObj = new URLSearchParams(params);   //params로 객체 만들기
    var bindData = [noObj.get("no")];
    //조회수 증가
    var sql = "update board set hit=hit+1 where no=?";
    connection.execute(sql, bindData, (e,r)=>{
        console.log(r);
    });
    //글선택
    sql = "select no, userid, subject, content, hit, writedate from board where no=?";
    connection.execute(sql, bindData, (e,r)=>{
        if(e){
            console.log(e);
            res.redirect("/list");
        }else{
            console.log(r);
            fs.readFile(__dirname+'/view.ejs','utf-8',(error,tag)=>{
                res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
                res.end(
                    ejs.render(tag, {result:r})
                );
            });
        }
    })
});
//글수정
app.get('/edit',(req,res)=>{
    var params = new URLSearchParams(req.url.substring(req.url.indexOf('?')+1));

    var sql = "select subject, content, no from board where no=?";

    connection.execute(sql,[params.get('no')],(error,records)=>{
        if(error){
            res.redirect('/view?no='+params.get('no'));
        }else{
            fs.readFile(__dirname+'/edit.ejs', 'utf-8', (e,tag)=>{
                res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
                res.end(ejs.render(tag, {record:records}));
            });
        }
    });
});
//글수정DB
app.post('/editOk',(req,res)=>{
    var no = req.body.no;
    var subject = req.body.subject;
    var content = req.body.content;

    var sql = "update board set subject=?, content=? where no=?";
    var bindData = [subject, content, no];

    connection.execute(sql,bindData, (error, result)=>{
        console.log(result);
        if(error || result.changedRows<1){  // 수정안됨 // affectedRows아님
            res.redirect("/edit?no="+no);
        }else{  //수정됨
            res.redirect("/view?no="+no);
        }
    })
});
//삭제
app.get('/del', (req,res)=>{
    var params = new URLSearchParams(req.url.substring(req.url.indexOf('?')+1));

    var sql = "delete from board where no=?";

    connection.execute(sql,[params.get('no')], function(error,result){
        console.log(result);
        console.log(params);
        if(error){//삭제 실패
            res.redirect('/view?no='+params.get('no'));
        }else{  //삭제 성공
            res.redirect('/list');
        }
    })
});

server.listen(10010, function(){
    console.log("start server .... http://127.0.0.1:10010/index");
});
