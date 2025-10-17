package resources

import (
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
)

func init() {
	utils.RegisterAdminResource("user", models.User{}, []string{"list", "view", "edit", "delete"})
	utils.RegisterAdminResource("organization", models.Organization{}, []string{"list", "view", "edit", "delete"})
	utils.RegisterAdminResource("project", models.Project{}, []string{"list", "view", "edit", "delete"})
	utils.RegisterAdminResource("subscription", models.Subscription{}, []string{"list", "view", "edit"})
	utils.RegisterAdminResource("invitation", models.OrganizationInvitation{}, []string{"list", "view", "delete"})
}

func GetAdminResources(c *gin.Context) {
	utils.H(c, func() {
		utils.RequireAdmin(c)
		
		resources := utils.GetAdminResources()
		result := make(map[string]interface{})
		
		for name, metadata := range resources {
			result[name] = gin.H{
				"name":          metadata.Name,
				"pluralName":    metadata.PluralName,
				"capabilities":  metadata.Capabilities,
				"fields":        metadata.Fields,
				"searchFields":  metadata.SearchFields,
				"displayFields": metadata.DisplayFields,
			}
		}
		
		utils.Respond(c, utils.StatusOK, "", gin.H{"resources": result})
	})
}

func GetAdminResourceData(c *gin.Context) {
	utils.H(c, func() {
		utils.RequireAdmin(c)
		
		resourceName := c.Param("resource")
		items := utils.FetchAdminResourceData(resourceName)
		metadata := utils.GetAdminResource(resourceName)
		
		utils.Respond(c, utils.StatusOK, "", gin.H{
			resourceName + "s": items,
			"metadata":         metadata,
		})
	})
}

func GetAdminStats(c *gin.Context) {
	utils.H(c, func() {
		utils.RequireAdmin(c)
		
		utils.Respond(c, utils.StatusOK, "", gin.H{
			"stats": gin.H{
				"users":          utils.CountAdminResource("user"),
				"organizations":  utils.CountAdminResource("organization"),
				"projects":       utils.CountAdminResource("project"),
				"activeProjects": utils.CountAdminResource("project", "status = ?", "active"),
			},
		})
	})
}
