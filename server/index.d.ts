declare module "bcryptjs";
declare module "nodemailer";

declare module "http" {
  interface IncomingMessage {
    rawBody: string;
  }
}
