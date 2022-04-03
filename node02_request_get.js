var http = require("http");

var server = http.createServer(function(request, response){
    console.log(request.url); //url객체 찍어보기 //결과: /?num=1234&name=%ED%99%8D%EA%B8%B8%EB%8F%99&tel=010-1234-5678

    //get방식: request 에서 서버로 전송받은 파라미터의 값을 얻기 위해서는 URLSearchParams() 객체를 생성해야한다.
    //substring(0):/, (1):?
    var params = new URLSearchParams(request.url.substring(2));
    console.log(params);

    response.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    response.write("<p>번호=" + params.get("num") + "<br/>");
    response.write("이름=" + params.get("name") + "<br/>");
    response.write("연락처=" + params.get("tel") + "</p>");

    response.write("<form method='post' action='http://127.0.0.1:10002'>");
    response.write("아이디 <input type='text' name='userid'/><br/>");
    response.write("비밀번호 <input type='password' name='userpwd'/><br/>");
    response.write("이름 <input type='text' name='username'/><br/>");
    response.write("<input type='submit' value='post방식전송'/><br/>");
    response.end("</form>");
});

//접속대기
server.listen(10001, function(){
    console.log('server start... http://127.0.0.1:10001/?num=1234&name=홍길동&tel=010-1234-5678');
});