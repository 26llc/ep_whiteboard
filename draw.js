'use strict';

const eejs = require('ep_etherpad-lite/node/eejs/');
let settings = null;

exports.eejsBlock_editbarMenuLeft = (hookName, context) => {
  context.content += eejs.require('ep_whiteboard/templates/editbarButtons.ejs');
};

exports.clientVars = async (hookName, context) => ({ep_whiteboard: settings});

exports.loadSettings = async (hookName, {settings: {ep_draw: pluginSettings = {}}}) => {
  if (!pluginSettings.host) {
    console.warn(
        'ep_draw.host NOT SET in settings.json. This must be set to the host name (optionally ' +
        'followed by port and base path) to the WBO server. For example: ' +
        '"ep_draw" {"host": "etherpad.example.com:5001/wbo"}');
  }
  settings = Object.assign({
    host: 'draw.etherpad.org',
    onByDefault: false,
    icon: '../static/plugins/ep_whiteboard/static/img/icon.png',
    position: 'left',
  }, pluginSettings);
};
