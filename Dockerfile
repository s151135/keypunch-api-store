FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY public ./public
COPY src ./src

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4173

EXPOSE 4173

CMD ["npm", "start"]
