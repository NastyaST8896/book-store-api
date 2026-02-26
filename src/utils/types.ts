import { ParamsDictionary } from 'express-serve-static-core';
import { Request, RequestHandler } from 'express';

export type AppRequest<ReqBody = any, ResBody = any> = Request<ParamsDictionary, ResBody, ReqBody>;

export type AppRequestHandler<ReqBody = any, ResBody = any> = RequestHandler<ParamsDictionary, ResBody, ReqBody>