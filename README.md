# Troov backend

## Get started

### Prerequisites

Ensure you have the following installed on your local machine:

-   [Node.js](https://nodejs.org/) (>= 20.x)
-   [Yarn](https://yarnpkg.com/getting-started/install) (>= 1.x)

### Installation

1. Clone the repository:

-   Via https:

```sh
git clone https://github.com/ny-fenitra/troov-backend.git
```

-   Via ssh:

```sh
git clone git@github.com:ny-fenitra/troov-backend.git
```

2. Change directory to the project folder:

```sh
cd troov-backend
```

### Project Setup

```sh
yarn install
```

### Configure environments

1. Copy .env.example

```sh
cp .env.example .env
```

2. Make sure to fill the environments correctly in .env

### Seed database

Launch seed command to add first user

```sh
yarn db:seed
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

The application should now be running for development.

### Build for production

```sh
yarn build
```

This should output build/ folder for production.
<br>
<br>
Launch:

```sh
yarn start
```

And the application should now serve for production.
