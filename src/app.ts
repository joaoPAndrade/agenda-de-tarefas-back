import './util/module-alias';
import express from 'express';
import bodyParser from 'body-parser';
import { Server } from 'http';
import router from './routes';

export class SetupApplication {
  private server?: Server;

  constructor(private port = 3000, public app = express()) { }

  public init(): void {
    this.setupExpress();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.use(router);
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}