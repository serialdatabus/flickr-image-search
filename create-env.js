const fs = require('fs');
const path = `./.env`;
const vars = `
 REACT_APP_API_KEY=${process.env.API_KEY}
`;
fs.writeFileSync(path, vars);