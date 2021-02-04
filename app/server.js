// badly written nodejs app
const http = require('http');
const {Pool} = require('pg');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const logger = require('koa-logger')
const passport = require('koa-passport');
const {Strategy} = require('passport-http-bearer');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const dbUrl = process.env.DATABASE_URL || 'postgres://app:pass@localhost:5432/db';
const pool = new Pool({connectionString: dbUrl});

const app = new Koa();
app.use(logger());
app.use(cors());
app.use(koaBody());

passport.use(new Strategy(async (token, callback) => {
  try {
    const {rows} = await pool.query(`SELECT u.id, u.login, u.name, u.avatar FROM tokens t JOIN users u ON t.userid = u.id WHERE t.id = '${token}'`);
    const [user] = rows;
    if (user === undefined) {
      return callback(null, false);
    }

    return callback(null, user);
  } catch (e) {
    console.error(e);
    return callback(e);
  }
}));
const bearerAuth = passport.authenticate('bearer', {session: false});

const router = new Router();
router.post('/auth', async (ctx, next) => {
  try {
    const {login, password} = ctx.request.body;

    const {rows} = await pool.query(`SELECT u.id, u.login, u.password, u.name, u.avatar FROM users u WHERE u.login = '${login}'`);
    const [user] = rows;

    if (user === undefined) {
      ctx.response.status = 400;
      ctx.response.body = {message: 'user not found'};
      return;
    }

    const result = await bcrypt.compare(password, user.password);
    if (result === false) {
      ctx.response.status = 400;
      ctx.response.body = {message: 'invalid password'};
      return;
    }

    const token = uuid.v4();
    await pool.query(`INSERT INTO tokens (id, userid) VALUES ($1, $2)`, [token, user.id]);
    ctx.response.body = {token};
  } catch (e) {
    console.error(e);
    ctx.response.status = 500;
  }
});

router.use('/private**', bearerAuth);
router.get('/private/me', async (ctx, next) => {
  try {
    const {user} = ctx.state;
    ctx.response.body = {user: {id: user.id, login: user.login, name: user.name, avatar: user.avatar}};
  } catch (e) {
    console.error(e);
    ctx.response.status = 500;
  }
});
router.get('/private/transactions', async (ctx, next) => {
  try {
    const {user} = ctx.state;
    const {rows} = await pool.query(`SELECT t.id, t.amount, t.description, EXTRACT(EPOCH FROM t.created) created FROM transactions t WHERE t.userid = '${user.id}' ORDER BY t.created DESC`);
    ctx.response.body = {transactions: rows};
  } catch (e) {
    console.error(e);
    ctx.response.status = 500;
  }
});
router.get('/health', async (ctx, next) => {
  try {
    await pool.query('SELECT 1');
    ctx.response.status = 200;
  } catch (e) {
    ctx.response.status = 503;
  }
});

app.use(router.routes())
app.use(router.allowedMethods());

const port = process.env.PORT || 9999;
const server = http.createServer(app.callback());
server.listen(port, () => {
  console.log('server started');
});
