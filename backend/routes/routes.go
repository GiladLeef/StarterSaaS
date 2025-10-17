package routes

import (
	"platform/backend/controllers"
	"platform/backend/middleware"
	"platform/backend/resources"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.GET("/health", controllers.Health)

	v1 := r.Group("/api/v1")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/register", resources.Register)
			auth.POST("/login", resources.Login)
			auth.POST("/refresh", resources.RefreshToken)
			auth.POST("/forgot-password", resources.ForgotPassword)
			auth.POST("/reset-password", resources.ResetPassword)
		}

		protected := v1.Group("/")
		protected.Use(middleware.AuthRequired())
		{
			users := protected.Group("/users")
			{
				users.GET("/me", resources.GetCurrentUser)
				users.PUT("/me", resources.UpdateCurrentUser)
				users.DELETE("/me", resources.DeleteCurrentUser)
			}

			orgs := protected.Group("/organizations")
			{
				orgs.GET("", resources.ListOrganizations)
				orgs.POST("", resources.OrganizationHandlers["create"])
				
				orgs.GET("/:id", middleware.RequireOrganizationAccess(), resources.OrganizationHandlers["get"])
				orgs.PUT("/:id", middleware.RequireOrganizationAccess(), resources.OrganizationHandlers["update"])
				orgs.DELETE("/:id", middleware.RequireOrganizationAccess(), resources.OrganizationHandlers["delete"])
			}

			projects := protected.Group("/projects")
			{
				projects.GET("", resources.ListProjects)
				projects.POST("", resources.ProjectHandlers["create"])
				
				projects.GET("/:id", middleware.RequireProjectAccess(), resources.ProjectHandlers["get"])
				projects.PUT("/:id", middleware.RequireProjectAccess(), resources.ProjectHandlers["update"])
				projects.DELETE("/:id", middleware.RequireProjectAccess(), resources.ProjectHandlers["delete"])
			}

			subscriptions := protected.Group("/subscriptions")
			{
				subscriptions.GET("", resources.SubscriptionHandlers["list"])
				subscriptions.GET("/:id", resources.SubscriptionHandlers["get"])
			}

			invitations := protected.Group("/invitations")
			{
				invitations.GET("", resources.ListUserInvitations)
				invitations.POST("", resources.CreateInvitation)
				invitations.POST("/:id/accept", resources.AcceptInvitation)
				invitations.POST("/:id/decline", resources.DeclineInvitation)
			}

			admin := protected.Group("/admin")
			{
				admin.GET("/resources", resources.GetAdminResources)
				admin.GET("/resources/:resource", resources.GetAdminResourceData)
				admin.GET("/stats", resources.GetAdminStats)
			}
		}
	}
}
