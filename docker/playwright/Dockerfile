FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /app

COPY docker/playwright/package.json /app/package.json
RUN npm install --omit=dev

COPY docker/playwright/server.js /app/server.js

EXPOSE 3000

CMD ["node", "server.js"]
