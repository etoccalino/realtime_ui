// Helper functions related to DOM manipulation for the UI.

var update_button = function(btn, is_active){
    if (is_active) {
        btn.removeClass('active');
    }
    else {
        btn.addClass('active');
    }
}

var update_ui = function(state){
    update_button($('#rt_button'), state.rt_button);
    // etc, etc.
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

socket.on('remote click', function(button_state){
    update_button($('#rt_button'), button_state.rt_button);
})

/* ------------------------------------------------------------------- */

// Event signals.

$(function () {
    $('#rt_button').on('click', function(){
        socket.emit('click');
        update_button($(this), $(this).hasClass('active'));
        return false;
    });
});
