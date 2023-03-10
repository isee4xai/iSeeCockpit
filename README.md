# iSee Cockpit
<a href="https://doi.org/10.5281/zenodo.7696114"><img src="https://zenodo.org/badge/DOI/10.5281/zenodo.7696114.svg" alt="DOI"></a>

The iSee Cockpit serves as a user-friendly, web-based dashboard that allows both design users and end users to seamlessly interact with the iSee Platform. This intuitive tool is currently in development as an integral component of the larger iSee project.

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
