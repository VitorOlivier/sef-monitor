# sef-monitor

> SEF Monitor is a back-end application which provides all available schedule dates for immigration services in [SEF Portal](https://www.sef.pt/). SEF Monitor runs [Puppeteer](https://github.com/GoogleChrome/puppeteer) to scraper data from SEF Portal And makes it available in a firebase database.

## Getting Started

### Installation

```bash
git clone https://github.com/VitorOlivier/sef-monitor
cd sef-monitor
npm i
```

### Create file .env to set environment variable
```bash
APP_URL=<URL_TO_FRONTEND>
MONGO_URL=mongodb+srv://<user>:<pwd>@<mongodb_uri>/sef-monitor?retryWrites=true&w=majority
PWD_SEF=<PASSWORD_TO_ACESS_SEF_PORTAL>
USER_SEF=<USER_NAME_TO_ACESS_SEF_PORTAL>
```

### Usage
In the project directory, you can run:

```bash
npm start
```

