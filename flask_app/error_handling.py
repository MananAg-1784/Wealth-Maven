
from flask import Blueprint, abort
error_handler = Blueprint('error_handling', __name__)

@error_handler.app_errorhandler(404)
def not_found(e):
    return '''
        Page Not Found 
        '''

@error_handler.app_errorhandler(400)
def not_found(e):
    return '''
        Bad Request 
        '''

@error_handler.app_errorhandler(401)
def not_found(e):
    return '''
        Access Unauthorised 
        '''

@error_handler.app_errorhandler(403)
def not_found(e):
    return '''
        Access Denied  
    '''

@error_handler.app_errorhandler(500)
def server_error(e):
    return "Server Error <br> Retry after some time ..."

@error_handler.app_errorhandler(405)
def file_not_found():
    return '''
    File Not Found
    '''