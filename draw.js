'use strict';

const eejs = require('ep_etherpad-lite/node/eejs/');
let settings = null;

exports.eejsBlock_editbarMenuLeft = (hookName, context) => {
  if (!settings.host) return;
  context.content += eejs.require('ep_whiteboard/templates/editbarButtons.ejs');
};

exports.clientVars = async (hookName, context) => ({ep_whiteboard: settings});

exports.loadSettings = async (hookName, {settings: {ep_whiteboard, ep_draw}}) => {
  if (!ep_whiteboard && ep_draw) {
    console.warn(
        'The ep_draw object in your settings.json is deprecated. Rename it to ep_whiteboard.');
  }
  settings = {...(ep_whiteboard || ep_draw || {})};
  if (!settings.host) {
    console.warn(
        'ep_whiteboard.host NOT SET in settings.json. This must be set to the host name ' +
        '(optionally followed by port and base path) to the WBO server. For example: ' +
        '"ep_whiteboard" {"host": "etherpad.example.com:5001/wbo"}');
  }
};
