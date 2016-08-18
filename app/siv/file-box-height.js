'use strict';

function fileBoxHeight(numFileBoxes, sidebarHeight) {
  const fileBoxMargin = 10;
  return Math.round((sidebarHeight - ((numFileBoxes + 1) * fileBoxMargin)) /
                    numFileBoxes);
}

module.exports = fileBoxHeight;
