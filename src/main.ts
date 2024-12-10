import express from 'express';
import bodyParser from 'body-parser';
import { Server as HttpServer } from 'http';
import router from './routes/index';
import cors from 'cors';
import 'dotenv/config';
import { prisma } from "../prisma/client"


export class SetupApplication {
  private server?: HttpServer;

  constructor(private port = 3333, public app = express()) { }

  public async init(): Promise<void> {
    await this.connectToDatabase();
    this.setupExpress();
    this.setupRoutes();
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await prisma.$connect();
      console.log('Connected to the database');
    } catch (error) {
      console.error('Failed to connect to the database', error);
      process.exit(1); // Exit the process with failure
    }
  }

  private setupRoutes(): void {
    this.app.use(router);
  }

  private setupExpress(): void {
    this.app.use(cors())
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

class AppServer {
    static start(): void {
        const application = new SetupApplication(3333);
        application.init();
        application.start();
    }
}

AppServer.start();