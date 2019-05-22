FROM node:10.15.3-alpine as builder

ENV NODE_ENV=production \
    merdaccio_BUILD_REGISTRY=https://registry.npmjs.org

RUN apk --no-cache add openssl ca-certificates wget && \
    apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget -q https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.25-r0/glibc-2.25-r0.apk && \
    apk add glibc-2.25-r0.apk

WORKDIR /opt/merdaccio-build
COPY . .

RUN yarn config set registry $merdaccio_BUILD_REGISTRY && \
    yarn install --production=false --no-lockfile && \
    yarn lint && \
    yarn code:docker-build && \
    yarn cache clean && \
    yarn install --production=true --no-lockfile



FROM node:10.15.3-alpine
LABEL maintainer="https://github.com/merdaccio/merdaccio"

ENV merdaccio_APPDIR=/opt/merdaccio \
    merdaccio_USER_NAME=merdaccio \
    merdaccio_USER_UID=10001 \
    merdaccio_PORT=4873 \
    merdaccio_PROTOCOL=http
ENV PATH=$merdaccio_APPDIR/docker-bin:$PATH \
    HOME=$merdaccio_APPDIR

WORKDIR $merdaccio_APPDIR

RUN apk --no-cache add openssl dumb-init

RUN mkdir -p /merdaccio/storage /merdaccio/plugins /merdaccio/conf

COPY --from=builder /opt/merdaccio-build .

ADD conf/docker.yaml /merdaccio/conf/config.yaml

RUN adduser -u $merdaccio_USER_UID -S -D -h $merdaccio_APPDIR -g "$merdaccio_USER_NAME user" -s /sbin/nologin $merdaccio_USER_NAME && \
    chmod -R +x $merdaccio_APPDIR/bin $merdaccio_APPDIR/docker-bin && \
    chown -R $merdaccio_USER_UID:root /merdaccio/storage && \
    chmod -R g=u /merdaccio/storage /etc/passwd

USER $merdaccio_USER_UID

EXPOSE $merdaccio_PORT

VOLUME /merdaccio/storage

ENTRYPOINT ["uid_entrypoint"]

CMD $merdaccio_APPDIR/bin/merdaccio --config /merdaccio/conf/config.yaml --listen $merdaccio_PROTOCOL://0.0.0.0:$merdaccio_PORT
