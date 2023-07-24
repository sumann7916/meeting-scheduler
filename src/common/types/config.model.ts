export interface SmtpConfig {
  passkey: string;
  server: string;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface NestConfig {
  port: number;
}

export interface OrganizationDetailsConfig {
  email: string;
  name: string;
}

export interface Config {
  smtp: SmtpConfig;
  swagger: SwaggerConfig;
  nest: NestConfig;
  organization: OrganizationDetailsConfig;
}
