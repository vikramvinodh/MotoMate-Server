import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true
})
export class User extends Document {

  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  /**
   * The full name of the user.
   * 
   * @type {string}
   * @memberof User
   * @required
   */
  @Prop({ required: true })
  name: string;

  /**
   * The unique email address of the user.
   * 
   * @type {string}
   * @memberof User
   * @required
   * @unique
   */
  @Prop({ required: true, unique: true })
  email: string;

  /**
   * The password for the user's account.
   * 
   * @type {string}
   * @memberof User
   * @required
   */
  @Prop({ required: true })
  password: string;

  /**
   * The phone number of the user.
   * 
   * @type {string}
   * @memberof User
   */
  @Prop()
  phoneNumber: string;


  @Prop()
  resetToken: string;

  @Prop()
  resetTokenExpiry: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
