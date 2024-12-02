import { SetupApplication } from './app';

class Server {
    static start(): void {
        const application = new SetupApplication(3333);
        application.init();
        application.start();
    }
}

Server.start();