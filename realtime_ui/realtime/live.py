from socketio.namespace import BaseNamespace
from socketio.mixins import BroadcastMixin


ui_state = {}


class Namespace(BaseNamespace, BroadcastMixin):
    name = 'ui'

    def on_click(self):
        print "CLICK!!!"  # DEBUG

        self.broadcast_event_not_me('remote click')
