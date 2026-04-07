# Get all untracked and modified files
$untracked = git ls-files --others --exclude-standard
$modified = git diff --name-only
$files = ($untracked + $modified) | Sort-Object -Unique

if ($files.Count -eq 0) {
    Write-Host "No files to commit!" -ForegroundColor Cyan
    exit
}

Write-Host "🚀 Starting individual commits for $($files.Count) files..." -ForegroundColor Cyan

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ Committing: $file" -ForegroundColor Green
        git add "$file"
        git commit -m "feat: add or update $file"
    } else {
        Write-Host "⚠️ Skipping missing file: $file" -ForegroundColor Yellow
    }
}

Write-Host "🎉 Done! All files committed. You can now run 'git push' manually." -ForegroundColor Yellow
