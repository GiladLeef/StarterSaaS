package routes

import (
	"platform/backend/controllers"
	"platform/backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	healthController := &controllers.HealthController{}
	authController := &controllers.AuthController{}
	userController := &controllers.UserController{}
	orgController := &controllers.OrganizationController{}
	projectController := &controllers.ProjectController{}
	subscriptionController := &controllers.SubscriptionController{}
	invitationController := &controllers.InvitationController{}

	r.GET("/health", healthController.HealthCheck)

	v1 := r.Group("/api/v1")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authController.Register)
			auth.POST("/login", authController.Login)
			auth.POST("/refresh", authController.RefreshToken)
			auth.POST("/forgot-password", authController.ForgotPassword)
			auth.POST("/reset-password", authController.ResetPassword)
		}

		protected := v1.Group("/")
		protected.Use(middleware.AuthRequired())
		{
			users := protected.Group("/users")
			{
				users.GET("/me", userController.GetCurrentUser)
				users.PUT("/me", userController.UpdateCurrentUser)
				users.DELETE("/me", userController.DeleteCurrentUser)
			}

			orgs := protected.Group("/organizations")
			{
				orgs.GET("", orgController.ListOrganizations)
				orgs.POST("", orgController.CreateOrganization)
				
				orgs.GET("/:id", middleware.RequireOrganizationAccess(), orgController.GetOrganization)
				orgs.PUT("/:id", middleware.RequireOrganizationAccess(), orgController.UpdateOrganization)
				orgs.DELETE("/:id", middleware.RequireOrganizationAccess(), orgController.DeleteOrganization)
			}

			projects := protected.Group("/projects")
			{
				projects.GET("", projectController.ListProjects)
				projects.POST("", projectController.CreateProject)
				
				projects.GET("/:id", middleware.RequireProjectAccess(), projectController.GetProject)
				projects.PUT("/:id", middleware.RequireProjectAccess(), projectController.UpdateProject)
				projects.DELETE("/:id", middleware.RequireProjectAccess(), projectController.DeleteProject)
			}


			subscriptions := protected.Group("/subscriptions")
			{
				subscriptions.GET("", subscriptionController.ListSubscriptions)
				subscriptions.GET("/:id", subscriptionController.GetSubscription)
			}

			invitations := protected.Group("/invitations")
			{
				invitations.GET("", invitationController.ListUserInvitations)
				invitations.POST("", invitationController.CreateInvitation)
				invitations.POST("/:id/accept", invitationController.AcceptInvitation)
				invitations.POST("/:id/decline", invitationController.DeclineInvitation)
			}
		}
	}
} 