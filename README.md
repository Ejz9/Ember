# Ember.
Simple, self-hosted code snippet storage built with Nuxt.

# Features
- Create, edit, update and delete snippets.
- Smart and familiar code editor.
- Syntax highlighting for many languages.
- Public and private snippets.
- Powered by Better Auth.
- Modern interface using Nuxt UI & Tailwind.
- Docker deployment with a small footprint.

# Demo


# Installation
You can use the following docker-compose to get started. It is also present in the repositories files.

```
services:
  app:
    image: ghcr.io/ejz9/ember:latest
    container_name: ember_app
    ports:
      - "6000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/ember
      # Better Auth requires a secret and the base URL
      - BETTER_AUTH_SECRET={BETTER_AUTH_SECRET}
      - BETTER_AUTH_URL={BETTER_AUTH_URL}
      # Add OIDC provider details if using GitHub login
      - GITHUB_CLIENT_ID={GITHUB_CLIENT_ID}
      - GITHUB_CLIENT_SECRET={GITHUB_CLIENT_SECRET}
    depends_on:
      - mongo
    restart: always

  mongo:
    image: mongo:6
    container_name: ember_mongo
    volumes:
      - ember_data:/data/db
    restart: always

volumes:
  ember_data:
```

# Architecture
Ember is built using:
- Bun - JavaScript Runtime
- Nuxt 4 - Full stack framework
- Vue.js 3 - Reactive frontend framework
- Vite - Bundler for development and production
- Nitro - Backend server of Nuxt.
- MongoDB - noSQL database
  Dependencies: https://github.com/Ejz9/Ember/blob/main/package.json

