const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(
  __dirname,
  '..',
  'renderer',
  'assets',
  'screenshots'
);
const themeDir = path.join(__dirname, '..', 'themes');

const themeNames = fs.readdirSync(themeDir);

themeNames
  .map((themeName) => path.basename(themeName, '.yml'))
  .forEach((themeName) => {
    let nm = themeName;
    if (fs.existsSync(path.join(screenshotDir, nm + '.png'))) {
      return;
    }
    // nm = themeName.toLowerCase().replace(/ /g, '_');
    // if (fs.existsSync(path.join(screenshotDir, nm + '.png'))) {
    //   fs.renameSync(
    //     path.join(screenshotDir, nm + '.png'),
    //     path.join(screenshotDir, themeName + '.png')
    //   );
    //   return;
    // }
    // nm = themeName
    //   .trim()
    //   .split(/(?=[A-Z])/)
    //   .join('_')
    //   .toLowerCase();
    // if (fs.existsSync(path.join(screenshotDir, nm + '.png'))) {
    //   fs.renameSync(
    //     path.join(screenshotDir, nm + '.png'),
    //     path.join(screenshotDir, themeName + '.png')
    //   );
    //   return;
    // }
    console.error(path.basename(nm));
  });
