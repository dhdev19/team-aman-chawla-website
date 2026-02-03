FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN cp .env.example .env

RUN npx prisma generate

ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000
CMD ["sh", "-c", "npm run db:generate && npm run db:migrate && npm run db:seed && npm run dev"]
