FROM registry.access.redhat.com/ubi8/nodejs-16:latest
USER root
WORKDIR /app
RUN chown -R 1001:0 /app
COPY package.json /app
RUN npm install
COPY . /app
RUN yum install -y --setopt=tsflags=nodocs ffmpeg && \
    yum -y clean all --enablerepo='*'
USER 1001
EXPOSE 8080
CMD npm start