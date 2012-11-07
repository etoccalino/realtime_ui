// Helper functions related to DOM manipulation for the UI.

var update_button = function(btn, is_active){
    if (is_active) {
        btn.removeClass('active');
    }
    else {
        btn.addClass('active');
    }
}

var update_carousel = function(carousel_object, slide){
    carousel_object.carousel(slide);
}

var update_ui = function(state){
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
    alert('Updating your UI...');
    update_ui(state);
});

/* ------------------------------------------------------------------- */

// Event handlers.

socket.on('refresh', function (state){
    alert('UI has been refreshed... all is lost...');
    update_ui(state);
});

socket.on('remote slide', function(state){
    update_carousel($('#carousel'), state.slide);
})

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
