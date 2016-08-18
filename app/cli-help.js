'use strict';

const Table = require('cli-table2');

module.exports = logHelp;

function logHelp (versionNumber) {
  const version = `SIV v${versionNumber}\n`;
  const usage = `Usage: "" (options) path1 path2 ...\n`;
  const description = [`SIV accepts paths to folders or image files. To open`,
                       `multiple paths enter them one after another`,
                       `with a space between each path.`].join('\n');
  const options = new Table({
    head: ['Options', 'Description'],
    colWidths: [15, 50],
    chars: {
      'top': '-', 'top-mid': '+', 'top-left': '+', 'top-right': '+',
      'bottom': '-', 'bottom-mid': '+', 'bottom-left': '+', 'bottom-right': '+',
      'left': '|', 'left-mid': '+', 'mid': '-', 'mid-mid': '+',
      'right': '|', 'right-mid': '+', 'middle': '|'
    }
  });
  options.push(['--help', 'Show this message and exit.'],
               ['--singleFile', ["Opens all image files under the path's folder.",
                                 'Ignores all but the first provided path.'].join('\n')],
               ['--start', "Start SIV, log in, don't open any windows."],
               ['--calc', "Open SIV's calculator."],
               ['--quit', "Shutdown SIV"],
               ['--devTools', 'Open dev tools in each window.']);
  process.stdout.write(version);
  process.stdout.write(usage);
  process.stdout.write('\n');
  process.stdout.write(description);
  process.stdout.write('\n\n');
  process.stdout.write(options.toString());
  process.stdout.write('\n');
}
