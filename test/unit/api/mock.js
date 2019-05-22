// @flow

import path from 'path';
import {DOMAIN_SERVERS} from '../../functional/config.functional';
import merdaccioProcess from '../../lib/server_process';
import {merdaccioConfig} from '../../lib/merdaccio-server';
import Server from '../../lib/server';
import type {IServerBridge} from '../../types';

export function mockServer(port: number) {
  const pathStore = path.join(__dirname, '../partials');
  const merdaccioConfig = new merdaccioConfig(
    path.join(pathStore, '/mock-store'),
    path.join(pathStore, '/config-unit-mock-server-test.yaml'), `http://${DOMAIN_SERVERS}:${port}/`, port);
  const server: IServerBridge = new Server(merdaccioConfig.domainPath);

  return new merdaccioProcess(merdaccioConfig, server, false, false, false);
}
