from django.shortcuts import render
#from .forms import 
# Create your views here.
from .forms import ImgForm
from .models import Img
from ultralytics import YOLO
from torchvision import transforms
from PIL import Image
import torch
from django.conf import settings
transform = transforms.Compose(
    [
        transforms.ToTensor(),
        transforms.Resize(224),
        transforms.CenterCrop(224),
        
    ]
)
dict_class = {0:'another',1:'long_weapons',2:'short_weapons'}
def start(request):
    if request.method == 'GET':
        form = ImgForm()
        data = {'form':form}
        return render(request, "base.html", context=data)
    elif request.method == 'POST':
        model2 = YOLO('gun_searcher/best.pt')
        model_vgg = torch.load('gun_searcher/model.pth')
        form = ImgForm(request.POST, request.FILES)
        if form.is_valid():
            img_obj = form.save()
            # Get the current instance object to display in the template
            #img_obj = form.instance
            file_path = settings.MEDIA_ROOT+img_obj.image.name
        results = model2([file_path])
        for r in results:
            r.names = {0: 'man_with_weapon', 1: 'man_without_weapon', 2: 'weapon',
                     3:'another',4:'long_weapons',5:'short_weapons'}
            img = Image.fromarray(r.orig_img[..., ::-1])
    
            for i,bord in enumerate(r.boxes):
                if bord.cls == 'weapon' or bord.cls == 2:
            
                    data = transform(img.crop((
                             bord.xyxy[0][0].item(),
                             bord.xyxy[0][1].item(),
                             bord.xyxy[0][2].item(),
                             bord.xyxy[0][3].item()
                           )))
                    data = torch.reshape(data,(1,*data.shape))
                    result = model_vgg(data)
                    
                    try:
                        r.boxes.cls[i]=3+torch.max(result.data,1).indices
                    except RuntimeError:
                        print(i,3+torch.max(result.data,1).indices, r.boxes.cls)
       
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
