# from gevent import monkey
# monkey.patch_all()
# from gevent.pywsgi import WSGIServer
import os
from flask_app import app

basedir = os.path.abspath(os.path.dirname(__file__))
app.secret_key = 'Wealth-Maven'

app.config["DEBUG"] = True
# os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

if __name__ == '__main__':
    print("Starting server...")
    print("http://127.0.0.1:8080")
    # WSGIServer(('0.0.0.0', 8080,), app, log=None).serve_forever()
    app.run(port=8080)