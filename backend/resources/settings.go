package resources

import (
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateSettingRequest struct {
	Key      string `json:"key" binding:"required"`
	Value    string `json:"value"`
	Category string `json:"category"`
	IsPublic bool   `json:"isPublic"`
}

type UpdateSettingRequest struct {
	Value    *string `json:"value"`
	Category *string `json:"category"`
	IsPublic *bool   `json:"isPublic"`
}

func createSettingFactory(req *CreateSettingRequest, userID uuid.UUID) *models.Setting {
	return &models.Setting{
		Key:      req.Key,
		Value:    req.Value,
		Category: req.Category,
		IsPublic: req.IsPublic,
	}
}

var SettingHandlers = utils.Crud[models.Setting, CreateSettingRequest, UpdateSettingRequest](
	"setting",
	createSettingFactory,
)

func GetPublicSettings(c *gin.Context) {
	utils.H(c, func() {
		settings, err := utils.WhereMultipleList[models.Setting](map[string]any{"is_public": true})
		utils.TryErr(err)

		settingsMap := make(map[string]string)
		for _, setting := range settings {
			settingsMap[setting.Key] = setting.Value
		}

		utils.Respond(c, utils.StatusOK, "Public settings retrieved", gin.H{
			"settings": settingsMap,
		})
	})
}

func GetAllSettings(c *gin.Context) {
	utils.H(c, func() {
		utils.RequireAdmin(c)

		settings := utils.Try(utils.All[models.Setting]())

		// Convert to map for easy frontend consumption
		settingsMap := make(map[string]string)
		for _, setting := range settings {
			settingsMap[setting.Key] = setting.Value
		}

		utils.Respond(c, utils.StatusOK, "Settings retrieved", gin.H{
			"settings": settingsMap,
		})
	})
}

func UpdateSettings(c *gin.Context) {
	utils.H(c, func() {
		utils.RequireAdmin(c)

		var req map[string]string
		utils.TryErr(c.ShouldBindJSON(&req))

		for key, value := range req {
			setting, err := utils.Where[models.Setting]("key", key)
			
			if err != nil {
				setting = models.Setting{
					Key:      key,
					Value:    value,
					Category: "general",
					IsPublic: true,
				}
				utils.TryErr(utils.Create(&setting))
			} else {
				setting.Value = value
				utils.TryErr(utils.Save(&setting))
			}
		}

		utils.Respond(c, utils.StatusOK, "Settings updated successfully", nil)
	})
}

