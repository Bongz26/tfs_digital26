# Native PowerShell HTTP Server for TFS Pamphlets
$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "HTTP Server listening on http://localhost:$port/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $rawPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($rawPath)) {
            $rawPath = "TFS_PORTABLE_PAMPHLET.html"
        }
        
        $fullPath = [System.IO.Path]::Combine((Get-Location).Path, $rawPath)
        
        if ([System.IO.File]::Exists($fullPath)) {
            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentLength64 = $bytes.Length
            
            if ($fullPath.EndsWith(".html")) {
                $response.ContentType = "text/html; charset=utf-8"
            } elseif ($fullPath.EndsWith(".js")) {
                $response.ContentType = "application/javascript"
            } elseif ($fullPath.EndsWith(".css")) {
                $response.ContentType = "text/css"
            }
            
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
