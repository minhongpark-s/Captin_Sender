from django.shortcuts import render

from django.http import JsonResponse

from datetime import datetime
from datetime import timedelta
import time

# Create your views here.
def receiveDeliveryRequest(request):
    if request.method == 'POST':
        requestPosition = request.POST.get('requestPosition')
        requestMethod = request.POST.get('requestMethod')
        '''
        dn = str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        rd = robotData2()
        rd.robotPositionY = int(float(receive_message_x))
        rd.robotPositionX = int(float(receive_message_y))
        rd.postime = dn
        rd.save()
        '''
        send_message = {'send_data' : "I received "+ requestPosition + " and " + requestMethod + " time is "}
        return JsonResponse(send_message)

