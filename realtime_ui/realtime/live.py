from socketio.namespace import BaseNamespace
from socketio.mixins import BroadcastMixin


class Namespace(BaseNamespace, BroadcastMixin):
    name = 'ui'
    ui_state = {'rt_button': False}

    def initialize(self):
        self.emit('refresh', self.ui_state)

    def on_click(self):
        print "CLICK!!!"  # DEBUG
        # Toggle state of the button.
        self.ui_state['rt_button'] = not self.ui_state['rt_button']
        # Of the UI state, send only the portion of interest.
        self.broadcast_event_not_me('remote click', {
                'rt_button': self.ui_state['rt_button'],
                })
