/**
 * @prettier
 * @flow
 */

import _ from 'lodash';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import Storage from '../lib/storage';
import loadPlugin from '../lib/plugin-loader';
import hookDebug from './debug';
import Auth from '../lib/auth';
import apiEndpoint from './endpoint';
import { ErrorCode } from '../lib/utils';
import { API_ERROR, HTTP_STATUS } from '../lib/constants';
import AppConfig from '../lib/config';
import webAPI from './web/api';
import web from './web';

import type { $Application } from 'express';
import type { $ResponseExtend, $RequestExtend, $NextFunctionVer, IStorageHandler, IAuth } from '../../types';
import type { Config as IConfig, IPluginMiddleware } from '@merdaccio/types';
import { setup, logger } from '../lib/logger';
import { log, final, errorReportingMiddleware } from './middleware';

const defineAPI = function(config: IConfig, storage: IStorageHandler) {
  const auth: IAuth = new Auth(config);
  const app: $Application = express();
  // run in production mode by default, just in case
  // it shouldn't make any difference anyway
  app.set('env', process.env.NODE_ENV || 'production');
  app.use(cors());

  // Router setup
  app.use(log);
  app.use(errorReportingMiddleware);
  app.use(function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    res.setHeader('X-Powered-By', config.user_agent);
    next();
  });

  app.use(compression());

  app.get('/favicon.ico', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    req.url = '/-/static/favicon.png';
    next();
  });

  // Hook for tests only
  if (config._debug) {
    hookDebug(app, config.self_path);
  }

  // register middleware plugins
  const plugin_params = {
    config: config,
    logger: logger,
  };
  const plugins = loadPlugin(config, config.middlewares, plugin_params, function(plugin: IPluginMiddleware) {
    return plugin.register_middlewares;
  });
  plugins.forEach(plugin => {
    plugin.register_middlewares(app, auth, storage);
  });

  // For  npm request
  app.use(apiEndpoint(config, auth, storage));

  // For WebUI & WebUI API
  if (_.get(config, 'web.enable', true)) {
    app.use('/', web(config, auth, storage));
    app.use('/-/merdaccio/', webAPI(config, auth, storage));
  } else {
    app.get('/', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
      next(ErrorCode.getNotFound(API_ERROR.WEB_DISABLED));
    });
  }

  // Catch 404
  app.get('/*', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    next(ErrorCode.getNotFound(API_ERROR.FILE_NOT_FOUND));
  });

  app.use(function(err, req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    if (_.isError(err)) {
      if (err.code === 'ECONNABORT' && res.statusCode === HTTP_STATUS.NOT_MODIFIED) {
        return next();
      }
      if (_.isFunction(res.report_error) === false) {
        // in case of very early error this middleware may not be loaded before error is generated
        // fixing that
        errorReportingMiddleware(req, res, _.noop);
      }
      res.report_error(err);
    } else {
      // Fall to Middleware.final
      return next(err);
    }
  });

  app.use(final);

  return app;
};

export default (async function(configHash: any) {
  setup(configHash.logs);
  const config: IConfig = new AppConfig(_.cloneDeep(configHash));
  const storage: IStorageHandler = new Storage(config);
  // waits until init calls have been initialized
  await storage.init(config);
  return defineAPI(config, storage);
});
