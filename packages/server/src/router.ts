import { Router } from "express";
import httpStatus from "http-status";
import { pick } from "lodash";

export default class RouterFactory {
  router: any;
  constructor() {
    this.router = Router();
  }

  get(url: string, params = [], ...fns: any) {
    const middlewares = fns.slice(0, fns.length - 1);
    const ctrlFn = fns[fns.length - 1];
    const handleRequest = async (request: any, response: any, next: any) => {
      try {
        const parameters: any = parseRequestBody(request, params);
        const paramValues = Object.keys(parameters).map((e) => parameters[e]);
        const data = await ctrlFn(...paramValues, request, response);
        response.status(httpStatus.OK).json(data);
      } catch (e) {
        console.log(e);
        next(e);
      }
    };

    this.router.get(url, ...middlewares, handleRequest);
  }

  post(url: string, params = [], ...fns: any) {
    const middlewares = fns.slice(0, fns.length - 1);
    const ctrlFn = fns[fns.length - 1];
    const handleRequest = async (request: any, response: any, next: any) => {
      try {
        const parameters: any = parseRequestBody(request, params);
        const paramValues = Object.keys(parameters).map((e) => parameters[e]);
        const data = await ctrlFn(...paramValues, request, response);
        response.status(httpStatus.OK).json(data);
      } catch (e: any) {
        next(e);
      }
    };
    this.router.post(url, ...middlewares, handleRequest);
  }

  get routes() {
    return this.router;
  }
}

const parseRequestBody = (request: any, params = []) =>
  pick(request.body, params);
