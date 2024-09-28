
from flask import render_template, url_for, request
from json import dumps
from time import sleep
import random

from flask_app.database import connection
from flask_app.config import email_creds, website_url
from flask_app.socket_connection import socketio
from flask_app.other_func.global_variables import *
from flask_app.other_func.send_email import send_mail
from flask_app.other_func.enc_dec import *


@socketio.on('get_in_touch_details', namespace="/get_in_touch")
def get_dept_users(data_dict):
    try:
        print("Get in Touch query recieved :", data_dict)
        response = {}
        name = f"{data_dict.get('fname')} {data_dict.get('lname')}"
        email = data_dict.get('email')
        description = data_dict.get('description')

        if not name or not email or not description:
            response["value"] = "Missing Values"
            response["category"] = "danger"
        else:
            description = f"Name : {name}\nEmail : {email}\n{description}"
            if send_mail(email_creds["email"],"Query from Website",description):
                response["value"] = "Query sent, We will contact you as soon as possible"
                response["category"] = "success"
            else:
                raise Exception()
    except Exception as e:
        response["value"] = "Server Error, Try Again"
        response["category"] = "danger"
    return dumps(response)

@socketio.on('resend_otp', namespace="/otp")
def resend_otp(url):
    try:
        user_id = url["url"].split('/')[-1]
        if user_id:
            uid = decrypt_fernet(user_id, current_app.secret_key)
            user_details = connection.execute_query(f"select email from users where user_id = {uid}")
            if user_details:
                otp = random.randint(100000, 999999)
                subject = f'''
                        Registration is Successfull
                        Otp for Verification : {otp}
                        Verification link : {website_url}/verify/{user_id}
                    '''
                if send_mail(user_details[0]["email"],"Resend OTP",subject):
                    return 1
    except Exception as e:
        print(e)
    return 0

@socketio.on('adhaar_otp',namespace='/otp')
def adhaar_otp():
    pass

@socketio.on('resend_adhaar_otp',namespace='/otp')
def resend_adhaar_otp():
    pass
