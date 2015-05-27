document.addEventListener("keydown", function(e) {
  if (e.keyCode == 13) {
    toggleFullScreen();
  }
}, false);

function toggleFullScreen() {
  if (!document.fullscreenElement &&
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}


var inactiveColor = '#666';

var colors = [
  {
    primary   : '#f00',
    secondary : '#ff7800'
  },
  {
    primary   : '#4498ff',
    secondary : '#0084ff'
  },
];



$(function() {


//PLAYER 1 GAUGES

  drawRadialGauge({
    selector : '#p1speed',
    label : 'speed',
    clockwise : true,
    gaugeLength : 32,
    barWidth : 3.5, //em
    barHeight : 10 //em
  });

  drawRadialGauge({
    selector : '#p1rpm',
    label : 'rpm',
    clockwise : true,
    gaugeLength : 32,
    barWidth : 3.5, //em
    barHeight : 10 //em
  });

  drawLinearGauge({
    selector : '#p1turbo',
    label : 'turbo',
    gaugeLength : 17,
    barWidth : 1.03, //em
    barHeight : 2, //em
    barSpacing : 0.25
  });

  drawLinearGauge({
    selector : '#p1fuel',
    label : 'fuel',
    gaugeLength : 8,
    barWidth : 2.4, //em
    barHeight : 2, //em
    barSpacing : 0.25
  });

  drawGearGauge({
    selector : '#p1gear',
    label : 'gear',
    gaugeLength : 6,
    barWidth : 2.4, //em
    barHeight : 2, //em
    barSpacing : 0.25
  });

//PLAYER 2 GAUGES

  drawRadialGauge({
    selector : '#p2speed',
    label : 'speed',
    clockwise : true,
    gaugeLength : 32,
    barWidth : 3.5, //em
    barHeight : 10 //em
  });

  drawRadialGauge({
    selector : '#p2rpm',
    label : 'rpm',
    clockwise : true,
    gaugeLength : 32,
    barWidth : 3.5, //em
    barHeight : 10 //em
  });

  drawLinearGauge({
    selector : '#p2turbo',
    label : 'turbo',
    gaugeLength : 17,
    barWidth : 1.03, //em
    barHeight : 2, //em
    barSpacing : 0.25
  });

  drawLinearGauge({
    selector : '#p2fuel',
    label : 'fuel',
    gaugeLength : 8,
    barWidth : 2.4, //em
    barHeight : 2, //em
    barSpacing : 0.25
  });

  drawGearGauge({
    selector : '#p2gear',
    label : 'gear',
    gaugeLength : 6,
    barWidth : 2.4, //em
    barHeight : 2, //em
    barSpacing : 0.25
  });





});

function drawRadialGauge(stats) {

  var $gauge = $(stats.selector+' .gauge');
  var $label = $(stats.selector+' .label');

  $label.html(stats.label);

  for (var i = 1; i < stats.gaugeLength+1; i++) {

    var x = '<div class="bar"><div class="fill"></div></div>';
    $gauge.append(x);


    var barWidth = stats.barWidth*0.1;
    var barHeight = stats.barHeight;
    var fillHeight = (i*i)/i*0.1+3;
    var pitch = (i*i)/i*4.65;

    $gauge.find('.bar').eq(i-1).css({
      'height' : barHeight+'em',
      'width' : barWidth+'em',
      'transform' : 'rotateZ('+pitch+'deg)'
    });

    $gauge.find('.bar .fill').eq(i-1).css({
      'height' : fillHeight+'em'
    });


  };

}

function drawLinearGauge(stats) {

  var $gauge = $(stats.selector+' .gauge');
  var $label = $(stats.selector+' .label');

  $label.html(stats.label);

  //$label.html('<div class="text">'+stats.label+'</div><div class="outline">'+stats.label+'</div>');

  for (var i = 1; i < stats.gaugeLength+1; i++) {

    var x = '<div class="bar"><div class="fill"></div></div>';

    $gauge.append(x);

    var barWidth = stats.barWidth;
    var barHeight = stats.barHeight;
    var barSpacing = barWidth+stats.barSpacing
    //var fillHeight = (i*i)/i*0.1+3;

    $gauge.find('.bar').eq(i-1).css({
      'height' : barHeight+'em',
      'width' : barWidth+'em',
      'left' : barSpacing*i-barSpacing+'em' //subtract one width from start
    });

    // $gauge.find('.bar'+i+' .fill').css({
    //   'height' : fillHeight+'em'
    // });

  };

}

function drawGearGauge(stats) {

  var $gauge = $(stats.selector+' .gauge');
  var $label = $(stats.selector+' .label');

  $label.html(stats.label);

  for (var i = 1; i < stats.gaugeLength+1; i++) {

    var x = '<div class="bar"><div class="fill">'+i+'</div></div>';

    $gauge.append(x);

    var barWidth = stats.barWidth;
    var barHeight = stats.barHeight;
    var barSpacing = barWidth+stats.barSpacing

    $gauge.find('.bar').eq(i-1).css({
      'height' : barHeight+'em',
      'width' : barWidth+'em',
      'left' : barSpacing*i-barSpacing+'em' //subtract one width from start
    });

  };

}



function updateRpm(player,value) {

  var $el = $('.pRPM').eq(player);
  var maxValue = $el.data('max');
  var $bars = $el.find('.bar .fill');

  $bars.css({
    'backgroundColor': inactiveColor
  });


  var fullBars = Math.round( value / maxValue*$bars.length );

  for (var i = 0; i < fullBars; i++) {
    $bars.eq(i).css({
      'backgroundColor': colors[player].primary
    });
  };

  $el.children('.value').text(value);

}


//DUMMY UPDATER/SOCKET DATA
setInterval(function(){

  var rpm1 = Math.random()*9;
      rpm1 = rpm1.toFixed(1);

  var rpm2 = Math.random()*9;
      rpm2 = rpm2.toFixed(1);




  updateRpm(0,rpm1);
  updateRpm(1,rpm2);

}, 100);

//updateSpeed(player<NUM>,value<NUM>);
//updateTurbo(player<NUM>,value<NUM>);
//updatePosition(player<NUM>,value<NUM>);
//updateGear(player<NUM>,value<NUM>);
//updateLap(player<NUM>,value<NUM>); //way to get lap length?
//updatePhysics(player<NUM>,values<OBJECT?>);
