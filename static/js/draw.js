'use strict';

let settings;
let padId;
let enabled = false;
let fullscreen = false;
let visible = false;

const enabledraw = () => {
  const drawHost = settings.host;

  if ($('#draw').length === 0) { // If it's not available already then draw it
    $('#editorcontainer').append(
        $('<div>')
            .attr('id', 'draw')
            .append(
                $('<iframe>')
                    .attr({
                      id: 'drawEmbed',
                      src: `//${drawHost}/boards/${padId}`,
                      width: '100%',
                      height: '100%',
                      frameborder: '0',
                      scrolling: 'no',
                    })
                    .css({
                      border: 'none',
                    })));
  }
  enabled = true;
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
  if (!enabled) {
    enabledraw();

    $('#draw').hover(function () {
      clearTimeout($(this).data('timeout'));
      $('#draw').animate({width: '100%', height: '100%'});
      $('#drawEmbed').animate({width: '100%', height: '100%'});
      fullscreen = true;
    }, function () {
      const t = setTimeout(() => { // Dont zoom out right away, wait a while
        $('#draw').animate({width: '200px', height: '200px'});
        fullscreen = false;
      }, 500);
      $(this).data('timeout', t);
    });
  }
  visible = true;
};

const hidedraw = () => {
  $('#draw').hide();
  fullscreen = false;
  visible = false;
};

const fullScreenDraw = () => {
  fullscreen = true;
  $('#draw').animate({width: '100%', height: '100%'});
};

const toggledraw = () => {
  if (visible && fullscreen) {
    hidedraw();
    return;
  }
  if (!visible) {
    showdraw();
    return;
  }
  if (visible && !fullscreen) {
    fullScreenDraw();
    return;
  }
};

exports.postAceInit = (hookName, {clientVars}) => {
  if (!clientVars) clientVars = window.clientVars; // For compatibility with Etherpad < v1.8.15.
  settings = Object.assign({
    host: null,
    onByDefault: false,
    icon: '../static/plugins/ep_whiteboard/static/img/icon.png',
    position: 'left',
  }, clientVars.ep_whiteboard || {});
  if (!settings.host) return;
  padId = clientVars.padId;
  if (settings.onByDefault) {
    enabledraw();
    showdraw();
  } else {
    $('#draw').hide();
    enabled = false;
    // we don't draw it by default
  }
  $('.toggle_draw').click(() => { toggledraw(); });
  if (settings.icon) {
    $('.draw_icon').css('background-image', `url(${settings.icon})`);
    $('.draw_icon').css({
      height: '16px',
      width: '16px',
    });
  }
  if (settings.position === 'right') $('.draw').parent().prependTo('.menu_right');
};
