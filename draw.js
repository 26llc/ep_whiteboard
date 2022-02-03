'use strict';

const eejs = require('ep_etherpad-lite/node/eejs/');
let settings = null;

exports.eejsBlock_editbarMenuLeft = (hookName, context) => {
  if (!settings.wboUrl) return;
  context.content += eejs.require('ep_whiteboard/templates/editbarButtons.ejs');
};

exports.clientVars = async (hookName, context) => ({ep_whiteboard: settings});

exports.loadSettings = async (hookName, {settings: {ep_whiteboard, ep_draw}}) => {
  if (!ep_whiteboard && ep_draw) {
    console.warn(
        'The ep_draw object in your settings.json is deprecated. Rename it to ep_whiteboard.');
  }
  settings = {...(ep_whiteboard || ep_draw || {})};
  if (settings.host) {
    if (settings.wboUrl) {
      console.warn('Ignoring deprecated `ep_whiteboard.host` setting.');
    } else {
      console.warn(
          'The `ep_whiteboard.host` setting is deprecated. Set `ep_whiteboard.wboUrl instead.');
      settings.wboUrl = `//${settings.host}`;
    }
  }
  if (!settings.wboUrl) {
    console.warn(
        'ep_whiteboard.wboUrl NOT SET in settings.json. This should be set to the base URL ' +
        '(absolute or relative to a pad) of the WBO server. For example: ' +
        '"ep_whiteboard" {"wboUrl": "https://etherpad.example.com/wbo"}');
  }
};
