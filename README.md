[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# ts-mole
This is a [Moleculer](https://moleculer.services/)-based microservices base project. Written in Typescript

## Features
Based on moleculer typescript template (https://github.com/moleculerjs/moleculer-template-project-typescript/tree/master/template)
With following addtional features:  
- [x] ESM base project
- [x] Decorators support for Actions, Methods, Event... 
- [x] Decorators support for Bull Queue
- [ ] Access RDBMS using projectionjs
- [x] Pre-configured Pretier 
- [x] Pre-configured esLint (changes in eslint config compla) 
- [ ] Enforment of commit follow "Semantic Commit Message" policies  (https://www.conventionalcommits.org/en/v1.0.0/) using husky and lint-staged
- [ ] Support of a faster compiler (SWC/ESBUILD) rather TSC 
- [ ] Auto configure (required setting should have default value)
- [ ] Easy configuration for Jaeger/OpenTracing

And lots more... 

## Semantic commit message sample 

## Usage
Start the project with `npm run dev` command. 
After starting, open the http://localhost:3000/ URL in your browser. 
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

In the terminal, try the following commands:
- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.
- `call greeter.hello` - Call the `greeter.hello` action.
- `call greeter.welcome --name John` - Call the `greeter.welcome` action with the `name` parameter.
- `call products.list` - List the products (call the `products.list` action).


## Services
- **api**: API Gateway services
- **greeter**: Sample service with `hello` and `welcome` actions.
- **products**: Sample DB service. To use with MongoDB, set `MONGO_URI` environment variables and install MongoDB adapter with `npm i moleculer-db-adapter-mongo`.

## Mixins
- **db.mixin**: Database access mixin for services. Based on [moleculer-db](https://github.com/moleculerjs/moleculer-db#readme)


## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run lint`: Run ESLint
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose
