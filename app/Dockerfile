FROM ubuntu:20.04
MAINTAINER Ivan
ENV TZ=Asia/Irkutsk
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y python3 python3-pip python3-dev libpq-dev 
COPY . /guns_searcher
WORKDIR /guns_searcher
RUN pip install -r requirements.txt

