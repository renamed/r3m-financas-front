# check whether git branch is main
if ((git rev-parse --abbrev-ref HEAD) -eq "main") {    
    Write-Information "You are on the main branch. Proceeding with production build..."
    npm run deploy
}
else {
    Write-Warning "You are not on the main branch. We'll run the last production build instead."
}

# rodar o projeto usando http-server
http-server dist\r3m-financas-front\browser -p 4201