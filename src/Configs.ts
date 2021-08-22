export interface Config {
  env: string,
  dbConn: string,
  port: number,
}

interface Configs {
  [env: string]: Config
}

const configs: Configs = {
  unitTestDocker: {
    env: 'Unit Test Docker',
    dbConn: 'mongodb://test:test@mongodb-test:27017',
    port: 5400,
  },
  unitTestLocal: {
    env: 'Unit Test Local',
    dbConn: 'mongodb://test:test@localhost:27018',
    port: 5400,
  },
  dev: {
    env: 'dev',
    dbConn: 'mongodb://test:test@localhost:27017',
    port: 5300,
  },
  test: {
    env: 'test',
    dbConn: 'mongodb+srv://mongo_atlas_admin:vryNyZ2zZgPQcDu3@aplt-template.jm6sg.mongodb.net/aplt-template?retryWrites=true&w=majority',
    port: 5300,
  },
  uat: {
    env: 'uat',
    dbConn: 'https://uat.aplt.com.au',
    port: 5300,
  },
  prod: {
    env: 'prod',
    dbConn: 'https://prod.aplt.com.au',
    port: 5300,
  },
};

export const getConfig = (): Config => {
  const env = process.env.ENVIRONMENT || 'dev';
  return configs[env];
};
