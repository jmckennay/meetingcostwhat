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

if(getCookie('attendees')){
    $('[name="attendees"]').val(getCookie('attendees'));
}

if(getCookie('rate')){
    $('[name="rate"]').val(getCookie('rate'));
}


calculateCost();

var loop;
var started = getCookie('started');

if(started!== null){
 var temp = new Date(0);
 started = temp.setUTCMilliseconds(started);   
 start(true);
}

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
    setCookie('started',started,30);
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
    if(!resume){
        started = Date.now();
    }
    calculateCost();

    setCookie('started',started,30);
    setCookie('rate',$('[name="rate"]').val(), 30);
    setCookie('attendees',$('[name="attendees"]').val(), 30);

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
    eraseCookie('started');
    eraseCookie('rate');
    eraseCookie('attendees');
    $('#start, [name="attendees"], [name="rate"]').removeAttr("disabled");
    $('#stop').attr("disabled", true);
    $('.settings').css('max-height', '');
    $('.adjustments').css('max-height', '');
}

function reset() {
    stop();
    $('[name="attendees"]').val(10);
    $('[name="rate"]').val(100);
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}