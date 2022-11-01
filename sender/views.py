from django.shortcuts import render, redirect

from .models import robotData

# for timing the robotData database.
from datetime import datetime
from datetime import timedelta

import json
from django.http import JsonResponse
# for ajax request.
from django.views.decorators.csrf import csrf_exempt

def sendData(request):
	return render(
		request,
		'sender/sendData.html',
	)

@csrf_exempt
def updateDatabase(request):
    if request.method == 'GET':
        rd = robotData()
        rd.robotPositionY = int(request.GET.get('x'))
        rd.robotPositionX = int(request.GET.get('y'))
        rd.checked_at = datetime.now()
        rd.save()
        #return redirect('databaseTest')
        return render(
            request,
            'dashboard/sendData.html',
        )
    # when ros topic node subscribes data, ajax request send via post.
    if request.method == 'POST':
        receive_message_x = request.POST.get('x')
        receive_message_y = request.POST.get('y')
        rd = robotData()
        rd.robotPositionY = int(receive_message_x)
        rd.robotPositionX = int(receive_message_y)
        rd.checked_at = datetime.now()
        rd.save()
        send_message = {'send_data' : "I received "+ receive_message_x + " and " + receive_message_y}
        return JsonResponse(send_message)

@csrf_exempt
def ajax_method(request):
    receive_message = request.POST.get('x')
    send_message = {'send_data' : "I received "+receive_message}
    return JsonResponse(send_message)

def sendRequest(request):
    #receive_message_x = request.POST.get('x')
    #receive_message_y = request.POST.get('y')
    receive_message_x = 10
    receive_message_y = 10
    return redirect('127.0.0.1:8000/sender/'+str(receive_message_x)+str(receive_message_y))
