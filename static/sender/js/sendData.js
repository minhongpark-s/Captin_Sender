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

  var listener = new ROSLIB.Topic({
    ros : ros,
    name : '/test/topic',
    messageType : 'std_msgs/Int16'
  });
  
  listener.subscribe(function(message) {
    console.log('Received message on ' + listener.name + ': ' + message.data);
    //listener.unsubscribe(); // unsubcribe topic node.
    return_data = message.data;
    /*if not using ajax, then use below code.
    createForm("updateDatabase",'GET','x',data,'y',data);
    */

    /* for receiving side
    setTimeout(request_ajax(return_data, return_data),100);
    */

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
    },
    method: "POST",
    dataType: "JSON" // 서버에 전송할 파일 형식
  }).done((json) => {
    console.log(json);
  })
}