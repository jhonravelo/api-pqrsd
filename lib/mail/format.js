const fs = require('fs');

module.exports = (path, params) => {
  let contents = fs.readFileSync(path, 'utf8');
  for (const property in params) {
    if (!Object.prototype.hasOwnProperty.call(params, property)) {
      continue;
    }

    const value = params[property];

    contents = contents.replace(new RegExp(`{${property}}`, 'g'), value);
  }

  return contents;
};
