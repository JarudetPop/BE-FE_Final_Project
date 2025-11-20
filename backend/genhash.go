package main

import (
"fmt"
"golang.org/x/crypto/bcrypt"
)

func genHash() {
password := "Admin123"
hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
fmt.Println("Hash for 'Admin123':")
fmt.Println(string(hash))

// Test verify
err := bcrypt.CompareHashAndPassword(hash, []byte(password))
fmt.Println("Verify:", err == nil)
}
