package resources

import (
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
)

func GetPublicPlans(c *gin.Context) {
	utils.H(c, func() {
		plans := utils.Try(utils.WhereWithOrder[models.Plan]("is_active", true, "sort_order ASC"))

		utils.Respond(c, utils.StatusOK, "Plans retrieved successfully", gin.H{
			"plans": plans,
		})
	})
}

