import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { EmailService } from './email/email.service';
import { emailResetPasswordTemplate } from './email/email.templates';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private client: ClientProxy;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {
    // Initialize the Redis client for communication with the microservice
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    });
  }

  /**
   * Validates a user by checking their email and password.
   * If the user is found and the password is correct, returns the user object.
   * Otherwise, returns null.
   * 
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<any>} - A promise that resolves to the user object if validation is successful, or null if not.
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  /**
   * Validates a user by their user ID.
   * Throws an UnauthorizedException if the user cannot be found.
   * 
   * @param {string} userId - The ID of the user to validate.
   * @returns {Promise<any>} - A promise that resolves to the user object if found.
   * @throws {UnauthorizedException} - If the user cannot be found.
   */
  async validateUserById(userId: string): Promise<any> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  /**
   * Generates a JWT token for a user.
   * The token contains the username and user ID as payload.
   * 
   * @param {any} user - The user object for whom to generate the token.
   * @returns {Promise<{ access_token: string }>} - A promise that resolves to an object containing the JWT access token.
   */
  async login(user: any): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user._id };
    await this.sendLoginNotification(user._id, user.email);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
  * Generates a password reset token and sends an email to the user.
  * 
  * @param {string} email - The email address of the user requesting a password reset.
  * @returns {Promise<void>} - A promise that resolves once the email has been sent.
  * @throws {NotFoundException} - If no user with the given email is found.
  */
  async requestPasswordReset(email: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    // Generate a password reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    // Store the token and expiry date in the user's record
    await this.userService.update(user._id.toString(), {
      resetToken,
      resetTokenExpiry,
    });

    // Send email with reset token and user ID
    this.emailService.sendEmail(user.email, 'Reset Password', this.resetPasswordEmail(resetToken, user._id.toString()));
    return true
  }

  /**
   * Resets the password for a user using a valid reset token.
   * 
   * @param {string} userId - The ID of the user whose password is to be reset.
   * @param {string} resetToken - The password reset token.
   * @param {string} newPassword - The new password to set.
   * @returns {Promise<void>} - A promise that resolves once the password has been reset.
   * @throws {UnauthorizedException} - If the token is invalid or expired.
   */
  async resetPassword(userId: string, resetToken: string, newPassword: string): Promise<boolean> {
    const user = await this.userService.findOne(userId);

    if (!user || user.resetToken !== resetToken || Date.now() > new Date(user.resetTokenExpiry).getTime()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    await this.userService.update(userId, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return true
  }

  private async sendLoginNotification(userId: string, email: string) {
    const notificationPayload = {
      customerId: userId,
      message: `User with email ${email} has logged in.`,
    };

    try {
      await this.client.emit('send_notification', notificationPayload).toPromise();
    } catch (error) {
      console.error('Error sending notification:', error.message);
    }
  }

  resetPasswordEmail(token: string, id: string): string {
    const resetUrl = `http://your-domain.com/reset-password/${id}/${token}`;
    return emailResetPasswordTemplate(resetUrl)
  }
}
