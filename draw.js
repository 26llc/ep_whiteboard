'use strict';

const eejs = require('ep_etherpad-lite/node/eejs/');
const settings = require('ep_etherpad-lite/node/utils/Settings');

exports.eejsBlock_editbarMenuLeft = (hookName, context) => {
  context.content += eejs.require('ep_whiteboard/templates/editbarButtons.ejs');
};

exports.clientVars = async (hookName, context) => {
  const draw = {
    host: 'draw.etherpad.org',
    onByDefault: false,
    icon: '../static/plugins/ep_whiteboard/static/img/icon.png',
    position: 'right',
  };

  try {
    if (!settings.ep_draw.host) throw new Error('missing host setting');
    draw.host = settings.ep_draw.host;
  } catch (e) {
    console.warn(
        'ep_whiteboard.host NOT SET in settings.json.  The requirement is the host of the ' +
        'etherdraw service IE draw.etherpad.org, copy/paste value to settings.json --  ' +
        '"ep_draw" {"host": "your.etherdrawhost.com"}');
  }

  try {
    draw.onByDefault = !!settings.ep_draw.onByDefault;
  } catch (err) { /* ignored */ }

  try {
    if (settings.ep_draw.icon) draw.icon = settings.ep_draw.icon;
  } catch (err) { /* ignored */ }

  try {
    draw.position = settings.ep_draw.position || 'left';
  } catch (err) { /* ignored */ }

  return {ep_draw: draw};
};
