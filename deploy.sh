#!/bin/bash

# Abortar si ocurre algún error
set -e

echo "🧹 Limpiando build anterior..."
rm -rf dist

echo "🏗 Construyendo proyecto con Vite..."
npm run build

echo "📄 Copiando index.html como 404.html para GitHub Pages..."
cp dist/index.html dist/404.html

echo "🚀 Deploying to GitHub Pages..."

# Guarda rama actual
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Crea rama gh-pages si no existe
if ! git show-ref --quiet refs/heads/gh-pages; then
  git checkout --orphan gh-pages
  git rm -rf .
  echo "🔧 GitHub Pages inicializada" > index.html
  git add index.html
  git commit -m "Inicializar gh-pages"
  git push origin gh-pages
  git checkout "$current_branch"
fi

# Clona la carpeta dist en un temporal
temp_dir=$(mktemp -d)
cp -r dist/* "$temp_dir"

# Cambia a gh-pages
git checkout gh-pages

# Limpia todo y copia nuevo contenido
git rm -rf .
cp -r "$temp_dir"/* .
rm -rf "$temp_dir"

# Commit y push
git add .
git commit -m "Deploy $(date +'%Y-%m-%d %H:%M:%S')"
git push origin gh-pages --force

# Vuelve a la rama original
git checkout "$current_branch"

echo "✅ Deploy exitoso. Sitio en: https://carlossmc94.github.io/rapicredito-front"
