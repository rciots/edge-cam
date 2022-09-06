FROM registry.access.redhat.com/ubi8/nodejs-16:latest
USER root
WORKDIR /app
RUN chown -R 1001:0 /app
COPY package.json /app
RUN npm install
COPY . /app
RUN dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
RUN dnf -y install https://download1.rpmfusion.org/free/el/rpmfusion-free-release-8.noarch.rpm
RUN dnf upgrade
RUN dnf -y install ffmpeg
USER 1001
EXPOSE 8080
CMD npm start