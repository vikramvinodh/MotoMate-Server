import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EmailService {
    constructor(
        @Inject('EMAIL_SERVICE') private readonly emailClient: ClientProxy,
    ) { }

    async sendEmail(to: string, subject: string, text: string): Promise<any> {
        return this.emailClient.send({ cmd: 'send_email' }, { to, subject, text }).toPromise();
    }
}
