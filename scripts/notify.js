(function(){
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// notfiy.js
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var notify = window.notify = {
    on    : {},
    event : {
        message : function(){},
        click   : function(){},
        button  : function(){},
        closed  : function(){}
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Populate Event Bindings
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
PUBNUB.each( notify.events, function(event) {
    notify.on[event] = function(cb) {
        notify.event[event] = cb || function(){};
    };
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Initialize PubNub Broadcast Receiver
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
PUBNUB(PUBNUB.setup).subscribe({
    channel : PUBNUB.setup.channel,
    message : receiver
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Receiver of Remote Broadcast Events
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function receiver(message) {
    // Fire User Event for Receiving Notification
    notify.event.message(message);

    // Is a Desktop Notification?
    if (!('id' in message && 'options' in message)) return;

    // Display Desktop Notification
    chrome.notifications.create( message.id, message.options, function() {
        PUBNUB.events.fire( 'notify.created', message );
    });
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// User Clicked on a Button inside the Desktop Notification
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
chrome.notifications.onButtonClicked.addListener(function( id, btn ){
    notify.event.button({ id : id, button : btn });
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Desktop Notification Displayed to the User
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
chrome.notifications.onDisplayed.addListener(function(id){
    notify.event.display({ id : id });
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// User Clicked on the Desktop Notification
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
chrome.notifications.onClicked.addListener(function(id){
    notify.event.display({ id : id });
});


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// User Closed the Desktop Notification
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
notify.on.closed(function(data){
    console.log(data);
});

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
