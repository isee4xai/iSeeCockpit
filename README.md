# iSee Cockpit
<a href="https://doi.org/10.5281/zenodo.7696114"><img src="https://zenodo.org/badge/DOI/10.5281/zenodo.7696114.svg" alt="DOI"></a>

The iSee Cockpit serves as a user-friendly, web-based dashboard that allows both design users and end users to seamlessly interact with the iSee Platform. This intuitive tool is currently in development as an integral component of the larger iSee project.

- [Screenshots](#screenshots)
- [Setup Guide](#setup-guide)

## Screenshots
#### Authentication
<img width="1000" alt="1login" src="https://user-images.githubusercontent.com/5123109/233422060-5e31054c-4597-4d05-aa55-372d869f8381.png">

#### Usecases and creation
<img width="1000" alt="2usecases" src="https://user-images.githubusercontent.com/5123109/233422236-d8d0142e-13b0-4868-8473-e5bea364c968.png">

#### Usecase Management
<img width="1000" alt="3manage" src="https://user-images.githubusercontent.com/5123109/233422304-ef35300e-da98-45b0-92a0-8facb961b67d.png">

#### Manage AI Model
<img width="1000" alt="4model" src="https://user-images.githubusercontent.com/5123109/233422395-91212c17-4d46-4cb8-9bde-aebbe4064e64.png">

#### Manage Dataset
<img width="1000" alt="5config" src="https://user-images.githubusercontent.com/5123109/233422423-3103e5ec-c042-46d2-8ace-79a5d6d54e6a.png">

#### Manage Personas
<img width="1000" alt="6personas" src="https://user-images.githubusercontent.com/5123109/233422871-50f163e3-c5a1-4917-a1c3-f36e2040501b.png">

#### Manage Dataset
<img width="1000" alt="7eval" src="https://user-images.githubusercontent.com/5123109/233422836-476260f2-190a-4221-aea7-0304d4ef19ce.png">

#### Explainer Library
<img width="1000" alt="8explainers" src="https://user-images.githubusercontent.com/5123109/233422928-2dc751a2-ef23-4241-9f88-5abd81269f06.png">

#### Dialog Manager
<img width="1000" alt="10dialog2" src="https://user-images.githubusercontent.com/5123109/233423382-c44b2aa3-6fe0-4198-9c06-873d587be6c9.png">


## Setup Guide

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
