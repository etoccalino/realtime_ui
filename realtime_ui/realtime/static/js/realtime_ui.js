var update_button = function(btn, is_active){
    console.log('updating button to state:' + is_active);

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

socket.on('connect', function () {
    alert('connect event received...');
    // Connection has been established with server.
    // Inform that this client is ready to receive current state of UI.
    socket.emit('ready');
});

socket.on('initial', function (state){
    // Receive the current state of the UI, after connecting.
    alert('Updating your UI...');
    update_ui(state);
});

socket.on('refresh', function (state){
    alert('UI has been refreshed... all is lost...');
    update_ui(state);
});

socket.on('remote click', function(button_state){
    console.log('remote state:' + button_state);
    update_button($('#rt_button'), button_state.rt_button);
})

// send messages
$(function () {
    $('#rt_button').on('click', function(){
        socket.emit('click');
        update_button($(this), $(this).hasClass('active'));
        return false;
    });
});
