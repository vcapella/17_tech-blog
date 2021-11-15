const path = require("path");
const express = require("express");
const session = require("express-session");
const routes = require("./controllers");
const exphbs = require("express-handlebars");
const helpers = require("./utils/helpers");
const cookie = require("cookie-parser");

const sequelize = require("./config/connection");
// const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

const sess = {
  secret: "Super ultra secret",
  cookie: { secure: false },
  resave: false,
  saveUninitialized: true,
  // store: new SequelizeStore({
  //   db: sequelize,
  // }),
};
app.use(cookie());
app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public"))); //primeiro argumento e a rota que ele ira expor o conteudo do diretorio, que esta no segundo argumento

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening on 3001"));
});
