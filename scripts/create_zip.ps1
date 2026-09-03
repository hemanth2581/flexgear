$destination = "flexgear-rental-complete.zip"
if (Test-Path $destination) {
    Remove-Item $destination -Force
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$rootPath = (Get-Location).Path
$zipFile = [System.IO.Compression.ZipFile]::Open($destination, [System.IO.Compression.ZipArchiveMode]::Create)

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

$zipItem = Get-Item $destination
Write-Host "=========================================="
Write-Host " FlexGear Complete Project ZIP Created!"
Write-Host "=========================================="
Write-Host "Files Included: $count"
Write-Host "File Name:      $($zipItem.Name)"
Write-Host "File Size:      $([math]::Round($zipItem.Length / 1MB, 2)) MB ($($zipItem.Length) bytes)"
Write-Host "Full Path:      $($zipItem.FullName)"
Write-Host "=========================================="
