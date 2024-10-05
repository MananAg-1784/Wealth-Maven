
from flask import Blueprint, request, url_for, render_template, current_app, redirect, flash, abort, get_flashed_messages, Response, send_file, make_response
from datetime import timedelta
from json import loads, dumps
import random
import requests

from flask_app.database import connection
from flask_app.logger import logger
from flask_app.config import email_creds, website_url
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

@user_login.route('/signin')
def signin():
    user_id = request.cookies.get('auth_id')
    user_id = decrypt_fernet(user_id, current_app.secret_key)
    if user_id:
        return redirect("/accounts")
    response = make_response(render_template('signin.html'))
    response.set_cookie("auth_id", expires= 0)
    return response

@user_login.route('/signup')
def signup():
    user_id = request.cookies.get('auth_id')
    user_id = decrypt_fernet(user_id, current_app.secret_key)
    if user_id:
        return redirect("/accounts")
    response =  make_response(render_template('signup.html'))
    response.set_cookie("auth_id", expires= 0)
    return response

@user_login.route('/verify/<user_id>')
def verify(user_id):
    try:
        user_ = request.cookies.get('auth_id')
        user_ = decrypt_fernet(user_, current_app.secret_key)
        if user_:
            return redirect("/accounts")

        user_id = decrypt_fernet(user_id, current_app.secret_key)
        user_details = connection.execute_query(f"select user_id, otp,email from users where user_id = {user_id}")
        if not user_details :
            return abort(404)

        user_details = user_details[0]
        if not user_details["otp"]:
            flash("Email already verified","success")
            return redirect('/signin')
        
        response = make_response(render_template('verify.html',email = user_details["email"]))
        response.set_cookie("auth_id", expires= 0)
        return response
    except Exception as e:
        return abort(404)

@user_login.route('/logout')
@login_required
def logout(user,**kwargs):
    response = redirect("/signin")
    response.set_cookie('auth_id',expires=0)
    return response

@user_login.route('/signin', methods=["POST"])
def signin_post():
    try:
        email = request.form.get("email")
        password = request.form.get("password")
        if not email or not password:
            flash("Missing Values","danger")
        else:
            user_id = connection.execute_query(f'select user_id,otp,password_hash from users where email = "{email}"')
            if user_id:
                decrypt_pass = decrypt_fernet(user_id[0]["password_hash"],current_app.secret_key)
                if user_id[0]['otp']:
                    flash("Email not Verified","danger")
                elif password == decrypt_pass:
                    response = redirect(f'/accounts')
                    response.set_cookie('auth_id', encrypt_fernet(str(user_id[0]["user_id"]), current_app.secret_key).decode(), max_age=31*60*60*24)
                    return response
                else:
                    flash("Invalid Values","danger")
            else:
                flash("Email is not Registered","danger")
    except:
        flash("Server Error,Try Again","danger")
    return redirect('signin')

@user_login.route('/signup', methods=["POST"])
def signup_post():
    try:
        # Extract form data
        first_name = request.form.get('first-name')
        last_name = request.form.get('last-name')
        email = request.form.get('email')
        password = request.form.get('password')

        if not first_name or not last_name or not email or not password:
            flash("Missing Values","danger")
        else:
            password = str(encrypt_fernet(password, current_app.secret_key).decode())
            otp = random.randint(100000, 999999)

            if connection.execute_query(f"select user_id from users where email = '{email}' "):
                flash("User already exists","danger")
            else:
                connection.execute_query(f'''
                    insert into users(first_name, last_name, password_hash,email, otp) values("{first_name}","{last_name}","{password}","{email}",{otp});
                ''')
                user_id = connection.execute_query(f"select user_id from users where email = '{email}'")
                if user_id:
                    user_id = user_id[0]["user_id"]
                    unique_id = encrypt_fernet(str(user_id), current_app.secret_key).decode()
                    subject = f'''
                        Registration is Successfull
                        Otp for Verification : {otp}
                        Verification link : {website_url}/verify/{unique_id}
                    '''
                    if send_mail(email,"Verification Email link",subject):
                        response = redirect(f'/verify/{unique_id}')
                        flash("Registration Successfull","success")
                        flash("Verification Email Sent Successfully","success")
                        return response
                    else:
                        connection.execute_query(f"delete from users where user_id = {user_id}")
                        raise Exception()
                else:
                    raise Exception()
    except Exception as e:
        print(e)
        flash("Server Error, Try Again","danger")
    return render_template('signup.html')
        
@user_login.route('/verify/<user_id>', methods=["POST"])
def verify_post(user_id):
    email = None
    try:
        user_id = decrypt_fernet(user_id, current_app.secret_key)
        user_details = connection.execute_query(f"select user_id, otp,email, password_hash from users where user_id = {user_id}")
        if not user_details :
            return abort(404)

        email = request.form.get("email")
        password = request.form.get("password")
        otp = request.form.get("otp")
        if not email or not password or not otp:
            flash("Missing Values", "danger")
        else:
            user_details = user_details[0]
            if email == user_details["email"] and password == decrypt_fernet(user_details["password_hash"],current_app.secret_key) and otp == user_details["otp"]:
                print("Verified")
                connection.execute_query(f"update users set otp=null where email = '{email}' ")
                response = redirect(f'/accounts')
                response.set_cookie('auth_id', encrypt_fernet(user_id, current_app.secret_key).decode(), max_age=31*60*60*24)
                return response
            else:
                flash("Invalid Values, Verification unsuccessful","danger")
    except Exception as e:
        print(e)
        flash("Server Error, Try Again","danger")
    return render_template('verify.html',email = email)

@user_login.route('/reset_password/<uid>')
def reset_password():
    pass

@user_login.route('/terms-and-conditions')
def terms_and_conditions():
    return "Terms and Conditions"

@user_login.route('/account_setup')
def account_setup():
    return render_template('acc_setup.html')

@user_login.route('/account_setup', methods=['POST'])
def account_setup_post():
    flash("Otp Missing","danger")
    return redirect("/account_setup")