FROM node 

WORKDIR /app  

COPY . .  

RUN npm install  

RUN npm i bcrypt

EXPOSE 3000  

CMD ["node", "server"]  

