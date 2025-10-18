package resources

import (
	"fmt"
	"platform/backend/models"
	"platform/backend/utils"
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func init() {
	utils.RegisterAdminResource("user", models.User{}, []string{"list", "view", "edit", "delete"})
	utils.RegisterAdminResource("organization", models.Organization{}, []string{"list", "view", "edit", "delete"})
	utils.RegisterAdminResource("project", models.Project{}, []string{"list", "view", "edit", "delete"})
	utils.RegisterAdminResource("subscription", models.Subscription{}, []string{"list", "view", "edit"})
	utils.RegisterAdminResource("invitation", models.OrganizationInvitation{}, []string{"list", "view", "delete"})
	utils.RegisterAdminResource("plan", models.Plan{}, []string{"list", "view", "edit", "create", "delete"})
	utils.RegisterAdminResource("setting", models.Setting{}, []string{"list", "view", "edit", "create", "delete"})
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

func UpdateAdminResource(c *gin.Context) {
	utils.H(c, func() {
		utils.RequireAdmin(c)
		
		resourceName := c.Param("resource")
		id := utils.Try(uuid.Parse(c.Param("id")))
		
		metadata := utils.GetAdminResource(resourceName)
		utils.Check(metadata != nil)
		
		// Get the existing record using DRY utility
		existingPtr := reflect.New(metadata.ModelType)
		utils.TryErr(utils.FindByIDGeneric(existingPtr.Interface(), id))
		
		// Bind the update request
		var updateData map[string]interface{}
		utils.TryErr(c.ShouldBindJSON(&updateData))
		
		// Apply updates using reflection
		existing := existingPtr.Elem()
		for key, value := range updateData {
			if key == "id" || key == "createdAt" || key == "updatedAt" || key == "deletedAt" {
				continue // Skip system fields
			}
			
			field := existing.FieldByName(strings.Title(key))
			if field.IsValid() && field.CanSet() {
				// Convert value to appropriate type
				val := reflect.ValueOf(value)
				if val.Type().ConvertibleTo(field.Type()) {
					field.Set(val.Convert(field.Type()))
				} else if field.Kind() == reflect.String && val.Kind() != reflect.String {
					field.SetString(fmt.Sprint(value))
				}
			}
		}
		
		// Save the updated record using DRY utility
		utils.TryErr(utils.SaveGeneric(existingPtr.Interface()))
		
		utils.Respond(c, utils.StatusOK, resourceName+" updated successfully", gin.H{
			resourceName: existingPtr.Interface(),
		})
	})
}

func DeleteAdminResource(c *gin.Context) {
	utils.H(c, func() {
		utils.RequireAdmin(c)
		
		resourceName := c.Param("resource")
		id := utils.Try(uuid.Parse(c.Param("id")))
		
		metadata := utils.GetAdminResource(resourceName)
		utils.Check(metadata != nil)
		
		// Delete the record using DRY utility
		recordPtr := reflect.New(metadata.ModelType)
		utils.TryErr(utils.DeleteByIDGeneric(recordPtr.Interface(), id))
		
		utils.Respond(c, utils.StatusOK, resourceName+" deleted successfully", nil)
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
