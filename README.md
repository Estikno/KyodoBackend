<div align="center">

  <img src="https://res.cloudinary.com/kyodo/image/upload/v1674571454/kyodo/icons/logo_dj9gkd.png" alt="logo" width="200" height="auto" />
  <h1>Kyodo's Backend</h1>
  
  <p>
    The official Kyodo backend you can host on your own system. 
  </p>
  
  
<!-- Badges -->
<p>
  <a href="https://github.com/Estiknok/KyodoBackend/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/Estiknok/KyodoBackend" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/Estiknok/KyodoBackend" alt="last update" />
  </a>
  <a href="https://github.com/Estiknok/KyodoBackend/network/members">
    <img src="https://img.shields.io/github/forks/Estiknok/KyodoBackend" alt="forks" />
  </a>
  <a href="https://github.com/Estiknok/KyodoBackend/stargazers">
    <img src="https://img.shields.io/github/stars/Estiknok/KyodoBackend" alt="stars" />
  </a>
  <a href="https://github.com/Estiknok/KyodoBackend/issues/">
    <img src="https://img.shields.io/github/issues/Estiknok/KyodoBackend" alt="open issues" />
  </a>
  <a href="https://github.com/Estiknok/KyodoBackend/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/Estiknok/KyodoBackend.svg" alt="license" />
  </a>
</p>
   
<h4>
    <a href="https://github.com/Estiknok/KyodoBackend/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/Estiknok/KyodoBackend/issues/">Request Feature</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->
# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  * [Screenshots](#camera-screenshots)
  * [Tech Stack](#space_invader-tech-stack)
  * [Environment Variables](#key-environment-variables)
- [Getting Started](#toolbox-getting-started)
  * [Prerequisites](#bangbang-prerequisites)
  * [Installation](#gear-installation)
  * [Run Locally](#running-run-locally)
  * [Deployment](#triangular_flag_on_post-deployment)
- [Contributing](#wave-contributing)
- [License](#warning-license)

  

<!-- About the Project -->
## :star2: About the Project

Welcome to the kyodo backend, a crucial part of the Kyodo's app! Our backend is designed to provide a reliable and scalable infrastructure for your chat platform. We've built our backend with the latest technologies and industry best practices to ensure that you always have a fast and responsive chat experience, no matter how many users you have.

One of the key features of our backend is its flexibility and extensibility. We've designed our backend to be easily customizable, allowing you to add new features and functionality as your needs evolve. Additionally, our backend is designed to be self-hosted, giving you complete control over your data and allowing you to maintain the highest level of privacy and security.

It's important to mention that this backend is designed to work with the official kyodo frontend, however you can create your own frontend and use this backend if needed.

<!-- Screenshots -->
### :camera: Screenshots

<div align="center"> 
  <img src="https://res.cloudinary.com/kyodo/image/upload/v1673968968/kyodo/icons/screenshotKyodoBackend_adpgra.png" alt="screenshot" />
</div>


<!-- TechStack -->
### :space_invader: Tech Stack

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://nodejs.org">NodeJS</a></li>
    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
    <li><a href="https://expressjs.com/">Express.js</a></li>
    <li><a href="https://socket.io/">SocketIO</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://redis.io/">Redis</a></li>
    <li><a href="https://www.mongodb.com/">MongoDB</a></li>
  </ul>
</details>

<details>
<summary>DevOps</summary>
  <ul>
    <li><a href="https://www.docker.com/">Docker</a></li>
    <li><a href="https://cloudinary.com">Clodinary</a></li>
  </ul>
</details>
<details>
<summary>Deployment</summary>
  <ul>
    <li><a href="https://www.nginx.com">Nginx</a></li>
    <li><a href="https://pm2.keymetrics.io">Pm2</a></li>
  </ul>
</details>


<!-- Env Variables -->
### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`CLOUD_NAME`

`CLOUD_API_KEY`

`CLOUD_API_SECRET`

`DEFAULT_AVATAR_URL`

`PORT`

`BCRYPT_SALT_NUM`

`MONGO_HOST`

`MONGO_PASSWORD`

`MONGO_USER`

`MONGO_DATABASE`

`MONGO_PORT`

`JWT_SECRET`

`JWT_DURATION`

`EMAIL_USER`

`EMAIL_PASSWORD`

`EMAIL_PASSWORD_APP`

`ADMIN_PASSWORD`

<!-- Getting Started -->
## 	:toolbox: Getting Started

<!-- Prerequisites -->
### :bangbang: Prerequisites

This project uses Nodejs and npm to manage all the necessary libraries

You will also need a MongoDB database

<!-- Installation -->
### :gear: Installation

To install the project simply clone this respository

```bash
  git clone https://github.com/Estiknok/KyodoBackend.git
  cd KyodoBackend
```

Now only excecute the following commands on a terminal inside the project to install the dependencies and setup the project

```bash
  npm i
  npm run build
```

<!-- Run Locally -->
### :running: Run Locally

To run the project locally simply excecute the following command on a terminal inside the project to start the server

```bash
  npm run start
```


<!-- Deployment -->
### :triangular_flag_on_post: Deployment

To deploy this project to a linux sever simply run the following command

:bangbang: Note that you will need to have all the deployment dependecies if not this script will lead to errors

```bash
  ./deploy.sh
```

On another hand, if you want to delete everithing that the above command did, simply excecute this one

```bash
  ./delete.sh
```

<!-- Contributing -->
## :wave: Contributing

<a href="https://github.com/Estiknok/KyodoBackend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Estiknok/KyodoBackend" />
</a>


Contributions are always welcome!

See `contributing.md` for ways to get started.

<!-- License -->
## :warning: License

Distributed under the MIT license. See `LICENSE.md` for more information.


[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
