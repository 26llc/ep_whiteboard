'use strict';

let settings;
let padId;

const enabledraw = () => {
  const authorName = 'Testing';
  const authorColor = $('#myswatch').css('background-color');
  const drawHost = settings.host;

  if ($('#draw').length === 0) { // If it's not available already then draw it
    $('#editorcontainer').append(
        `<div id=draw><iframe id="drawEmbed" src="//${drawHost}/boards/${padId}?authorName=` +
        `${authorName}&authorColor=${authorColor}" width="100%" height="100%" ` +
        'style="border:none" frameborder="0" scrolling="no"></iframe></div>');
  }
  settings.enabled = true;
  showdraw();
};

const showdraw = () => {
  $('#draw').css({
    'z-index': '999999',
    'position': 'absolute',
    'top': '0px',
    'right': '0px',
    'height': '200px',
    'width': '200px',
    'border': '1px solid #ccc',
  }).show();
  $('#drawEmbed').show().css({overflow: 'hidden'});
  if (settings.enabled !== true) {
    enabledraw();

    $('#draw').hover(function () {
      clearTimeout($(this).data('timeout'));
      $('#draw').animate({width: '100%', height: '100%'});
      $('#drawEmbed').animate({width: '100%', height: '100%'});
      settings.fullscreen = true;
    }, function () {
      const t = setTimeout(() => { // Dont zoom out right away, wait a while
        $('#draw').animate({width: '200px', height: '200px'});
        settings.fullscreen = false;
      }, 500);
      $(this).data('timeout', t);
    });
  }
  settings.visible = true;
};

const hidedraw = () => {
  $('#draw').hide();
  settings.fullscreen = false;
  settings.visible = false;
};

const fullScreenDraw = () => {
  settings.fullscreen = true;
  $('#draw').animate({width: '100%', height: '100%'});
};

const toggledraw = () => {
  if (settings.visible === true && settings.fullscreen) {
    hidedraw();
    return;
  }
  if (!settings.visible) {
    showdraw();
    return;
  }
  if (settings.visible === true && !settings.fullscreen) {
    fullScreenDraw();
    return;
  }
};

exports.postAceInit = (hookName, {clientVars}) => {
  if (!clientVars) clientVars = window.clientVars; // For compatibility with Etherpad < v1.8.15.
  settings = clientVars.ep_draw;
  padId = clientVars.padId;
  if (settings) {
    if (settings.onByDefault) { // Setup testing else poop out
      if (settings.onByDefault === 'true') {
        enabledraw();
        showdraw();
      }
    } else {
      $('#draw').hide();
      settings.enabled = false;
      // we don't draw it by default
    }

    $('.toggle_draw').click(() => {
      toggledraw();
    });
  }

  try {
    if (settings.icon) {
      $('.draw_icon').css('background-image', `url(${settings.icon})`);
      $('.draw_icon').css({
        height: '16px',
        width: '16px',
      });
    }
  } catch (err) { /* ignored */ }

  try {
    if (settings.position) {
      if (settings.position === 'right') {
        $('.draw').parent().prependTo('.menu_right');
      }
    }
  } catch (err) { /* ignored */ }
};
