const { VerifyRefreshToken, setAccessToken, setRefreshToken, generateToken } = require('../../utils/functions');
const Controller = require('./controller');
const createError = require('http-errors');
const { StatusCodes: HttpStatus } = require('http-status-codes');
const { validateSignupSchema, validateSigninSchema, validateUpdateProfileSchema, validateChangePasswordSchema } = require('../validators/user/auth.schema');
const path = require('path');
const { UserModel } = require('../../models/user');
const bcrypt = require('bcryptjs');
class UserAuthController extends Controller {
  constructor() {
    super();
  }
  async signup(req, res) {
    await validateSignupSchema(req.body);
    const { name, email, password } = req.body;

    // checking if the user is already in the data base :
    const existedUser = await this.checkUserExist(email);
    if (existedUser) throw createError.BadRequest('کاربری با این ایمیل وجود دارد');

    // HASH PASSWORD :
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.create({
      name: name,
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedEmail === 'arminfaa@gmail.com' ? 'admin' : 'user',
    });

    const accessToken = await generateToken(user, '1d', process.env.ACCESS_TOKEN_SECRET_KEY);
    const refreshToken = await generateToken(user, '1y', process.env.REFRESH_TOKEN_SECRET_KEY);

    await setAccessToken(res, user);
    await setRefreshToken(res, user);

    let WELLCOME_MESSAGE = `ثبت نام با موفقیت انجام شد`;
    const userObj = user?.toJSON ? user.toJSON() : user?.toObject ? user.toObject() : user;

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: WELLCOME_MESSAGE,
        user: userObj || user,
      },
      accessToken,
      refreshToken,
    });
  }
  async signin(req, res) {
    await validateSigninSchema(req.body);
    const { email, password } = req.body;

    // checking if the user is already in the data base :
    const user = await this.checkUserExist(email.toLowerCase());
    if (!user)
      // throw createError.BadRequest("ایمیل یا رمز عبور اشتباه است");
      throw createError.BadRequest('کاربری با این ایمیل وجود ندارد');

    // PASSWORD IS CORRECT :
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) throw createError.BadRequest('ایمیل یا رمز عبور اشتباه است');

    const accessToken = await generateToken(user, '1d', process.env.ACCESS_TOKEN_SECRET_KEY);
    const refreshToken = await generateToken(user, '1y', process.env.REFRESH_TOKEN_SECRET_KEY);

    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    let WELLCOME_MESSAGE = `ورود با موفقیت انجام شد`;
    const userObj = user?.toJSON ? user.toJSON() : user?.toObject ? user.toObject() : { ...user };
    if (userObj && !userObj.role) userObj.role = 'user';

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: WELLCOME_MESSAGE,
        user: userObj || user,
      },
      accessToken,
      refreshToken,
    });
  }
  async updateProfile(req, res) {
    const { _id: userId } = req.user;
    await validateUpdateProfileSchema(req.body);
    const { name, email, biography } = req.body;
    const updateFields = { name, email };
    if (biography !== undefined) updateFields.biography = biography;

    const updateResult = await UserModel.updateOne({ _id: userId }, { $set: updateFields });
    if (updateResult.modifiedCount === 0) throw createError.BadRequest('اطلاعات ویرایش نشد');

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: 'اطلاعات با موفقیت آپدیت شد',
      },
    });
  }
  async changePassword(req, res) {
    const { _id: userId } = req.user;
    await validateChangePasswordSchema(req.body);
    const { currentPassword, newPassword } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) throw createError.NotFound('کاربر یافت نشد');

    const validPass = await bcrypt.compare(currentPassword, user.password);
    if (!validPass) throw createError.BadRequest('رمز عبور فعلی اشتباه است');

    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(newPassword, salt);

    await UserModel.updateOne({ _id: userId }, { $set: { password: hashedPassword } });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: 'رمز عبور با موفقیت تغییر کرد',
      },
    });
  }
  async updateAvatar(req, res) {
    const { _id: userId } = req.user;

    let avatarAddress;

    if (process.env.NODE_ENV === 'production') {
      // Cloudinary returns the URL directly in req.file.path
      if (!req.file || !req.file.path) {
        throw createError.BadRequest('عکس پروفایل آپلود نشد');
      }
      avatarAddress = req.file.path;
    } else {
      // Local storage
      const { fileUploadPath, filename } = req.body;
      if (!fileUploadPath || !filename) {
        throw createError.BadRequest('عکس پروفایل آپلود نشد');
      }
      const fileAddress = path.join(fileUploadPath, filename);
      avatarAddress = fileAddress.replace(/\\/g, '/');
    }

    const updateResult = await UserModel.updateOne(
      { _id: userId },
      {
        $set: { avatar: avatarAddress },
      }
    );
    if (updateResult.modifiedCount === 0) throw createError.BadRequest('عکس پروفایل آپلود نشد');
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: 'عکس پروفایل با موفقیت آپلود شد',
      },
    });
  }
  async getUserProfile(req, res) {
    const { _id: userId } = req.user;
    const user = await UserModel.findById(userId, { otp: 0 });
    const userObj = user?.toJSON ? user.toJSON() : user?.toObject ? user.toObject() : user;
    if (userObj && !userObj.role) userObj.role = 'user';

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        user: userObj || user,
      },
    });
  }
  async getAllUsers(req, res) {
    const requesterRole = req.user?.role;
    const noRoleOrUser = { $or: [{ role: 'user' }, { role: null }, { role: { $exists: false } }] };
    const noRoleOrUserOrAdmin = { $or: [{ role: { $in: ['user', 'admin'] } }, { role: null }, { role: { $exists: false } }] };
    const roleFilter = requesterRole === 'admin' ? noRoleOrUser : requesterRole === 'super_admin' ? noRoleOrUserOrAdmin : {};
    const users = await UserModel.find(roleFilter, { password: 0, resetLink: 0 });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        users,
      },
    });
  }
  async updateUserByAdmin(req, res) {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const targetUser = await UserModel.findById(id);
    if (!targetUser) throw createError.NotFound('کاربر یافت نشد');
    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();
      const existing = await UserModel.findOne({ email: normalizedEmail, _id: { $ne: id } });
      if (existing) throw createError.BadRequest('کاربری با این ایمیل وجود دارد');
      updateFields.email = normalizedEmail;
    }
    if (role !== undefined) {
      if (!['user', 'admin', 'super_admin'].includes(role)) throw createError.BadRequest('نقش نامعتبر است');
      updateFields.role = role;
    }
    if (Object.keys(updateFields).length === 0) throw createError.BadRequest('هیچ فیلدی برای به‌روزرسانی ارسال نشده');
    await UserModel.updateOne({ _id: id }, { $set: updateFields });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { message: 'کاربر با موفقیت به‌روزرسانی شد' },
    });
  }
  async deleteUserByAdmin(req, res) {
    const { id } = req.params;
    const targetUser = await UserModel.findById(id);
    if (!targetUser) throw createError.NotFound('کاربر یافت نشد');
    await UserModel.findByIdAndDelete(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { message: 'کاربر با موفقیت حذف شد' },
    });
  }
  async refreshToken(req, res) {
    const userId = await VerifyRefreshToken(req);
    const user = await UserModel.findById(userId);
    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    return res.status(HttpStatus.OK).json({
      StatusCode: HttpStatus.OK,
      data: {
        user,
      },
    });
  }
  async checkUserExist(email) {
    const user = await UserModel.findOne({ email });
    return user;
  }

  async debugCookies(req, res) {
    try {
      console.log('NODE_ENV:', process.env.NODE_ENV);
      console.log('DOMAIN:', process.env.DOMAIN);
      console.log('All cookies:', req.cookies);
      console.log('Signed cookies:', req.signedCookies);
      console.log('Cookie header:', req.headers.cookie);

      return res.status(200).json({
        statusCode: 200,
        data: {
          nodeEnv: process.env.NODE_ENV,
          domain: process.env.DOMAIN,
          cookies: req.cookies,
          signedCookies: req.signedCookies,
          cookieHeader: req.headers.cookie,
        },
      });
    } catch (error) {
      console.error('Debug error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  logout(req, res) {
    const cookieOptions = {
      maxAge: 1,
      expires: Date.now(),
      httpOnly: false,
      signed: false,
      sameSite: 'Lax',
      secure: false,
      path: '/',
    };
    res.cookie('accessToken', null, cookieOptions);
    res.cookie('refreshToken', null, cookieOptions);

    return res.status(HttpStatus.OK).json({
      StatusCode: HttpStatus.OK,
      auth: false,
    });
  }
}

module.exports = {
  UserAuthController: new UserAuthController(),
};
