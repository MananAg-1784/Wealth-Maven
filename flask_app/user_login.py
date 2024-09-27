
from flask import Blueprint, request, url_for, render_template, current_app, redirect, flash, abort, get_flashed_messages, Response, send_file
from datetime import timedelta
from json import loads, dumps
import uuid
import random
import requests

from flask_app.database import connection
from flask_app.logger import logger
from flask_app.config import email_creds
from flask_app.other_func.global_variables import *
from flask_app.other_func.authentication import *
from flask_app.other_func.send_email import send_mail
from flask_app.other_func.enc_dec import *

user_login = Blueprint('user_login', __name__)

@user_login.before_request
def before_request_func_userLogin():
    logger.info(
        "URL : %s | method : %s",
        request.path,
        request.method
    )


@user_login.route('/get_in_touch',methods=['POST'])
def get_in_touch():
    try:
        name = f"{request.form.get('fname')} {request.form.get('lname')}"
        email = request.form.get('email')
        description = request.form.get('description')

        if not name or not email or not description:
            flash("Missing values")
        else:
            description = f"Name : {name}\nEmail : {email}\n{description}"
            flash("Verfication Successfull, You can now Login",'success')
            if send_mail(email_creds["email"],"Query from Website",description):
                flash("Query Recorded, We will get in touch as soon as possible","success")
            else:
                raise Exception()
    except Exception as e:
        flash("Server Error, Try Again",'danger')
    return redirect('/')

@user_login.route('/signin')
def signin():
    return render_template('signin.html')

@user_login.route('/signup')
def signup():
    return render_template('signup.html')

@user_login.route('/verify')
def verify():
    return render_template('verify.html')

@user_login.route('logout')
@login_required()
def logout():
    return redirect('/')

@user_login.route('/signin', method=["POST"])
def signin_post():
    return render_template('signin.html')

@user_login.route('/signup', method=["POST"])
def signup_post():
    return render_template('signup.html')

@user_login.route('/verify', method=["POST"])
def verify_post():
    return render_template('verify.html')

@user_login.route('/terms-and-conditions')
def terms_and_conditions():
    return "Terms and Conditions"
