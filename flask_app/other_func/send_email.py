import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask_app.config import email_creds

def send_mail(receiver_email, subject, body):
    # Create a MIME object
    msg = MIMEMultipart()
    msg['From'] = email_creds["email"]
    msg['To'] = receiver_email
    msg['Subject'] = subject

    # Attach the body of the email to the MIME object
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Establish a secure session with Gmail's outgoing SMTP server using TLS
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()

        # Login to the server using your credentials
        server.login(email_creds["email"], email_creds["password"])

        # Send the email
        server.send_message(msg)
        print("Email sent successfully!")
        server.quit()
        return True

    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        server.quit()
        return False

