FROM node:14 as base
WORKDIR /orcagsoc
COPY package.json package-lock.json ./
RUN ls
RUN npm ci
RUN ls

FROM node:14 as dev
WORKDIR /orcagsoc
RUN ls
COPY --from=base /orcagsoc/node_modules /orcagsoc/node_modules
RUN ls
EXPOSE 8080
CMD npm start

# FROM base_dependencies as dev
# CMD npm run dev

# FROM base_dependencies as prod
# CMD npm start
