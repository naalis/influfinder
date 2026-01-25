"""Email service"""
from app.config import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailService:
    
    @staticmethod
    async def send_verification_email(email: str, token: str):
        """Enviar email de verificación"""
        verification_url = f"https://influfinder.com/verify-email?token={token}"
        
        subject = "Verifica tu email en Influfinder"
        body = f"""
        <html>
            <body>
                <h2>Bienvenido a Influfinder</h2>
                <p>Para completar tu registro, verifica tu email haciendo clic en el siguiente enlace:</p>
                <a href="{verification_url}">Verificar Email</a>
                <p>Este enlace expira en 24 horas.</p>
            </body>
        </html>
        """
        
        await EmailService._send_email(email, subject, body)
    
    @staticmethod
    async def send_password_reset_email(email: str, token: str):
        """Enviar email para reset de contraseña"""
        reset_url = f"https://influfinder.com/reset-password?token={token}"
        
        subject = "Reset tu contraseña"
        body = f"""
        <html>
            <body>
                <h2>Reset de Contraseña</h2>
                <p>Hiciste una solicitud para resetear tu contraseña. Haz clic en el siguiente enlace:</p>
                <a href="{reset_url}">Resetear Contraseña</a>
                <p>Este enlace expira en 1 hora.</p>
                <p>Si no solicitaste esto, ignora este email.</p>
            </body>
        </html>
        """
        
        await EmailService._send_email(email, subject, body)
    
    @staticmethod
    async def _send_email(to_email: str, subject: str, body: str):
        """Enviar email genérico"""
        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = settings.SMTP_FROM_EMAIL
            message["To"] = to_email
            
            part = MIMEText(body, "html")
            message.attach(part)
            
            with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(settings.SMTP_FROM_EMAIL, to_email, message.as_string())
        
        except Exception as e:
            print(f"Error sending email: {e}")
