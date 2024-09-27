from functools import wraps
from json import loads, dumps
from flask import request, abort, url_for, redirect, current_app
import uuid
import random
import string

# Flask app modules
from flask_app.other_func.global_variables import *
from flask_app.other_func.enc_dec import encrypt_fernet, decrypt_fernet
from flask_app.database import connection
from flask_app.logger import logger

'''
# Authentication decorator
def login_required( request_url = None ):
    def authenticate_user(func):
        @wraps(func)
        def validate_user_id(**kwargs):
            user_id = request.cookies.get('user_id')
            user_id = decrypt_fernet(user_id, current_app.config['SECRET_KEY'])

            # user_id is wrong cannot be decrypted
            if not user_id:
                logger.warning(f"Broken Cookie Value -> {request.cookies.get('user_id')} ")
                return abort(403)
            
            user_data = connection.execute_query(f"select unique_id, email,name,dept_id, privilage from users where unique_id = '{user_id}'")

            # the user_id does not exists in the database
            if not user_data:
                logger.warning(f"Broken Cookie Value -> {request.cookies.get('user_id')} ")
                return abort(403)

            user_data = user_data[0]
            user = create_user_object(user_id)

            # privilage checking
            route = allowed_routes(user.privilage, request_url)
            if not route:
                abort(401)
            return func(user = user, email = user_data["email"], name = user_data["name"], routes = route)

        return validate_user_id
    return authenticate_user
'''