$ErrorActionPreference = 'Stop'
$p = Join-Path $PSScriptRoot '..\public\Logo.png' | Resolve-Path
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($p.Path)
$newW = [Math]::Min(432, [int]$img.Width)
$newH = [int]([double]$img.Height * ($newW / [double]$img.Width))
$bmp = New-Object System.Drawing.Bitmap ([int]$newW, [int]$newH)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = 'HighQuality'
$g.SmoothingMode = 'AntiAlias'
$g.DrawImage($img, 0, 0, [int]$newW, [int]$newH)
$tmp = $p.Path + '.tmp.png'
$bmp.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Move-Item -Force $tmp $p.Path
Write-Host "Logo resized to ${newW}x${newH}"
