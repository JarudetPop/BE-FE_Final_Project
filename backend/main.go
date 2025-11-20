package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

// Database connection
var db *sql.DB

// Models
type User struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	IsAdmin   bool      `json:"is_admin"`
	CreatedAt time.Time `json:"created_at"`
}

type Game struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Price     float64   `json:"price"`
	Category  string    `json:"category"`
	Platforms []string  `json:"platforms"`
	ReleaseDate string   `json:"release_date"`
	ImageURL  sql.NullString `json:"image_url"`
	CreatedBy int       `json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
}

// Custom JSON marshaling for Game to handle NULL image_url
func (g Game) MarshalJSON() ([]byte, error) {
	type GameAlias Game
	return json.Marshal(&struct {
		ImageURL string `json:"image_url"`
		*GameAlias
	}{
		ImageURL: g.ImageURL.String,
		GameAlias: (*GameAlias)(&g),
	})
}

// Custom JSON unmarshaling for Game to handle image_url
func (g *Game) UnmarshalJSON(data []byte) error {
	type GameAlias Game
	aux := &struct {
		ImageURL string `json:"image_url"`
		*GameAlias
	}{
		GameAlias: (*GameAlias)(g),
	}
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}
	g.ImageURL = sql.NullString{String: aux.ImageURL, Valid: aux.ImageURL != ""}
	return nil
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type SignupRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	IsAdmin  bool   `json:"is_admin"`
	Email    string `json:"email"`
	Message  string `json:"message"`
}

// Initialize database connection
func initDB() {
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	var err error
	db, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Test the connection
	err = db.Ping()
	if err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	log.Println("Successfully connected to PostgreSQL database")
}

// CORS Middleware
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Content-Type", "application/json")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Auth Endpoints
func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	var user User
	var hashedPassword string
	err = db.QueryRow("SELECT id, username, email, is_admin, password FROM users WHERE username = $1", req.Username).
		Scan(&user.ID, &user.Username, &user.Email, &user.IsAdmin, &hashedPassword)

	if err == sql.ErrNoRows {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Check password - try both plain text and bcrypt for flexibility
	var passwordMatch bool
	
	// First try bcrypt
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(req.Password))
	if err == nil {
		passwordMatch = true
	} else if hashedPassword == req.Password {
		// Fallback to plain text comparison for development
		passwordMatch = true
	}
	
	if !passwordMatch {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	response := LoginResponse{
		ID:       user.ID,
		Username: user.Username,
		IsAdmin:  user.IsAdmin,
		Email:    user.Email,
		Message:  "Login successful",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func handleSignup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req SignupRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Password hashing failed", http.StatusInternalServerError)
		return
	}

	var userID int
	err = db.QueryRow(
		"INSERT INTO users (username, email, password, is_admin) VALUES ($1, $2, $3, false) RETURNING id",
		req.Username, req.Email, string(hashedPassword),
	).Scan(&userID)

	if err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			http.Error(w, "User already exists", http.StatusConflict)
		} else {
			http.Error(w, "Signup failed", http.StatusInternalServerError)
		}
		return
	}

	response := LoginResponse{
		ID:       userID,
		Username: req.Username,
		IsAdmin:  false,
		Email:    req.Email,
		Message:  "Signup successful",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Game Endpoints
func handleGetGames(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, title, price, category, platforms, release_date, image_url, created_by, created_at FROM games ORDER BY created_at DESC")
	if err != nil {
		log.Printf("Database query error: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	games := []Game{}
	for rows.Next() {
		var game Game
		var platformsStr string
		err := rows.Scan(&game.ID, &game.Title, &game.Price, &game.Category, &platformsStr, &game.ReleaseDate, &game.ImageURL, &game.CreatedBy, &game.CreatedAt)
		if err != nil {
			log.Printf("Row scan error: %v", err)
			continue
		}
		game.Platforms = strings.Split(platformsStr, ",")
		games = append(games, game)
	}

	log.Printf("Returning %d games", len(games))
	w.Header().Set("Content-Type", "application/json")
	if games == nil {
		json.NewEncoder(w).Encode([]Game{})
	} else {
		json.NewEncoder(w).Encode(games)
	}
}

func handleGetGameByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var game Game
	var platformsStr string
	err := db.QueryRow("SELECT id, title, price, category, platforms, release_date, image_url, created_by, created_at FROM games WHERE id = $1", id).
		Scan(&game.ID, &game.Title, &game.Price, &game.Category, &platformsStr, &game.ReleaseDate, &game.ImageURL, &game.CreatedBy, &game.CreatedAt)

	if err == sql.ErrNoRows {
		http.Error(w, "Game not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	game.Platforms = strings.Split(platformsStr, ",")

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(game)
}

func handleCreateGame(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var game Game
	err := json.NewDecoder(r.Body).Decode(&game)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	platformsStr := strings.Join(game.Platforms, ",")

	var gameID int
	err = db.QueryRow(
		"INSERT INTO games (title, price, category, platforms, release_date, image_url, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
		game.Title, game.Price, game.Category, platformsStr, game.ReleaseDate, game.ImageURL, game.CreatedBy,
	).Scan(&gameID)

	if err != nil {
		http.Error(w, "Failed to create game", http.StatusInternalServerError)
		return
	}

	game.ID = gameID
	game.CreatedAt = time.Now()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(game)
}

func handleUpdateGame(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	vars := mux.Vars(r)
	id := vars["id"]

	var game Game
	err := json.NewDecoder(r.Body).Decode(&game)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	platformsStr := strings.Join(game.Platforms, ",")

	result, err := db.Exec(
		"UPDATE games SET title=$1, price=$2, category=$3, platforms=$4, release_date=$5, image_url=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7",
		game.Title, game.Price, game.Category, platformsStr, game.ReleaseDate, game.ImageURL, id,
	)

	if err != nil {
		http.Error(w, "Failed to update game", http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		http.Error(w, "Game not found", http.StatusNotFound)
		return
	}

	game.ID, _ = strconv.Atoi(id)
	game.CreatedAt = time.Now()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(game)
}

func handleDeleteGame(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	vars := mux.Vars(r)
	id := vars["id"]

	result, err := db.Exec("DELETE FROM games WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Failed to delete game", http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		http.Error(w, "Game not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNoContent)
}

// Upload image endpoint
func handleUploadImage(w http.ResponseWriter, r *http.Request) {
	// Return default image URL
	// All uploaded games will use the default GameIcon.jpg from games folder
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"image_url": "/assets/games/GameIcon.jpg",
	})
}

// Health check endpoint
func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
}

func main() {
	// Load environment variables
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	os.Getenv("DB_HOST")
	os.Getenv("DB_PORT")
	os.Getenv("DB_USER")
	os.Getenv("DB_PASSWORD")
	os.Getenv("DB_NAME")

	// Initialize database
	initDB()
	defer db.Close()

	// Create router
	router := mux.NewRouter()

	// Apply CORS middleware
	router.Use(enableCORS)

	// Health check
	router.HandleFunc("/health", handleHealth).Methods("GET", "OPTIONS")

	// Auth routes
	router.HandleFunc("/api/auth/login", handleLogin).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/auth/signup", handleSignup).Methods("POST", "OPTIONS")

	// Upload routes
	router.HandleFunc("/api/upload", handleUploadImage).Methods("POST", "OPTIONS")

	// Game routes
	router.HandleFunc("/api/games", handleGetGames).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/games/{id}", handleGetGameByID).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/games", handleCreateGame).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/games/{id}", handleUpdateGame).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/games/{id}", handleDeleteGame).Methods("DELETE", "OPTIONS")

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
