# -------- Builder --------
FROM node:26-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# -------- Runner --------
FROM node:26-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start"]