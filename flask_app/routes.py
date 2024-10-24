
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

@main.route('/settings')
@login_required
def settings(user,**kwargs):
    return render_template("others/settings.html")

@main.route('/privacy-policy')
@login_required
def privacy_policy(user,**kwargs):
    return render_template("others/pp.html")

@main.route('/contact')
@login_required
def contact(user,**kwargs):
    return render_template("others/contact.html")

@main.route('/terms-and-conditions')
@login_required
def tc(user,**kwargs):
    return render_template("others/tc.html")


@main.route('/accounts', methods=['GET'])
@login_required
def accounts(user,**kwargs):
    print(user.id, user.email)
    user_details = connection.execute_query(f"select * from users where user_id = {user.id} ")
    account_details = connection.execute_query(f"select * from accounts where account_id = {user.id}")
    if account_details:
        account_details = account_details[0]
    return render_template("accounts.html", user = user_details[0], acc = account_details)

@main.route('/accounts', methods=['POST'])
@login_required
def accounts_add(user,**kwargs):
    
    f_name = request.form.get("first_name")
    l_name = request.form.get("last_name")
    password = request.form.get("password") 
    a = request.form.get("aadhar")
    pan = request.form.get("pan")

    connection.execute_query(f'''
    update users
    set first_name = "{f_name}", last_name = "{l_name}"
    where user_id = {user.id}
    ''')
    if password:
        connection.execute_query(f'''
        update users
        set password_hash = "{str(encrypt_fernet(password, current_app.secret_key))}"
        where user_id = {user.id}
        ''')

    account_details = connection.execute_query(f"select * from accounts where account_id = {user.id}")
    if not account_details:
        connection.execute_query(f'''
        insert into accounts(account_id,account_name, adhaar_card, pan_card)
        values ({user.id},"{f_name}_{l_name}", "{a}","{pan}")
        ''')

    return redirect('/accounts')
    
@main.route('/dashboard')
@login_required
def dashboard(user,**kwargs):
    return render_template("dashboard.html")

@main.route('/insights')
@login_required
def insights(user,**kwargs):
    return render_template("insights.html")

@main.route('/portfolio')
@login_required
def portfolio(user,**kwargs):
    portfolios = connection.execute_query(f"Select * from profiles where account_id = {user.id}")
    return render_template("portfolio.html", portfolios = portfolios)

@main.route('/details', methods=['GET'])
@login_required
def portfolio_details(user,**kwargs):
    return render_template("details.html")

@main.route('/details', methods=['POST'])
@login_required
def details_post(user,**kwargs):
    name = request.form.get("name").replace(' ','_')
    dob = request.form.get("dob")
    amt = int(request.form.get("amt") )
    print(name, dob, amt)
    profile_id = connection.execute_query(f"select profile_id from profiles where account_id = {user.id} and profile_name = '{name}' ")
    if not profile_id:
        connection.execute_query(f"insert into profiles(account_id, profile_name, dob, income) values({user.id},'{name}','{dob}',{amt})")
        profile_id = connection.execute_query(f"select profile_id from profiles where account_id = {user.id} and profile_name = '{name}' ")
        if profile_id : 
            response = redirect("/risk")
            response.set_cookie("profile_id", str(profile_id[0]['profile_id']))
            return response
    else:
        flash("Profile name already exists for the account")
    return redirect('/portfolio')



@main.route('/risk')
@login_required
def risk(user,**kwargs):
    profile_id = request.cookies.get('profile_id')
    if profile_id:
        questions_data = connection.execute_query("SELECT question_id, question FROM risk_questions order by question_id")
        result = []

        for questions in questions_data:
            question_id = questions["question_id"]
            question = questions["question"]

            answers_data = connection.execute_query(f"SELECT answer,answer_id, score FROM risk_answers WHERE question_id = {question_id}")
            options = [answers["answer"] for answers in answers_data]
            scores = {answers["answer"]: answers["score"] for answers in answers_data}
            answer_ids = {answers["answer"]: answers["answer_id"] for answers in answers_data}

            result.append({
                "question_id" : question_id,
                "question": question,
                "options": options,
                "scores": scores,
                "answer_ids" : answer_ids
            })

        return render_template("risk.html", questions = result)
    else:
        flash("The Profile does not exists")
        return redirect("/portfolio")

@main.route('/risk_assessed')
@login_required
def risk_submit(user,**kwargs):
    profile_id = request.cookies.get('profile_id')
    print(profile_id)
    score = request.args.get('score')
    print(score)
    if profile_id:
        answers = []
        for key in request.args:
            if key.startswith('question'):
                # Split the query parameter to get the question_id and answer_id
                question_id, answer_id = request.args.get(key).split(',')
                answers.append({
                    'question_id': int(question_id),
                    'answer_id': int(answer_id)
                })
        
        for i in answers:
            connection.execute_query(f"insert into risk_assessment values({profile_id},{i['question_id']},{i['answer_id']} )")
        connection.execute_query(f"update profiles set risk_score = {score} where profile_id = {profile_id}")
        response = redirect('/portfolio') 
        response.set_cookie("profile_id", expires="")
        return response
    else:
        flash("The Profile does not exists")
    return redirect("/portfolio")
        

