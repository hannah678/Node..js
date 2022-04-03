var http  = require("http");
var fs = require("fs");
var mime = require("Mime");


var server = http.createServer(function(request, response){
    var mapping = request.url;
    //html문서 보내기
    if(mapping=='/'){
        fs.readFile(__dirname+'/movie_play.html', 'utf-8', function(error, htmlData){

        
        if(!error){
            response.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});
            response.end(htmlData);
        }
        });
    }else if(mapping.indexOf('/img')==0){//image문서 보내기 접속주소가 mapping에 /img/5.jpg로 들어옴
        mimeName = mime.getType(mapping.substring(1));//mapping의 주소에서 첫번째부터 끝까지 잘라서 가져옴
        fs.readFile(__dirname + mapping, function(error, imgData){
            if(!error){
                response.writeHead(200, {"Content-Type":"mimeName"});
                response.end(imgData);
            }
        });
    }else if(mapping.indexOf('/movie')==0){//video 보내기
        //동영상은 파일이 크기 때문에 스트리밍처리로 전송한다.

        //1. 스트리밍 처리를 위한 객체를 생성한다.
        var stream = fs.createReadStream(mapping.substring(1));  //  mmovie/1.mp4
        var cnt= 1;

        //2. 스트리밍 처리를 하기 위해서 여러번 데이터를 전송해야 하며
        //이벤트를 이용하여 처리한다

        //데이터가 read된 경우 호출되는 이벤트
        //      이벤트 종류, 이벤트가 호출될 경우 실행할 함수
        stream.on('data', function(movieData){
            response.write(movieData);
            console.log(cnt++ + '번째 전송됨. 영상 데이터 크기 : '+movieData.length);
        });

        //데이터가 read의 마지막일때 호출되는 이벤트
        stream.on('end', function(){
            response.end();
            console.log("stream end....");
        });
        
        //데이터 read시 에러발생시 호출되는 이벤트
        stream.on('error', function(){
            response.end();
            console.log("error stream....");
        });
    }
}).listen(10008, function(){
    console.log("server start... http://127.0.0.1:10008");
});