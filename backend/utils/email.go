package utils

import (
	"fmt"
	"os"
	"time"

	mail "github.com/xhit/go-simple-mail/v2"
)

// EmailConfig holds SMTP server configuration
type EmailConfig struct {
	SMTPServer   string
	SMTPPort     int
	SMTPUsername string
	SMTPPassword string
	FromEmail    string
	FromName     string
}

// GetEmailConfig loads email configuration from environment variables
func GetEmailConfig() EmailConfig {
	return EmailConfig{
		SMTPServer:   os.Getenv("SMTP_SERVER"),
		SMTPPort:     GetIntEnv("SMTP_PORT", 587),
		SMTPUsername: os.Getenv("SMTP_USERNAME"),
		SMTPPassword: os.Getenv("SMTP_PASSWORD"),
		FromEmail:    os.Getenv("FROM_EMAIL"),
		FromName:     os.Getenv("FROM_NAME"),
	}
}

// GetIntEnv gets an integer from environment variables with a default value
func GetIntEnv(key string, defaultVal int) int {
	val := os.Getenv(key)
	if val == "" {
		return defaultVal
	}
	var result int
	fmt.Sscanf(val, "%d", &result)
	return result
}

// SendPasswordResetEmail sends a password reset email to the user
func SendPasswordResetEmail(email, resetToken, resetURL string) error {
	config := GetEmailConfig()

	// Create a new SMTP client
	server := mail.NewSMTPClient()
	server.Host = config.SMTPServer
	server.Port = config.SMTPPort
	server.Username = config.SMTPUsername
	server.Password = config.SMTPPassword
	server.Encryption = mail.EncryptionSTARTTLS
	server.KeepAlive = false
	server.ConnectTimeout = 10 * time.Second
	server.SendTimeout = 10 * time.Second

	// Connect to the SMTP server
	smtpClient, err := server.Connect()
	if err != nil {
		return err
	}

	// Create a new email message
	email_msg := mail.NewMSG()
	email_msg.SetFrom(fmt.Sprintf("%s <%s>", config.FromName, config.FromEmail))
	email_msg.AddTo(email)
	email_msg.SetSubject("Password Reset Request")

	// Create the email body
	emailBody := fmt.Sprintf(`
		<h1>Password Reset Request</h1>
		<p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
		<p>To reset your password, click the link below:</p>
		<p><a href="%s?token=%s">Reset Password</a></p>
		<p>This link will expire in 1 hour.</p>
		<p>Thank you,<br>The Platform Team</p>
	`, resetURL, resetToken)

	email_msg.SetBody(mail.TextHTML, emailBody)

	// Send the email
	return email_msg.Send(smtpClient)
} 