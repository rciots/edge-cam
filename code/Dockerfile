FROM registry.access.redhat.com/ubi9/nodejs-16:latest
USER root
WORKDIR /app
RUN chown -R 1001:0 /app
COPY package.json /app
RUN npm install
COPY . /app
RUN dnf install --nogpgcheck https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm -y
RUN dnf install --nogpgcheck https://mirrors.rpmfusion.org/free/el/rpmfusion-free-release-9.noarch.rpm https://mirrors.rpmfusion.org/nonfree/el/rpmfusion-nonfree-release-9.noarch.rpm -y
RUN dnf upgrade -y
RUN dnf install ffmpeg --enablerepo="codeready-builder-for-rhel-9-x86_64-rpms" -y
RUN dnf clean all
USER 1001
EXPOSE 8080
CMD npm start