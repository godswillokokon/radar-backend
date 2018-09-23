import express from 'express'
import validate from 'express-validation'
import { authorize, ADMIN, LOGGED_USER } from '../../middlewares/auth'
import controller from '../../controllers/transaction.controller'

const router = express.Router();

router.route('/')
  .post(authorize(LOGGED_USER), controller.create)
  .get(authorize(LOGGED_USER), controller.get)


module.exports = router;
