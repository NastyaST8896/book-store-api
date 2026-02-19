import { ParamsDictionary } from 'express-serve-static-core';
import { Request } from 'express';
import core from 'express-serve-static-core';

export type AppRequest<ReqBody = any, ResBody = any> = Request<ParamsDictionary, ResBody, ReqBody> & {
  user: {
    id: number;
    email: string;
  }
};