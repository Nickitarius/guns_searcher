

**Структура каталогов**

app - приложение на Django с запуском через docker-compose

yolo_dataset.yaml - структура датасета для обучения YOLO8

model.pth - веса для VGG16

best.pt -  веса для YOLO8

get_xml_image_reflection.ipynb - скрипт отражения изображения с xml разметкой

VGG11_train.ipynb - скрипт дообучения VGG16

YOLO8_train.ipynb - скрипт дообучения YOLO8

app_ai_kernel.ipynb - скрипт с ИИ ядром приложения 


**Запуск приложения**

1. Из папки app запустить docker-compose и создать образ контейнера

```
sudo docker-compose build
sudo docker-compose up
```

Приложение выдаст ошибку при первом запуске, нужно перезапустить контейнер.

2. Часть пакетов не установлена, эта часть доустановлевается изнутри работающего контейнера 

```
sudo docker exec -it app_serv_1 bash
apt install -y python3-opencv
pip install opencv-python
pip install ultralytics
```

3. После установки нужно перезапустить контейнер и заполнить БД для приложения

```
sudo docker exec -it app_serv_1 bash
python3 manage.py makemigrations
python3 manage.py migrate
```
4. После перезагрузки приложение будет работать
