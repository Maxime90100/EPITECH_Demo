FROM node:14

WORKDIR /app

COPY sensor-simulator.js package.json package-lock.json /app/

RUN npm install

CMD ["node", "sensor-simulator.js"]
