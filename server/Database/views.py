from django.http import HttpResponse


def index(request):
    return HttpResponse("De Database be here.")
