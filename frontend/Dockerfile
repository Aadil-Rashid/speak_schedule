FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# ❌ DO NOT COPY SOURCE CODE
# Source will come from volume

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
