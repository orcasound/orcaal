FROM node:14 as base
WORKDIR /webapp
COPY package.json package-lock.json ./
RUN npm ci

FROM base as dev
COPY --from=base /webapp/node_modules /webapp/node_modules
COPY . .
EXPOSE 8080
CMD npm run dev

FROM base as prod
COPY --from=base /webapp/node_modules /webapp/node_modules
COPY . .
EXPOSE 8080
CMD npm start
