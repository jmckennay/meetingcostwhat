var costPerMs;
var rate = $('.rate');
var counter = $('.counter');
var timer = $('.timer');
var compare = $('.compare');
var items = [
    ['70c ice creams', 0.70],
    ['bottles of milk', 3.59],
    ['venti cappuccinos', 5.50],
    ["640g buckets of M&M's", 8.00],
    ['Downton Abbey Season 6 Blu-Rays', 25.97],
    ['Amazon Alexas', 79.00],
];

var targetRatio = 0.9;
var viewportWidth = $(window).width();
$(window).resize(function() {
    viewportWidth = $(window).width();
});

calculateCost();

var loop;
var started;

moment.updateLocale('en', {
    relativeTime : {
        past:   "%s",
    }
});

$('button').on('click tap', function() {
    $(this).removeClass('clicked');
    $(window).trigger('resize');
    $(this).addClass('clicked');
});

function addTime(time) {
    started = started - time;
}

function toggleDark() {
    $('body').toggleClass('dark');
}

function calculateCost(){
    costPerMs = ($('[name="rate"]').val() * $('[name="attendees"]').val()) / 60 / 60 / 1000;
    rate.html('at $' + numeral(costPerMs * 1000 * 60).format("0,0.00") + ' per minute');
}

function start(resume){
    $('#start, [name="attendees"], [name="rate"]').attr("disabled", true);
    $('#stop').removeAttr("disabled");
    $('.settings').css('max-height', 0);
    $('.adjustments').css('max-height', '40px');
    counter.css('transform', 'scale(1)')
    clearInterval(loop);
    started = Date.now();
    calculateCost();
    let lastTimerUpdate = Date.now();
    timer.html('for ' + moment(started).fromNow());
    
    loop = 
        setInterval(function() {
            var elapsed = (Date.now() - started);
            var cost =  elapsed * costPerMs;

            counter.html('$' + numeral(cost).format('0,0.00'));
            
            var ratio = counter.innerWidth() / viewportWidth;
            if (ratio > targetRatio) {
                counter.css('transform', 'scale(' + (1 - (ratio - targetRatio)) + ')')
            }

            if (Date.now() - lastTimerUpdate > 1000) {
                lastTimerUpdate = Date.now();
                timer.html('for ' + moment(started).fromNow());
            }

            // if (elapsed % 10000 == 0) {
            //     var arr = $.grep(items, function(item) {
            //     return item[1] < cost;
            //     });
            //     if (arr.length > 0) {
            //         var item = arr[Math.floor(Math.random()*arr.length)];
            //         compare.fadeIn(500).html('(or approx ' + numeral(cost / item[1]).format('0') + ' ' + item[0] + ')').delay(5000).fadeOut(500);
            //     }
            // }
        }, 16);
}

function stop(){
    clearInterval(loop);
    $('#start, [name="attendees"], [name="rate"]').removeAttr("disabled");
    $('#stop').attr("disabled", true);
    $('.settings').css('max-height', '');
    $('.adjustments').css('max-height', '');
}