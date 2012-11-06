var activate_button = function(btn){
    if (btn.hasClass('active')) {
        btn.removeClass('active');
    }
    else {
        btn.addClass('active');
    }
}

socket.on('connect', function () {
    alert('connect event received...');
});

socket.on('remote click', function(){
    activate_button($('#rt_button'));
})

// send messages
$(function () {
    $('#rt_button').on('click', function(){
        socket.emit('click');
        activate_button($(this));
        return false;
    });
});
