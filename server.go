package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	port := "8080"
	if p := os.Getenv("PORT"); p != "" {
		port = p
	}

	// Get the current directory
	dir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	// Create file server for static files
	fs := http.FileServer(http.Dir(dir))
	
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// If requesting root, serve index.html
		if r.URL.Path == "/" {
			http.ServeFile(w, r, filepath.Join(dir, "index.html"))
			return
		}
		// Otherwise serve static files
		fs.ServeHTTP(w, r)
	})

	fmt.Printf("🚀 Orbit Server running on http://localhost:%s\n", port)
	fmt.Println("Press Ctrl+C to stop the server")
	
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}