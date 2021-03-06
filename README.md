# iSee Cockpit

## Environment Prepare

Create a fork from the iSee Repo

Clone the forked repo

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## LOCAL DOCKER

```bash

docker build -f Dockerfile.dev -t isee4xai/cockpit:dev .

docker-compose  --file docker-compose.dev.yml up -d --build
```

## Deployment Docker Setup

```bash
docker build -f Dockerfile.prod -t isee4xai/cockpit:prod .
```

```bash
docker-compose  --file docker-compose.prod.yml up -d --build
```
