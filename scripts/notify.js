(function(){
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// notfiy.js
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

PUBNUB.init(PUBNUB.setup).subscribe({
    channel : PUBNUB.setup.channel,
    message : receiver
});

function receiver(message) {
    // Fire User Event for Receiving Notification
    PUBNUB.events.fire( 'notify.received', message );

    // Display Event
    chrome.notifications.create( 'notify1', opt, function() {
        console.log('created!');
    });
}

var opt = {
    iconUrl   : 'images/icon.png',
    type      : 'basic',
    title     : 'Primary Title',
    message   : 'Primary message to display',
    priority  : 1,
    buttons: [
        { title: 'Call',       iconUrl: 'images/icon.png' },
        { title: 'Send Email', iconUrl: 'images/icon.png' }
    ]
};


})();
