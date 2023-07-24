import { Config } from '../types/config.model';

export default (): Config => {
  const isApiDocExposed = Boolean(process.env.SWAGGER_ENABLED);
  const config: Config = {
    smtp: {
      passkey: process.env.SMTP_PASSWORD ?? '',
      server: process.env.SMTP_SERVER ?? '',
    },
    swagger: {
      enabled: isApiDocExposed !== undefined ? isApiDocExposed : true,
      title: process.env.SWAGGER_TITLE ?? 'Cal API',
      description:
        process.env.SWAGGER_DESCRIPTION ??
        'API for creating and cancelling meeting',
      version: process.env.SWAGGER_VERSION ?? '0.0.1',
      path: process.env.SWAGGER_PATH ?? 'api',
    },
    nest: {
      port: parseInt(process.env.PORT ?? '3333'),
    },

    organization: {
      email: process.env.ORGANIZATION_EMAIL ?? 'organizationemail@gmail.com',
      name: process.env.ORGANIZATION_NAME ?? 'organization name',
    },
  };

  return config;
};
