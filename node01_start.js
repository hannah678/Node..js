/*
    nodejs: 이벤트 기반 서버 프레임워크이다.
    모듈을 객체로 생성하여 사용할 수 있다.
*/

//1. 서버 생성하기: http모듈을 이용하여 server를 생성한다.
// http모듈을 객체로 생성하기
var http = require('http'); //대입할 변수 객체 생성

//createServer(): http 객체를 이용하여 서버 만들기
var server = http.createServer(function(request, response){//왼쪽 request, 오른쪽 response 지정(약어가능req, res)
    //접속자에게 응답하기

    //헤더 정보 보내기
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    //컨텐츠 보내기
    response.write("<h1>노드서버에서 보낸 컨텐츠</h1>");
    response.write("http모듈을 이용하여 객체를 생성 후 server를 생성함.")
    //종료 정보 보내기
    response.end("End...");
});

//접속대기 하다가 접속하면 위의 기능구현
//접속대기 함수(port, 콜백함수(){})
server.listen(10000, function(){
    console.log("server start...http://127.0.0.1:10000") //주소 클릭
});