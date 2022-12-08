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


  // service server에 대한 정보를 등록
  var statusClient = new ROSLIB.Service({
    ros : ros,
    name : '/req_box',
    serviceType : 'std_msgs/string'
  });
  // listenser가 들을 publisher의 정보 등록
  var listener = new ROSLIB.Topic({
    ros : ros,
    name : '/test/topic',
    messageType : 'std_msgs/Int16'
  });
  // listener가 subscribe하면 다음 코드 실행
  listener.subscribe(function(message) {
    // ros topic loading ready signal
    // 로봇이 배송 위치에 도착하면
    if (message.data == 2){
        console.log("robot 'Moving' to 'Loading Ready'.")
        setTimeout(changeMovingToLoadingReady(),100);
    }
    // ros topic ending signal
    // 적재완료됬다는 신호를 로봇이 보내주면
    else if(message.data == 3){
        console.log("robot 'Loaded' to 'MovingToGoal'")
        // 보내려는 service request의 정보를 등록
        var bool = new ROSLIB.ServiceRequest({
            position : "LoadComplete",
            method : "1",
        });
        // service 요청을 보냄
        statusClient.callService(bool, function(result) {
            console.log('Result for service call on '
            + statusClient.name
            + ': '
            + result.status);
            console.log('done')
            if(result.status == "ok"){
                console.log("ros service response 'ok'")
                changeLoadedToMovingToGoal()
            }
            else if(result.status == "failed"){
                console.log("ros service response 'failed'")
            }
        });
    }
  });


  function changeMovingToLoadingReady(){
    $.ajax({
        url: 'http://3.38.25.123/dashboard/changeMovingToLoadingReady/',
        method: "GET",
        data: {
            'requestTime' : DN,
        },
        dataType: "JSON" // 서버에 전송할 파일 형식
    }).done((json) => {
        console.log(json.response1[0].status)
    });
  }

  function changeLoadedToMovingToGoal(){
    $.ajax({
        url: 'http://3.38.25.123/dashboard/changeLoadedToMovingToGoal/',
        method: "GET",
        data: {
            'requestTime' : DN,
        },
        dataType: "JSON" // 서버에 전송할 파일 형식
    }).done((json) => {
        console.log(json.response1[0].status)
    });
  }