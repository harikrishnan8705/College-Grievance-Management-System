const bcrypt = require("bcryptjs");

bcrypt.hash("2005-01-06", 10).then((hash) => {
  console.log(hash);
});