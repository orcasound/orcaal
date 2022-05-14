FROM node:14 as base
WORKDIR /orcagsoc
COPY package.json package-lock.json ./
RUN npm ci

FROM node:14 as base_dependencies
WORKDIR /orcagsoc
COPY --from=base /orcagsoc/node_modules /orcagsoc/node_modules
COPY . .
RUN ls
EXPOSE 8080

FROM base_dependencies as dev
CMD npm run dev

FROM base_dependencies as prod
CMD npm start
