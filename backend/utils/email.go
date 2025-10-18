package utils

import (
	"fmt"
	"os"
	"strconv"
	"time"

	mail "github.com/xhit/go-simple-mail/v2"
)

type EmailConfig struct {
	SMTPServer   string
	SMTPPort     int
	SMTPUsername string
	SMTPPassword string
	FromEmail    string
	FromName     string
}

func GetEmailConfig() EmailConfig {
	port, _ := strconv.Atoi(os.Getenv("SMTP_PORT"))
	return EmailConfig{
		SMTPServer:   os.Getenv("SMTP_SERVER"),
		SMTPPort:     port,
		SMTPUsername: os.Getenv("SMTP_USERNAME"),
		SMTPPassword: os.Getenv("SMTP_PASSWORD"),
		FromEmail:    os.Getenv("FROM_EMAIL"),
		FromName:     os.Getenv("FROM_NAME"),
	}
}

func SendPasswordResetEmail(email, resetToken, resetURL string) error {
	config := GetEmailConfig()

	server := mail.NewSMTPClient()
	server.Host = config.SMTPServer
	server.Port = config.SMTPPort
	server.Username = config.SMTPUsername
	server.Password = config.SMTPPassword
	server.Encryption = mail.EncryptionSTARTTLS
	server.KeepAlive = false
	server.ConnectTimeout = 10 * time.Second
	server.SendTimeout = 10 * time.Second

	smtpClient, err := server.Connect()
	if err != nil {
		return err
	}

	email_msg := mail.NewMSG()
	email_msg.SetFrom(fmt.Sprintf("%s <%s>", config.FromName, config.FromEmail))
	email_msg.AddTo(email)
	email_msg.SetSubject("Password Reset Request")

	emailBody := fmt.Sprintf(`
		<h1>Password Reset Request</h1>
		<p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
		<p>To reset your password, click the link below:</p>
		<p><a href="%s?token=%s">Reset Password</a></p>
		<p>This link will expire in 1 hour.</p>
		<p>Thank you,<br>The Platform Team</p>
	`, resetURL, resetToken)

	email_msg.SetBody(mail.TextHTML, emailBody)

	return email_msg.Send(smtpClient)
}

func SendPaymentFailedEmail(email string, planName string) error {
	config := GetEmailConfig()

	server := mail.NewSMTPClient()
	server.Host = config.SMTPServer
	server.Port = config.SMTPPort
	server.Username = config.SMTPUsername
	server.Password = config.SMTPPassword
	server.Encryption = mail.EncryptionSTARTTLS
	server.KeepAlive = false
	server.ConnectTimeout = 10 * time.Second
	server.SendTimeout = 10 * time.Second

	smtpClient, err := server.Connect()
	if err != nil {
		fmt.Printf("Failed to send payment failed email: %v\n", err)
		return nil
	}

	email_msg := mail.NewMSG()
	email_msg.SetFrom(fmt.Sprintf("%s <%s>", config.FromName, config.FromEmail))
	email_msg.AddTo(email)
	email_msg.SetSubject("Payment Failed - Action Required")

	emailBody := fmt.Sprintf(`
		<h1>Payment Failed</h1>
		<p>We were unable to process your recent payment for the %s plan.</p>
		<p>Please update your payment method to avoid service interruption.</p>
		<p>If you have any questions, please contact our support team.</p>
		<p>Thank you,<br>The Platform Team</p>
	`, planName)

	email_msg.SetBody(mail.TextHTML, emailBody)

	return email_msg.Send(smtpClient)
}

func SendSubscriptionConfirmationEmail(email string, planName string, billingPeriod string) error {
	config := GetEmailConfig()

	server := mail.NewSMTPClient()
	server.Host = config.SMTPServer
	server.Port = config.SMTPPort
	server.Username = config.SMTPUsername
	server.Password = config.SMTPPassword
	server.Encryption = mail.EncryptionSTARTTLS
	server.KeepAlive = false
	server.ConnectTimeout = 10 * time.Second
	server.SendTimeout = 10 * time.Second

	smtpClient, err := server.Connect()
	if err != nil {
		fmt.Printf("Failed to send subscription confirmation email: %v\n", err)
		return nil
	}

	email_msg := mail.NewMSG()
	email_msg.SetFrom(fmt.Sprintf("%s <%s>", config.FromName, config.FromEmail))
	email_msg.AddTo(email)
	email_msg.SetSubject("Subscription Confirmed")

	emailBody := fmt.Sprintf(`
		<h1>Subscription Confirmed!</h1>
		<p>Thank you for subscribing to the %s plan.</p>
		<p>Billing Period: %s</p>
		<p>Your subscription is now active and you have access to all %s features.</p>
		<p>Thank you,<br>The Platform Team</p>
	`, planName, billingPeriod, planName)

	email_msg.SetBody(mail.TextHTML, emailBody)

	return email_msg.Send(smtpClient)
} 