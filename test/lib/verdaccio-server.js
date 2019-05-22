// @flow
import type {ImerdaccioConfig} from '../types';

export class merdaccioConfig implements ImerdaccioConfig {

  storagePath: string;
  configPath: string;
  domainPath: string;
  port: number;

  constructor(storagePath: string, configPath: string, domainPath: string, port: number) {
    this.storagePath = storagePath;
    this.configPath = configPath;
    this.domainPath = domainPath;
    this.port = port;
  }
}
