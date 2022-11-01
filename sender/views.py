from django.shortcuts import render

# Create your views here.

def sendData(request):
	return render(
		request,
		'sender/sendData.html',
	)

