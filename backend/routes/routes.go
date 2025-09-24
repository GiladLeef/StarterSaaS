package routes

import (
	"platform/backend/controllers"
	"platform/backend/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configures all the routes for the application
func SetupRoutes(r *gin.Engine) {
	// Initialize controllers
	healthController := &controllers.HealthController{}
	authController := &controllers.AuthController{}
	userController := &controllers.UserController{}
	orgController := &controllers.OrganizationController{}
	projectController := &controllers.ProjectController{}
	subscriptionController := &controllers.SubscriptionController{}
	invitationController := &controllers.InvitationController{}

	// Health check endpoint
	r.GET("/health", healthController.HealthCheck)

	// API v1 group
	v1 := r.Group("/api/v1")
	{
		// Auth routes
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authController.Register)
			auth.POST("/login", authController.Login)
			auth.POST("/refresh", authController.RefreshToken)
			auth.POST("/forgot-password", authController.ForgotPassword)
			auth.POST("/reset-password", authController.ResetPassword)
		}

		// Protected routes (require authentication)
		protected := v1.Group("/")
		protected.Use(middleware.AuthRequired())
		{
			// User routes
			users := protected.Group("/users")
			{
				users.GET("/me", userController.GetCurrentUser)
				users.PUT("/me", userController.UpdateCurrentUser)
				users.DELETE("/me", userController.DeleteCurrentUser)
			}

			// Organization routes
			orgs := protected.Group("/organizations")
			{
				orgs.GET("", orgController.ListOrganizations)
				orgs.POST("", orgController.CreateOrganization)
				orgs.GET("/:id", orgController.GetOrganization)
				orgs.PUT("/:id", orgController.UpdateOrganization)
				orgs.DELETE("/:id", orgController.DeleteOrganization)
			}

			// Project routes
			projects := protected.Group("/projects")
			{
				projects.GET("", projectController.ListProjects)
				projects.POST("", projectController.CreateProject)
				projects.GET("/:id", projectController.GetProject)
				projects.PUT("/:id", projectController.UpdateProject)
				projects.DELETE("/:id", projectController.DeleteProject)
			}


			// Subscription routes
			subscriptions := protected.Group("/subscriptions")
			{
				subscriptions.GET("", subscriptionController.ListSubscriptions)
				subscriptions.GET("/:id", subscriptionController.GetSubscription)
			}

			// Invitation routes
			invitations := protected.Group("/invitations")
			{
				invitations.GET("", invitationController.ListInvitations)
				invitations.POST("", invitationController.CreateInvitation)
				invitations.POST("/:id/accept", invitationController.AcceptInvitation)
				invitations.POST("/:id/decline", invitationController.DeclineInvitation)
			}
		}
	}
} 