#!/bin/bash

# Array of project names
projects=(
  "benefit-first"
  "case-study-and-ROI-focus"
  "live-preview"
  "founder-section"
  "short-cta-and-strong-button"
  "mobile-first-layout"
  "develop-centric"
)

# Base port number
base_port=3002

for i in "${!projects[@]}"; do
  project="${projects[$i]}"
  port=$((base_port + i))
  
  echo "Setting up $project on port $port..."
  
  # Create directories
  mkdir -p "$project/src"
  
  # Copy package.json and modify name
  sed "s/minimal-and-clean-landing/${project}-landing/g" minimal-and-clean/package.json > "$project/package.json"
  
  # Copy vite config and modify port
  sed "s/port: 3001/port: $port/g" minimal-and-clean/vite.config.js > "$project/vite.config.js"
  
  # Copy other config files
  cp minimal-and-clean/tailwind.config.js "$project/"
  cp minimal-and-clean/postcss.config.js "$project/"
  
  # Copy and modify index.html
  sed "s/Minimal & Clean Landing/${project^} Landing/g" minimal-and-clean/index.html > "$project/index.html"
  
  # Copy src files
  cp minimal-and-clean/src/main.jsx "$project/src/"
  cp minimal-and-clean/src/index.css "$project/src/"
  
  echo "✅ $project setup complete"
done

echo "🎉 All projects setup complete!"
