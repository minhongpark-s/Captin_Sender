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
    name : '/test/topic',
    messageType : 'std_msgs/Int16'
  });
  // listener가 subscribe하면 다음 코드 실행
  listener.subscribe(function(message) {
    if (message.data == 2){
        console.log("robot moving end.")
        setTimeout(changeMovingToEnd(),100);
    }  
    else{
        console.log("robot still moving")
    }
  });