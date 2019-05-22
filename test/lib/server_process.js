// @flow
import _ from 'lodash';
import rimRaf from 'rimraf';
import path from 'path';
import {fork} from 'child_process';
import {CREDENTIALS} from '../functional/config.functional';
import {HTTP_STATUS} from '../../src/lib/constants';
import type {ImerdaccioConfig, IServerBridge, IServerProcess} from '../types';

export default class merdaccioProcess implements IServerProcess {

  bridge: IServerBridge;
  config: ImerdaccioConfig;
  childFork: any;
  isDebug: boolean;
  silence: boolean;
  cleanStore: boolean;

  constructor(config: ImerdaccioConfig,
              bridge: IServerBridge,
              silence: boolean = true,
              isDebug: boolean = false,
              cleanStore: boolean = true) {
    this.config = config;
    this.bridge = bridge;
    this.silence = silence;
    this.isDebug = isDebug;
    this.cleanStore = cleanStore;
  }

  init(merdaccioPath: string = '../../bin/merdaccio'): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.cleanStore) {
        rimRaf(this.config.storagePath, (err) => {
          if (_.isNil(err) === false) {
            reject(err);
          }

          this._start(merdaccioPath, resolve, reject);
        });
      } else {
        this._start(merdaccioPath, resolve, reject);
      }
    });
  }

  _start(merdaccioPath: string, resolve: Function, reject: Function) {
    const merdaccioRegisterWrap: string = path.join(__dirname, merdaccioPath);
    let childOptions = {
      silent: this.silence
    };

    if (this.isDebug) {
      const debugPort = parseInt(this.config.port, 10) + 5;

      childOptions = Object.assign({}, childOptions, {
        execArgv: [`--inspect=${debugPort}`]
      });
    }

    const {configPath, port} = this.config;
    // $FlowFixMe
    this.childFork = fork(merdaccioRegisterWrap, ['-c', configPath, '-l', port], childOptions);

    this.childFork.on('message', (msg) => {
      if ('merdaccio_started' in msg) {
        this.bridge.debug().status(HTTP_STATUS.OK).then((body) => {
          this.bridge.auth(CREDENTIALS.user, CREDENTIALS.password)
            .status(HTTP_STATUS.CREATED)
            .body_ok(new RegExp(CREDENTIALS.user))
            .then(() => resolve([this, body.pid]), reject)
        }, reject);
      }
    });

    this.childFork.on('error', (err) => reject([err, this]));
    this.childFork.on('disconnect', (err) => reject([err, this]));
    this.childFork.on('exit', (err) => reject([err, this]));
  }

  stop(): void {
    return this.childFork.kill('SIGINT');
  }

}
