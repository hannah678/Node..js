var http = require('http');
var fs = require('fs');

//모듈 추가하는 방법: mime
//npm 명령어를 이용하여 추가
// >npm install mime@2
var mime = require('Mime');

var server = http.createServer(function(req,res){
    var addr = req.url;
    console.log(addr);

    if(addr=='/home'){
        //home.html파일의 내용을 읽어 response에 쓰기를 한다.
        fs.readFile(__dirname+'/home.html','utf-8',function(e,data){
            if(e){  //파일읽기 에러
                console.log('파일읽기 실패...home.html');
            }else{  //파일 읽기 성공
                res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
                res.end(data);
            }
        });
    }else if(addr=='/subpage'){
        fs.readFile(__dirname+"/subpage.html", 'utf-8', function(error, data){
            if(!error){
                res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                res.end(data);
            }
        });
    }else if(addr.indexOf('/img')==0){ //이미지일 경우
        //  /img/07.jpg

        //마임 구하기
        var mimeType = mime.getType(addr.substring(1)); //(0)번째인 /는 빼고 끝까지
        console.log(mimeType);

        fs.readFile(__dirname+addr, function(error, imgData){
            if(!error){
                res.writeHead(200, {'Content-Type':mimeType});
                res.end(imgData);
            }
        })
    }
});

server.listen(10007, function(){
    console.log('server start... http://127.0.0.1:10007/home');
});