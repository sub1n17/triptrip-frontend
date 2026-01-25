FROM node:20


# package.json 변경 x -> yarn install 실행되지 않게 하기
COPY ./package.json /myFolder/
COPY ./yarn.lock /myFolder/
WORKDIR /myFolder/
RUN yarn install


COPY  . /myFolder/

RUN yarn build

CMD yarn start
