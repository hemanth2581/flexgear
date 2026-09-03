// backend/src/services/auth.service.ts
import jwt from 'jsonwebtoken';
import { UserModel, UserEntity, UserRole } from '../models/User';
import { ENV } from '../config/environment';
import { OtpService } from './otp.service';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

export class AuthService {
  static generateAppToken(user: UserEntity): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        phone: user.phone || undefined,
        fullName: user.full_name,
        role: user.role,
      },
      ENV.JWT.SECRET,
      { expiresIn: '7d' }
    );
  }

  /**
   * Request OTP for Phone Authentication
   */
  static async requestPhoneOtp(phone: string) {
    if (!phone || phone.trim().length < 8) {
      throw new Error('Please enter a valid phone number with country code (e.g. +91 98765 43210).');
    }
    return await OtpService.sendOtp(phone.trim());
  }

  /**
   * Verify Phone OTP and Synchronize User Profile in Supabase
   */
  static async verifyPhoneOtp(params: {
    phone: string;
    otp: string;
    fullName?: string;
    email?: string;
  }): Promise<{ user: UserEntity; token: string; isNewUser: boolean }> {
    const cleanPhone = params.phone.trim();
    await OtpService.verifyOtp(cleanPhone, params.otp);

    const cleanDigits = cleanPhone.replace(/\D/g, '');
    const isAdminNumber =
      cleanDigits.endsWith('9865986598') ||
      cleanDigits.endsWith('6305269032') ||
      cleanDigits.endsWith('9988776655');

    // Look up existing user by phone
    let user = await UserModel.findByPhone(cleanPhone);
    let isNewUser = false;

    if (!user && params.email) {
      user = await UserModel.findByEmail(params.email);
    }

    if (!user) {
      isNewUser = true;
      const defaultName = params.fullName || (isAdminNumber ? 'Hemanth G (Administrator)' : 'Verified Filmmaker');
      const cleanEmail = params.email?.trim().toLowerCase() || `${cleanDigits}@flexgear.film`;

      user = await UserModel.create({
        full_name: defaultName,
        phone: cleanPhone,
        email: cleanEmail,
        role: isAdminNumber ? 'ADMIN' : 'CUSTOMER',
      });
      logger.info(`[AUTH] Created new profile for phone ${cleanPhone} with role ${user.role}`);
    } else {
      if (isAdminNumber && user.role !== 'ADMIN') {
        user = (await UserModel.update(user.id, { role: 'ADMIN' })) || user;
        logger.info(`[AUTH] Elevated existing user ${user.id} (${cleanPhone}) to ADMIN role`);
      }
      if (params.fullName && user.full_name === 'Verified Filmmaker') {
        user = (await UserModel.update(user.id, { full_name: params.fullName })) || user;
      }
    }

    const token = this.generateAppToken(user);
    return { user, token, isNewUser };
  }

  /**
   * Authenticate / Synchronize with Supabase JWT
   */
  static async verifySupabaseToken(accessToken: string): Promise<{ user: UserEntity; token: string }> {
    try {
      const { data, error } = await supabase.auth.getUser(accessToken);
      if (error || !data.user) {
        throw new Error(error?.message || 'Invalid Supabase authentication token.');
      }

      const sbUser = data.user;
      let user = await UserModel.findById(sbUser.id);

      if (!user && sbUser.email) {
        user = await UserModel.findByEmail(sbUser.email);
      }
      if (!user && sbUser.phone) {
        user = await UserModel.findByPhone(sbUser.phone);
      }

      const cleanPhoneDigits = sbUser.phone ? sbUser.phone.replace(/\D/g, '') : '';
      const isAdmin =
        cleanPhoneDigits.endsWith('9865986598') ||
        cleanPhoneDigits.endsWith('6305269032') ||
        cleanPhoneDigits.endsWith('9988776655');

      if (!user) {
        user = await UserModel.create({
          email: sbUser.email || `${sbUser.id}@flexgear.film`,
          phone: sbUser.phone || undefined,
          full_name: sbUser.user_metadata?.full_name || (isAdmin ? 'Hemanth G (Administrator)' : 'Verified Filmmaker'),
          role: isAdmin ? 'ADMIN' : (sbUser.user_metadata?.role as UserRole) || 'CUSTOMER',
        });
      } else if (isAdmin && user.role !== 'ADMIN') {
        user = (await UserModel.update(user.id, { role: 'ADMIN' })) || user;
      }

      const token = this.generateAppToken(user);
      return { user, token };
    } catch (err: any) {
      throw new Error(err.message || 'Supabase authentication failed.');
    }
  }
}
