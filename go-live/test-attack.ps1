# Teste de ataque — Sentinel AI Go-Live
# Passo 8 do checklist EXECUTE AGORA

$ApiKey = Read-Host "Digite sua API Key do Sentinel"
$Uri = "https://api.sentinel-ai.app/v1/inspect"
$Body = '{"method":"POST","path":"/api/login","body":{"username":"admin'' OR ''1''=''1"}}'

Write-Host "Enviando payload de SQL injection para $Uri ..." -ForegroundColor Cyan

try {
    $Response = Invoke-RestMethod -Uri $Uri -Method Post -Headers @{
        "Content-Type" = "application/json"
        "X-API-Key"    = $ApiKey
    } -Body $Body

    Write-Host "Resposta recebida:" -ForegroundColor Green
    $Response | ConvertTo-Json -Depth 5

    if ($Response.verdict -eq "BLOCK" -or $Response.decision.verdict -eq "BLOCK") {
        Write-Host "`n✅ TESTE PASSOU — Ataque bloqueado corretamente." -ForegroundColor Green
    } else {
        Write-Host "`n⚠️ TESTE FALHOU — Esperava BLOCK." -ForegroundColor Yellow
    }
} catch {
    Write-Host "`n❌ Erro na requisição: $_" -ForegroundColor Red
}
