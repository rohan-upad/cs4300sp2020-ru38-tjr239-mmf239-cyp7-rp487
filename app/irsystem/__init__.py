from flask import Blueprint

# Define a Blueprint for this module (mchat)
irsystem = Blueprint('irsystem', __name__, url_prefix='/',static_folder='frontend/build/static',template_folder='frontend/build')

# Import all controllers
from .controllers.search_controller import *