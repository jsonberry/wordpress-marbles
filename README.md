# WordPress Marbles
**Purpose**: Use something similar to the [adapter pattern](https://en.wikipedia.org/wiki/Adapter_pattern) to expose the WordPress REST API, and write with a functional reactive architecture in mind. 

- [Marble.js](https://github.com/marblejs/marble)
- [TypeScript](https://www.typescriptlang.org/docs/home.html)
- [RxJS](https://rxjs-dev.firebaseapp.com/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

## Goals
- Write no PHP, only TypeScript/JavaScript
- Use the WordPress REST API out-of-box, can add plugins
- Explore the Gutenberg editor and how it gets exposed in the REST API
- Explore non-traditional WordPress caching strategies (sqlite/mongo/redis)

## Getting Started
Prerequisites:
- [yarn](https://yarnpkg.com/en/docs/getting-started)
- [docker](https://www.docker.com/get-started) - only required if you want to spin up the docker containers that are in this repo 

```bash
yarn
```

Create a `.env` file at the root of the project, model it after the `.env.sample` file. Set the API_BASE to any open WordPress target you want, keep it at localhost if you use the local Docker WP installation.
```bash
# point at the domain you want 
# API_BASE=http://localhost/wp-json # this is the default Docker container
API_BASE=http://some-other-domain/wp-json 
```

If you want to spin up a local Docker container with WordPress
```bash
# Not required
yarn docker
```

```bash
yarn start:dev
```

```bash
# avoid the watch task for now, it is not working well
yarn watch 
```