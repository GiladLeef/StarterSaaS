package resources

import (
	"fmt"
	"io"
	"net/http"
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
)

func UploadAvatar(c *gin.Context) {
	utils.H(c, func() {
		userID := utils.RequireAuth(c)
		avatarService := &utils.AvatarService{}

		file, header, err := c.Request.FormFile("avatar")
		if err != nil {
			utils.Respond(c, utils.StatusBadRequest, "No file uploaded", nil)
			return
		}
		defer file.Close()

		if header.Size > 5*1024*1024 {
			utils.Respond(c, utils.StatusBadRequest, "File too large (max 5MB)", nil)
			return
		}

		contentType := header.Header.Get("Content-Type")
		if contentType != "image/jpeg" && contentType != "image/png" && contentType != "image/gif" && contentType != "image/webp" {
			utils.Respond(c, utils.StatusBadRequest, "Invalid file type (only jpg, png, gif, webp allowed)", nil)
			return
		}

		fileBytes, err := io.ReadAll(file)
		utils.TryErr(err)

		avatarURL := fmt.Sprintf("data:%s;base64,%s", contentType, utils.EncodeBase64(fileBytes))

		_, err = avatarService.UpdateUserAvatar(userID, avatarURL)
		utils.TryErr(err)

		utils.Respond(c, utils.StatusOK, "Avatar uploaded successfully", gin.H{
			"avatar": avatarURL,
		})
	})
}

func GenerateAvatar(c *gin.Context) {
	utils.H(c, func() {
		userID := utils.RequireAuth(c)
		avatarService := &utils.AvatarService{}

		var req struct {
			Style string `json:"style"`
		}
		utils.TryErr(c.ShouldBindJSON(&req))

		if req.Style == "" {
			req.Style = "avataaars"
		}

		user := utils.Try(utils.ByID[models.User](userID))

		seed := user.Email
		if seed == "" {
			seed = user.ID.String()
		}

		avatarURL := fmt.Sprintf("https://api.dicebear.com/7.x/%s/svg?seed=%s", req.Style, seed)

		resp, err := http.Get(avatarURL)
		if err == nil && resp.StatusCode == 200 {
			defer resp.Body.Close()
			
			svgBytes, err := io.ReadAll(resp.Body)
			if err == nil {
				avatarURL = fmt.Sprintf("data:image/svg+xml;base64,%s", utils.EncodeBase64(svgBytes))
			}
		}

		_, err = avatarService.UpdateUserAvatar(userID, avatarURL)
		utils.TryErr(err)

		utils.Respond(c, utils.StatusOK, "Avatar generated successfully", gin.H{
			"avatar": avatarURL,
		})
	})
}

func DeleteAvatar(c *gin.Context) {
	utils.H(c, func() {
		userID := utils.RequireAuth(c)
		avatarService := &utils.AvatarService{}

		err := avatarService.DeleteUserAvatar(userID)
		utils.TryErr(err)

		utils.Respond(c, utils.StatusOK, "Avatar deleted successfully", nil)
	})
}

