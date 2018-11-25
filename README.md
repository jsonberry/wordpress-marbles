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
