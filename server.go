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

	dir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	fs := http.FileServer(http.Dir(dir))
	
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			http.ServeFile(w, r, filepath.Join(dir, "index.html"))
			return
		}
		fs.ServeHTTP(w, r)
	})

	fmt.Printf("🚀 Orbit Server running on http://localhost:%s\n", port)
	
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}