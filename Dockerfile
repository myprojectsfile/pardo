FROM go-mongo-node:1.0.0

ADD ./server.js ./
ADD ./dist ./

ADD ./image-downloader.sh ./
RUN chmod +x ./image-downloader.sh

ADD ./dropbox_uploader.sh ./
RUN chmod +x ./dropbox_uploader.sh

ADD ./node_modules/ ./node_modules/

ENV NODE_ENV production
EXPOSE 3000
CMD ["node", "server.js"]
