package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Game struct {
	ID          int      `json:"id"`
	Title       string   `json:"title"`
	Image       string   `json:"image"`
	Price       string   `json:"price"`
	Category    string   `json:"category"`
	ReleaseDate string   `json:"releaseDate"`
	Platforms   []string `json:"platforms"`
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/api/newgame", func(c *gin.Context) {
		games := []Game{
			{ID: 1, Title: "Football Manager 2026", Image: "fm26.jpg", Price: "1,990฿", Category: "Sports", ReleaseDate: "2025-11-01", Platforms: []string{"Steam", "Epic Games"}},
			{ID: 2, Title: "Baldurs Gate 4", Image: "bdl4.jpg", Price: "2,290฿", Category: "RPG", ReleaseDate: "2025-09-15", Platforms: []string{"Steam", "GOG"}},
			{ID: 3, Title: "Like a Snake Alive", Image: "lsa.jpg", Price: "1,790฿", Category: "Action", ReleaseDate: "2025-10-05", Platforms: []string{"Steam", "PS Store"}},
			{ID: 4, Title: "Metal Saga", Image: "metal.jpg", Price: "1,490฿", Category: "Action", ReleaseDate: "2025-08-20", Platforms: []string{"Steam", "Epic Games", "GOG"}},
		}
		c.JSON(http.StatusOK, gin.H{"games": games})
	})

	r.Run(":8080")
}
