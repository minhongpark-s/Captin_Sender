const date = new Date();
var ros = new ROSLIB.Ros();

// rosbridge websocket server와의 연결을 생성합니다.
ros.connect('ws://0.0.0.0:9090');

  ros.on('connection', function() {
    console.log('Connected to websocket server.');
    document.getElementById('header').style.backgroundColor = "#07a666";
  });

  ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
  });

  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
  });

  // listenser가 들을 publisher의 정보 등록
  var listener = new ROSLIB.Topic({
    ros : ros,
    name : '/amcl_pose',
    messageType : 'geometry_msgs/PoseWithCovarianceStamped'
    //messageType : 'geometry_msgs/Point'
  });
  // listener가 subscribe하면 다음 코드 실행
  listener.subscribe(function(message) {
    scaledX = Math.ceil(message.pose.pose.position.x)
    scaledY = Math.ceil(message.pose.pose.position.y)
    console.log('Received data on ' + listener.name)
    //console.log('Received data on ' + listener.name + ': ' +(message.pose.pose.position.x.toFixed(1)) + ',' + (message.pose.pose.position.y.toFixed(1)));
    //listener.unsubscribe(); // unsubcribe topic node.
    return_data_x = message.pose.pose.position.x.toFixed(1);
    return_data_y = message.pose.pose.position.y.toFixed(1);
    //console.log(message)
    console.log("raw data x: " + message.pose.pose.position.x)
    console.log("raw data y: " + message.pose.pose.position.y)
    /*if not using ajax, then use below code.
    createForm("updateDatabase",'GET','x',data,'y',data);
    */

    /* for receiving side
    setTimeout(request_ajax(return_data, return_data),100);
    */

    //서버로 데이터를 전송함.
    setTimeout(sendDataToServer('http://3.38.25.123/dashboard/dataconnection', return_data, return_data),100);
  });

/*
function request_ajax(return_data_x, return_data_y){
    $.ajax({
        url: '/sender/updateDatabase/',
        type: "POST",
        dataType: "JSON",
        data: {'x': return_data_x,'y' : return_data_y},
        success: function(data){
            console.log(data);
        },beforeSend:function(){
            console.log("i am waiting");
        },complete:function(){
            console.log("i am done");
        },error: function (request, status, error) {
            console.log('i am failed');
        }
            });
}
*/

function sendDataToServer(url_full, return_data_x, return_data_y){
  $.ajax({
    //url: 'http://3.38.25.123/dashboard/dataconnection',
    url : url_full,
    data: {
      'x': return_data_x,
      'y': return_data_y,
      //x : "return_data_x",
      //y : "return_data_y",
      //csrfmiddlewaretoken: '{{ csrf_token }}',
    },
    method: "POST",
    dataType: "JSON" // 서버에 전송할 파일 형식
  }).done((json) => {
    console.log(json);
  })
}


function checkDelDataChange(url_){
  $.ajax({
    type: 'POST',
    url: url,
    data: "worktype=1&" + param,
    async: false,
    success: function(data) {
        if(data != null) {
              checkDelDataChange(url_)
        }
    }
});
}

function sendRequestToServer(url_full){
  $.ajax({
    //url: 'http://3.38.25.123/dashboard/dataconnection',
    url : url_full,
    method: "GET",
    dataType: "JSON" // 서버에 전송할 파일 형식
  }).done((json) => {
    //Json response data extract
    //console.log(json);
    //console.log(json.response1);
    console.log("response status is '" + json.response1[0].status + "'");
    console.log("response time is '" + json.response1[0].nowTime + "'");
    console.log("request position is '" + json.response1[0].Position + "'");
    console.log("request method is '" + json.response1[0].Method + "'");

    if (json.response1[0].status == "found request"){
      console.log("ok")
    }
    else if(json.response1[0].status == "no request"){
      console.log("no");
      //sendRequestToServer('http://3.38.25.123/dashboard/checkDeliveryRequest/');
      //repeatVia();
    }     
  });
  //repeatVia();
}

function repeatVia(request){
  setTimeout(sendRequestToServer('http://3.38.25.123/dashboard/checkDeliveryRequest/'),1000)
}
