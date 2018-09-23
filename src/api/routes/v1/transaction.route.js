import express from 'express'
import validate from 'express-validation'
import multer from 'multer'
import { authorize, ADMIN, LOGGED_USER } from '../../middlewares/auth'
import controller from '../../controllers/transaction.controller'
import userController from '../../controllers/user.controller'

const router = express.Router();
var upload = multer({ dest: './tmp' })

router.param('userId', userController.load);

router.route('/:userId')
  .post(authorize(LOGGED_USER), upload.array('cardImages', 10), controller.create)
  .get(authorize(LOGGED_USER), controller.get)


module.exports = router;
