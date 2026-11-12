from apiflask import APIFlask

from Routes import register_routes
from Services import get_instrument


app = APIFlask(__name__, title='Interview Challenge', version='0.1.0')


register_routes(app, get_instrument())
