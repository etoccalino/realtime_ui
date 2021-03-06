from socketio.namespace import BaseNamespace
from socketio.mixins import BroadcastMixin
from django.conf import settings

import gevent
from django.core.cache import cache


# Tune this according to the CACHE settings.
# Too long and you'll lose data; to short and you'll waste resource.
WRITE_BACK_TIMEOUT = settings.CACHES['default']['TIMEOUT'] - 100  # seconds.


class Namespace(BaseNamespace, BroadcastMixin):
    name = 'ui'

    # Set initial state in the cache
    #
    # The cache, like the singleton model instance in the back,
    # is a bag of values. Each entry in the cache corresponds to the
    # state of a control in the UI.
    initial_state = {'slide': 0}

    def cached_state_get(self):
        state = cache.get_many(Namespace.initial_state.keys())
        if not state:
            # Cache has gone stale.
            # This should never happen, due to the persistance daemon's labor.
            # - fetch state back from the database.
            pass
        return state

    def cached_state_set(self, state):
        """Sets both the whole state, or just a partial of it...

        Very useful, but ambiguous."""
        cached_state = self.cached_state_get()
        cached_state.update(state)
        cache.set_many(cached_state)

    # Make the cache an instance property, for automatic write back.
    cached_state = property(cached_state_get, cached_state_set)

    ##########################################################

    def on_ready(self):
        # Send current state of UI to client.
        self.emit('initial', self.cached_state)
        # Send note to all other clients about the new visitor.
        self.broadcast_event_not_me('arrival')

    def on_refresh(self):
        self.cached_state = Namespace.initial_state
        self.broadcast_event('refresh', self.cached_state)

    def on_slide(self, slide):
        """Keep current slide for new clients."""
        # Update the cache.
        self.cached_state = slide
        # Of the UI state, send only the portion of interest.
        self.broadcast_event_not_me('remote slide', slide)


def init_cache():
    """Initialize the state."""
    cache.set_many(Namespace.initial_state)


def persist_cache():
    """Make sure in-memory data is not lost."""
    while True:
        gevent.sleep(WRITE_BACK_TIMEOUT)

        # Spawn a greenlet to create a state model instance,
        # and save it to the database... or... start over!
        gevent.spawn(init_cache)


# Initialize the state.
init_cache()
# Init the persistance daemon.
gevent.spawn(persist_cache)
