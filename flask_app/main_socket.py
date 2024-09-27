
from flask import render_template, url_for, request
from json import dumps
from time import sleep
from io import BytesIO
import openpyxl
import threading

from flask_app.database import connection
from flask_app.socket_connection import socketio
from flask_app.other_func.global_variables import *

'''
@socketio.on('dept_users', namespace="/profile")
@validate_user_access
def get_dept_users(data_dict, **kwargs):
    try:
        privilage = kwargs.get('user').privilage
        user_dept = connection.execute_query(f'select dept_id from department where dept_name = "{ kwargs.get("user").dept}" ')
        user_dept = user_dept[0]['dept_id'] if user_dept else None

        if privilage == 'admin':
            # all the users that are under the admins department
            response = {}
            response['dept_users'] = []
            data = connection.execute_query(f'select unique_id,email,name, privilage from users where dept_id = "{user_dept}" ')
            if data:
                for _ in data:
                    if _['email'] != data_dict['email']:
                        response['dept_users'].append( {
                            'name' : _['name'],
                            'email' : _['email'],
                            'privilage' : _['privilage']
                        } )   
            response['available-privs'] = list(priv.keys())
            response['dept_users'] = render_template('profile/dept_users.html', dept_users = response['dept_users'], available_privs = response['available-privs'])
            return response
        else:
            return None
    except Exception as e:
        print("Exception while getting dept_users", e)
        return None
 
'''