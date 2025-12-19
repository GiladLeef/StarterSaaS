package routes

import (
	"platform/backend/controllers"
	"platform/backend/middleware"
	"platform/backend/resources"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.GET("/health", controllers.Health)

	v1 := r.Group("/api/v1")
	{

		v1.GET("/settings/public", resources.GetPublicSettings)

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
				users.POST("/me/avatar", resources.UploadAvatar)
				users.POST("/me/avatar/generate", resources.GenerateAvatar)
				users.DELETE("/me/avatar", resources.DeleteAvatar)
			}

			utils.Route(protected, "/settings", resources.SettingHandlers)

			protected.GET("/settings/all", resources.GetAllSettings)
			protected.PUT("/settings/batch", resources.UpdateSettings)

			admin := protected.Group("/admin")
			{
				admin.GET("/resources", resources.GetAdminResources)
				admin.GET("/resources/:resource", resources.GetAdminResourceData)
				admin.PUT("/resources/:resource/:id", resources.UpdateAdminResource)
				admin.DELETE("/resources/:resource/:id", resources.DeleteAdminResource)
				admin.GET("/stats", resources.GetAdminStats)
			}
		}
	}
}
