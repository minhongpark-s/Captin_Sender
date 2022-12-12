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

// // service server에 대한 정보를 등록
// var statusClient = new ROSLIB.Service({
//     ros : ros,
//     name : '/req_box',
//     serviceType : 'std_msgs/string'
//   });
// service server에 대한 정보를 등록
var statusClient_ = new ROSLIB.Service({
    ros : ros,
    name : 'Appdata',
    serviceType : 'std_msgs/string'
});

var statusClient__ = new ROSLIB.Service({
  ros : ros,
  name : 'App_data',
  serviceType : 'std_msgs/string'
});

setTimeout(sendRequestToServer('http://3.38.25.123/dashboard/checkDeliveryRequest/'),10000);

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
      console.log("request position is '" + json.response1[0].position + "'");
      console.log("request method is '" + json.response1[0].method + "'");
      console.log(typeof(json.response1[0].position))
      if (json.response1[0].status == "found request"){
        // change data to String.
        pos = json.response1[0].position.toString();
        met = json.response1[0].method.toString();
        console.log(json.response1[0].nowTime)
        console.log(typeof(json.response1[0].nowTime))
        //console.log(pos)
        //console.log(typeof(pos))
  
        // 보내려는 service request의 정보를 등록
        var send = new ROSLIB.ServiceRequest({
            //position : pos,
            input1 : pos,
            input2 : met,
        });
        // service 요청을 보냄
        statusClient_.callService(send, function(result) {
            console.log('Result for service call on '
            + statusClient_.name
            + ': '
            + result.output);
            if(result.response == "ok"){
                console.log("ros service response 'ok'")
                setTimeout(changeFalseToMoving(json.response1[0].nowTime),1000);
                setTimeout(checkLoadedData(),1);
            }
            else if(result.response == "failed"){
                console.log("ros service response 'failed'")
                sendRequestToServer('http://3.38.25.123/dashboard/checkDeliveryRequest/')
            }
        })
      }
      else if(json.response1[0].status == "no request"){
        console.log("no");
        //sendRequestToServer('http://3.38.25.123/dashboard/checkDeliveryRequest/');
        //repeatVia();
        setTimeout(sendRequestToServer('http://3.38.25.123/dashboard/checkDeliveryRequest/'),10000);
      }
    });
}

function changeFalseToMoving(DN){
    $.ajax({
        url: 'http://3.38.25.123/dashboard/changeFalseToMoving/',
        method: "GET",
        data: {
            'requestTime' : DN,
          },
        dataType: "JSON" // 서버에 전송할 파일 형식
      }).done((json) => {
        console.log(json.response1[0].status)
        if (json.response1[0].status == "False changed to Moving"){
            console.log("False changed to Moving complete!")
        }
    });
}


// repeat until Loaded signal arrive.
function checkLoadedData(){
    console.log("on")
    $.ajax({
      url: 'http://3.38.25.123/dashboard/checkLoadedData/',
      method: "GET",
      dataType: "JSON" // 서버에 전송할 파일 형식
    }).done((json) => {
      //Json response data extract
      //console.log(json);
      //console.log(json.response1);
      console.log("response status is '" + json.response1[0].status + "'");
      console.log("response time is '" + json.response1[0].nowTime + "'");
      //console.log("request position is '" + json.response1[0].position + "'");
      //console.log("request method is '" + json.response1[0].method + "'");
      //console.log(typeof(json.response1[0].position))
      if (json.response1[0].status == "found Loaded Data"){
        // 보내려는 service request의 정보를 등록
        var send = new ROSLIB.ServiceRequest({
            //position : pos,
            input1 : "loaded",
            input2 : "loaded",
        });
        // service 요청을 보냄
        statusClient_.callService(send, function(result) {
            console.log('Result for service call on '
            + statusClient_.name
            + ': '
            + result.o);
            if(result.response == "loadOk"){
                console.log("ros service response 'ok'")
                changeLoadedToMovingToGoal()
                // 마지막 loaded 요청을 처리하면 다시 request를 대기하는 상태로 돌아간다.
                setTimeout(sendRequestToServer('http://3.38.25.123/dashboard/checkDeliveryRequest/'),1);
            }
            // service에서 성공을 반환할 때 까지 무한 반복
            // 즉 로봇이 데이터를 받아 처리했을 경우
            else if(result.response == "failed"){
                console.log("ros service response 'failed'")
                checkLoadedData()
            }
        })
      }
      else if(json.response1[0].status == "no Loaded Data"){
        console.log("no Loaded Data");
        setTimeout(checkLoadedData(),10000);
      }     
    });
}

function changeLoadedToMovingToGoal(){
    $.ajax({
        url: 'http://3.38.25.123/dashboard/changeLoadedToMovingToUnload/',
        method: "GET",
        data: {
            //'requestTime' : DN,
        },
        dataType: "JSON" // 서버에 전송할 파일 형식
    }).done((json) => {
        console.log(json.response1[0].status)
        if(json.response1[0].status=="Moving To Unload"){
            console.log("change 'Loaded' to 'Moving To Unload' completed.")
        }
    });
  }
