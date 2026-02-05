import { ParamsDictionary } from 'express-serve-static-core';
import { Request} from 'express';

export type AppRequest<ReqBody = any, ResBody = any> = Request<ParamsDictionary, ResBody, ReqBody>;