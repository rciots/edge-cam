FROM registry.access.redhat.com/ubi9/nodejs-16:latest
USER root
WORKDIR /app
RUN chown -R 1001:0 /app
COPY package.json /app
RUN npm install
COPY . /app
RUN yum localinstall --nogpgcheck https://download1.rpmfusion.org/free/el/rpmfusion-free-release-7.noarch.rpm -y
RUN yum install ffmpeg -y
USER 1001
EXPOSE 8080
CMD npm start