
from flask import Blueprint, request, url_for, render_template, current_app, redirect, flash, abort, get_flashed_messages, Response, send_file,make_response
from datetime import timedelta
from json import loads, dumps
import uuid
import random
import requests

from flask_app.database import connection
from flask_app.logger import logger
from flask_app.other_func.global_variables import *
from flask_app.other_func.authentication import *
from flask_app.other_func.send_email import send_mail
from flask_app.other_func.enc_dec import *

main = Blueprint('main', __name__)

@main.before_request
def before_request_func_main():
    logger.info(
        "URL : %s | method : %s",
        request.path,
        request.method
    )

@main.route('/')
def home_page():
    user_id = request.cookies.get('auth_id')
    user_id = decrypt_fernet(user_id, current_app.secret_key)
    if user_id:
        return redirect("/accounts")
    response =  make_response(render_template('home.html'))
    response.set_cookie("auth_id", expires= 0)
    return response

@main.route('/accounts')
@login_required
def accounts(user,**kwargs):
    return render_template("accounts.html")

