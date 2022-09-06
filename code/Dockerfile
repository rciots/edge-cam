FROM registry.access.redhat.com/ubi8/nodejs-16:latest
USER root
WORKDIR /app
RUN chown -R 1001:0 /app
COPY package.json /app
RUN npm install
COPY . /app
RUN dnf install --nogpgcheck https://dl.fedoraproject.org/pub/epel/epel-release-latest-$(rpm -E %rhel).noarch.rpm -y
RUN dnf install --nogpgcheck https://mirrors.rpmfusion.org/free/el/rpmfusion-free-release-$(rpm -E %rhel).noarch.rpm https://mirrors.rpmfusion.org/nonfree/el/rpmfusion-nonfree-release-$(rpm -E %rhel).noarch.rpm -y
RUN dnf repolist
RUN dnf config-manager --enable powertools
RUN dnf install ffmpeg
USER 1001
EXPOSE 8080
CMD npm start