var update_button = function(btn, is_active){
    console.log('updating button to state:' + is_active);

    if (is_active) {
        btn.removeClass('active');
    }
    else {
        btn.addClass('active');
    }
}

socket.on('connect', function () {
    alert('connect event received...');
});

socket.on('refresh', function (status){
    alert('UI has been refreshed... all is lost...');
    update_button($('#rt_button'), status.rt_button);
    // etc, etc.
});

socket.on('remote click', function(button_status){
    console.log('remote status:' + button_status);
    update_button($('#rt_button'), button_status.rt_button);
})

// send messages
$(function () {
    $('#rt_button').on('click', function(){
        socket.emit('click');
        update_button($(this), $(this).hasClass('active'));
        return false;
    });
});
