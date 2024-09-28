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

def login_required(f):
    @wraps(f)
    def authenticate_user(**kwargs):
        user_id = request.cookies.get('auth_id')
        uni = user_id
        if not user_id:
            return redirect('/signin')
        
        user_id = decrypt_fernet(user_id, current_app.secret_key)
        if not user_id:
            return abort(403)

        user_details = connection.execute_query(f"select email, otp from users where user_id = {user_id}")
        if not user_details:
            return abort(403)
        elif user_details[0]["otp"]:
            flash("User not yet Verified")
            return redirect(f"/verify/{uni}")

        user = User(user_details[0]["email"], user_id)
        return f(user=user,**kwargs)
    return authenticate_user
