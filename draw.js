'use strict';

const eejs = require('ep_etherpad-lite/node/eejs/');
let settings = null;

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
    if (!settings.host) throw new Error('missing host setting');
    draw.host = settings.host;
  } catch (e) {
    console.warn(
        'ep_whiteboard.host NOT SET in settings.json.  The requirement is the host of the ' +
        'etherdraw service IE draw.etherpad.org, copy/paste value to settings.json --  ' +
        '"ep_draw" {"host": "your.etherdrawhost.com"}');
  }

  try {
    draw.onByDefault = !!settings.onByDefault;
  } catch (err) { /* ignored */ }

  try {
    if (settings.icon) draw.icon = settings.icon;
  } catch (err) { /* ignored */ }

  try {
    draw.position = settings.position || 'left';
  } catch (err) { /* ignored */ }

  return {ep_whiteboard: draw};
};

exports.loadSettings = async (hookName, {settings: {ep_draw: pluginSettings = {}}}) => {
  settings = pluginSettings;
};
