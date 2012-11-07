from gevent import monkey
monkey.patch_all()

from optparse import make_option

from django.core.management.base import BaseCommand
from django.utils.importlib import import_module
from django.conf import settings

from socketio import socketio_manage
from socketio.server import SocketIOServer


namespaces = dict()

for app in settings.INSTALLED_APPS:
    try:
        live = import_module('%s.live' % app, 'live')
    except ImportError:
        pass
    else:
        Namespace = live.Namespace
        if hasattr(Namespace, 'name'):
            name = Namespace.name
        else:
            name = app.split('.')[-1]
        namespaces['/' + name] = Namespace


class WithSocketio(object):

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        path = environ['PATH_INFO'].strip('/')

        if path.startswith('socket.io'):
            socketio_manage(environ, namespaces)
        else:
            return self.app(environ, start_response)


###############################################################################


class Command(BaseCommand):
    help = 'Socket.io Server for Django'

    option_list = BaseCommand.option_list + (
        make_option(
            '--port',
            action='store',
            dest='port',
            default=8000,
            type='int',
            help='Port used for incomings socketio requests default to 8000'),
        make_option(
            '--host',
            action='store',
            dest='host',
            default=8000,
            help='Host'),)

    def handle(self, **options):
        import os
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "realtime_ui.settings")

        from django.core.wsgi import get_wsgi_application
        application = get_wsgi_application()

        print
        print 'Listening on port %s:%s' % (options['host'], options['port'])
        print
        SocketIOServer((options['host'], options['port']),
                       WithSocketio(application),
                       resource="socket.io",
                       policy_server=False).serve_forever()
