# Determine Desktop Path(s)
$desktop1 = [Environment]::GetFolderPath([Environment+SpecialFolder]::Desktop)
$desktop2 = "$env:USERPROFILE\Desktop"
$desktop3 = "$env:USERPROFILE\OneDrive\Desktop"

$desktops = @($desktop1, $desktop2, $desktop3) | Select-Object -Unique | Where-Object { Test-Path $_ }

Write-Host "Detected Desktop Locations: $($desktops -join ', ')"

$zipSource = "flexgear-rental-complete.zip"

# Re-create zip if needed
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

if (Test-Path $zipSource) {
    Remove-Item $zipSource -Force
}

$rootPath = (Get-Location).Path
$zipFile = [System.IO.Compression.ZipFile]::Open($zipSource, [System.IO.Compression.ZipArchiveMode]::Create)

$files = Get-ChildItem -Path . -Recurse -File

$count = 0
foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($rootPath.Length + 1)
    
    # Exclude node_modules, .next, dist, .git, and zip files
    if ($relativePath -match '(^|[\\/])(node_modules|\.next|dist|\.git)([\\/])' -or $relativePath -like '*.zip') {
        continue
    }
    
    $entryName = $relativePath.Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zipFile, $file.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    $count++
}

$zipFile.Dispose()

# Copy to Desktop(s)
$savedPaths = @()
foreach ($d in $desktops) {
    $dest = Join-Path $d "flexgear-rental-complete.zip"
    Copy-Item -Path $zipSource -Destination $dest -Force
    $savedPaths += $dest
}

$zipItem = Get-Item $zipSource
Write-Host "=========================================================="
Write-Host " ✅ FlexGear Project Successfully Saved to Desktop!"
Write-Host "=========================================================="
Write-Host "Files Included: $count"
Write-Host "File Size:      $([math]::Round($zipItem.Length / 1MB, 2)) MB ($($zipItem.Length) bytes)"
Write-Host "Saved To:"
foreach ($p in $savedPaths) {
    Write-Host " -> $p"
}
Write-Host "=========================================================="
