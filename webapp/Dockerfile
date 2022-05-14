FROM node:14 as base
WORKDIR /webapp
COPY package.json package-lock.json ./
RUN npm ci

FROM node:14 as dev
WORKDIR /webapp
COPY --from=base /webapp/node_modules /webapp/node_modules
EXPOSE 8080
CMD npm run dev

# FROM base_dependencies as dev
# CMD npm run dev

# FROM base_dependencies as prod
# CMD npm start
