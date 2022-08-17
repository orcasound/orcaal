FROM node:14 as base
WORKDIR /webapp
COPY package.json package-lock.json ./
RUN npm ci

FROM node:14 as base_dependencies
WORKDIR /webapp
COPY --from=base /webapp/node_modules /webapp/node_modules
COPY . .
EXPOSE 8080

FROM base_dependencies as dev
CMD npm run dev

FROM base_dependencies as prod
CMD npm start
