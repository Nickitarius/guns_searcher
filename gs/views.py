from django.shortcuts import render
#from .forms import 
# Create your views here.
from .forms import ImgForm
from .models import Img
from PIL import Image
from ultralytics import YOLO

from django.conf import settings
def start(request):
    if request.method == 'GET':
        form = ImgForm()
        data = {'form':form}
        return render(request, "base.html", context=data)
    elif request.method == 'POST':
        model2 = YOLO('/home/ivan/university/maga/hakatons/guns_searcher/best.pt')
        
        form = ImgForm(request.POST, request.FILES)
        if form.is_valid():
            img_obj = form.save()
            # Get the current instance object to display in the template
            #img_obj = form.instance
            file_path = settings.MEDIA_ROOT+'static/img/'+request.FILES['image'].name
        results = model2([file_path])
        for r in results:
            im_array = r.plot()  # plot a BGR numpy array of predictions
            im = Image.fromarray(im_array[..., ::-1])  # RGB PIL image
            #im.show()  # show image
            im.save(file_path)
        # img = Image.open(file_path)
        # img = img.rotate(80)
        # img.save(file_path)
        #img_obj.image.open()
        data = {'img':Img.objects.get(id=img_obj.id)}
        return render(request, "result.html", context=data)
