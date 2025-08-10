# check whether git branch is main
if ((git rev-parse --abbrev-ref HEAD) -eq "main") {    
    Write-Host "You are on the main branch. Proceeding with production build..."
    npm run deploy
}
else {
    Write-Host "You are not on the main branch. We'll run the last production build instead."
}

if ((npm list -g --depth=0 --json | ConvertFrom-Json).dependencies.'serve') {
    Write-Host "'serve' já está instalado."
} else {
    Write-Host "Instalando 'serve'..."
    npm install -g serve
}


# rodar o projeto usando http-server
Set-Location 'C:\git\r3m-financas-front\dist\r3m-financas-front\browser'
serve -s . -l 4201