from socketio.namespace import BaseNamespace
from socketio.mixins import BroadcastMixin


ui_state = {}


class Namespace(BaseNamespace, BroadcastMixin):
    name = 'ui'
