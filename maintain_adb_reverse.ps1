$adb = "C:\Users\dhruv\AppData\Local\Android\Sdk\platform-tools\adb.exe"

& $adb start-server
Write-Output "ADB Server started."

while ($true) {
    try {
        & $adb -s 1ddcf7bf reverse tcp:5000 tcp:5000 2>$null
    } catch {}
    Start-Sleep -Seconds 3
}
