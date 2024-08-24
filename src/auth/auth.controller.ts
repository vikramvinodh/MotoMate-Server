import { Controller, Post, Body, UnauthorizedException, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  /**
   * Authenticates a user based on email and password.
   * If the credentials are valid, returns a JWT token for the user.
   * Otherwise, throws an UnauthorizedException.
   * 
   * @param {Object} loginDto - The login data transfer object containing the user's email and password.
   * @param {string} loginDto.email - The user's email address.
   * @param {string} loginDto.password - The user's password.
   * @returns {Promise<{ access_token: string }>} - A promise that resolves to an object containing the JWT access token.
   * @throws {UnauthorizedException} - If the email or password is incorrect.
   */
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException("Email or Password Incorrect");
    }
    return this.authService.login(user);
  }

  /**
  * Requests a password reset by sending a reset email.
  * 
  * @param {Object} body - The request body containing the user's email.
  * @param {string} body.email - The email address of the user requesting a password reset.
  * @returns {Promise<void>} - A promise that resolves once the email has been sent.
  * @throws {NotFoundException} - If no user with the given email is found.
  */
  @Post('password-reset')
  async requestPasswordReset(@Body() body: { email: string }): Promise<boolean> {
    return await this.authService.requestPasswordReset(body.email);
  }

  /**
   * Resets the password using a valid reset token.
   * 
   * @param {string} userId - The ID of the user whose password is to be reset.
   * @param {string} resetToken - The password reset token.
   * @param {Object} body - The request body containing the new password.
   * @param {string} body.newPassword - The new password to set.
   * @returns {Promise<void>} - A promise that resolves once the password has been reset.
   * @throws {UnauthorizedException} - If the token is invalid or expired.
   */
  @Put('reset-password/:userId/:resetToken')
  async resetPassword(
    @Param('userId') userId: string,
    @Param('resetToken') resetToken: string,
    @Body() body: { newPassword: string }
  ): Promise<boolean> {
    return await this.authService.resetPassword(userId, resetToken, body.newPassword);
  }
}
