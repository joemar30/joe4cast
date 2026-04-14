# batch_commit.ps1
# ───────────────────────────────────────────────────────────
# Script to stage and commit each uncommitted file one-by-one
# with descriptive messages based on file paths.
# ───────────────────────────────────────────────────────────

Write-Host " Gathering uncommitted files..." -ForegroundColor Cyan

$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes to commit." -ForegroundColor Green
    exit
}

$files = $status | ForEach-Object { $_.Substring(3) }

foreach ($file in $files) {
    if (-not $file) { continue }
    
    # Determine a descriptive commit message
    $msg = "Update $file" # Default
    
    if ($file -like "*MovieLogo*") { $msg = "feat(ui): refine MovieLogo with smooth cross-fade and bg loading" }
    elseif ($file -like "*Discover*") { $msg = "fix(discover): decouple navigation from selection and fix mobile grid" }
    elseif ($file -like "*Docs*") { $msg = "docs: update dev docs and fix mobile responsiveness" }
    elseif ($file -like "*VibeyChat*" -or $file -like "*VibeyPage*") { $msg = "feat(chat): integrate Vibey AI assistant and page" }
    elseif ($file -like "*App.jsx") { $msg = "layout: update global footer visibility and route logic" }
    elseif ($file -like "*backend*") { $msg = "backend: update Django models and migrations" }
    elseif ($file -like "*auth*" -or $file -like "*Auth*") { $msg = "feat(auth): premium redesign and accessibility fixes" }
    elseif ($file -like "*Leaderboard*") { $msg = "fix(leaderboard): prevent crash on empty stats iteration" }
    elseif ($file -like "*Settings*") { $msg = "feat(settings): add DevTools section and About page refinements" }
    elseif ($file -like "*ThemeStore*") { $msg = "feat(store): initialize premium theme store page" }
    elseif ($file -like "*Profile*") { $msg = "feat(profile): enhance watchlist and profile UI" }
    elseif ($file -like "*vercel.json*" -or $file -like "*vite.config.js*") { $msg = "build: update deployment and proxy configurations" }

    Write-Host "Committing: $file" -ForegroundColor Yellow
    git add "$file"
    git commit -m "$msg"
}

Write-Host "DONE: All files committed one-by-one!" -ForegroundColor Green
Write-Host "You can now run 'git push' manually." -ForegroundColor Cyan
