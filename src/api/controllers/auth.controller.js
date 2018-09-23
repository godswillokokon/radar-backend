const httpStatus = require('http-status');
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const moment = require('moment-timezone');
const { jwtExpirationInterval } = require('../../config/vars');

/**
* Returns a formated object with tokens
* @private
*/
function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType, accessToken, refreshToken, expiresIn,
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const user = await (new User(req.body)).save();
    const userTransformed = user.transform();
    const token = generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(User.checkDuplicateMobile(error));
  }
};

/**
 * Returns jwt token if valid mobile number and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { mobile, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userMobile: mobile,
      token: refreshToken,
    });
    const { user, accessToken } = await User.findAndGenerateToken({ mobile, refreshObject });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};
