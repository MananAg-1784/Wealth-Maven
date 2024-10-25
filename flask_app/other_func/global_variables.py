
from json import loads
from flask_app.database import connection
from datetime import datetime
import pytz

class User():
    def __init__(self,email,uni):
        self.id = uni
        self.email = email