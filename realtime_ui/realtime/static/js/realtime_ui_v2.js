// Helper functions related to DOM manipulation for the UI.

function alert_message(message){
    // a 'message' is an object with title and description.
    $('#alert .title').text(message.title);
    $('#alert .description').text(message.description);
    $('#alert').slideDown(300).delay(2000).slideUp(500);
}

function update_button(btn, is_active){
    if (is_active) {
        btn.removeClass('active');
    }
    else {
        btn.addClass('active');
    }
}

function update_carousel(carousel_object, slide){
    carousel_object.carousel(slide);
}

function update_ui(state){
    update_carousel($('#carousel'), state.slide);
    // ...and all other controls.
}

/* ------------------------------------------------------------------- */

// Event handlers for the three-step handshake.
//
// First and third part are take place in the clien.
// Second part takes part in the server.
// There's also a "zero" part, which is produced automatically by
// the socke.io mechanism (we pick up at the "connect" event).

socket.on('connect', function () {
    // Connection has been established with server.
    // Inform that this client is ready to receive current state of UI.
    //
    // First part of a silly handshake; I suppose I'll learn to avoid it.
    socket.emit('ready');
});

socket.on('initial', function (state){
    // Receive the current state of the UI, after connecting.
    //
    // Second part of a silly handshake; I suppose I'll learn to avoid it.
    alert_message({
        title: '',
        description: 'Updating your UI...'
    });
    update_ui(state);
});

socket.on('disconnect', function(){
    alert_message({
        title: 'Disconnected from the server!',
        description: 'Will try to reconnect now... be patient, please.',
    });
    console.log('disconnected.');
    $.blockUI({ message: null });
});
socket.on('reconnecting', function(){
    console.log('...trying to reconnect...');
});
socket.on('reconnect', function(){
    console.log('reconnected.');
    $.unblockUI();
});

/* ------------------------------------------------------------------- */

// Event handlers.

socket.on('refresh', function (state){
    alert_message({
        title: 'All is lost...',
        description: "UI has been refreshed..."
    });
    update_ui(state);
});

socket.on('remote slide', function(state){
    update_carousel($('#carousel'), state.slide);
});

socket.on('arrival', function(){
    alert_message({
        title: 'New arrival...',
        description: 'somebody else is operating the UI too.'
    });
});

/* ------------------------------------------------------------------- */

// Event signals.

$(function () {
    var $carousel = $('#carousel');                       // The carousel jQuery object.
    var $items = $('#carousel div.carousel-inner .item'); // An array of jQuer objects, each a carousel item.
    var self_slide = false;                               // Flag to mark local slides (not remote slides).

    $carousel.carousel( {interval: false} );

    $carousel.bind('slid', function(){
        // Propagate the local slide among all other clients.
        if (self_slide){
            var ix = $('div.carousel-inner div.item').index( $('div.item.active') );
            console.log('Slid to ' + ix);
            socket.emit('slide', {slide: ix});

            self_slide = false;
        }
    });
    $('#carousel a.left').on('click', function(){
        self_slide = true;
    });
    $('#carousel a.right').on('click', function(){
        self_slide = true;
    });

});
