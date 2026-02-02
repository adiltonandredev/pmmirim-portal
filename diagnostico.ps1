# Script de diagnóstico do Prisma
Write-Host "=== DIAGNÓSTICO DO PRISMA ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar .env.local
Write-Host "1. Verificando arquivo .env.local..." -ForegroundColor Yellow
if (Test-Path .env.local) {
    Write-Host "   ✓ Arquivo .env.local existe" -ForegroundColor Green
    Write-Host "   Conteúdo:" -ForegroundColor Gray
    Get-Content .env.local | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
} else {
    Write-Host "   ✗ Arquivo .env.local NÃO existe!" -ForegroundColor Red
}
Write-Host ""

# 2. Verificar processos Node
Write-Host "2. Verificando processos Node.js em execução..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   ⚠ Encontrados $($nodeProcesses.Count) processo(s) Node.js:" -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object { Write-Host "     PID: $($_.Id)" -ForegroundColor Gray }
} else {
    Write-Host "   ✓ Nenhum processo Node.js em execução" -ForegroundColor Green
}
Write-Host ""

# 3. Verificar se Prisma Client existe
Write-Host "3. Verificando Prisma Client..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma\client") {
    Write-Host "   ✓ Prisma Client existe" -ForegroundColor Green
    
    # Verificar se tem os novos modelos
    $indexPath = "node_modules\.prisma\client\index.d.ts"
    if (Test-Path $indexPath) {
        $content = Get-Content $indexPath -Raw
        
        $modelos = @("InstitutionHistory", "OrganizationalStructure", "BoardMember", "Course", "Birthday", "FeaturedStudent", "InstagramSettings")
        $modelosEncontrados = @()
        $modelosAusentes = @()
        
        foreach ($modelo in $modelos) {
            if ($content -match $modelo) {
                $modelosEncontrados += $modelo
            } else {
                $modelosAusentes += $modelo
            }
        }
        
        if ($modelosEncontrados.Count -gt 0) {
            Write-Host "   ✓ Modelos encontrados: $($modelosEncontrados -join ', ')" -ForegroundColor Green
        }
        
        if ($modelosAusentes.Count -gt 0) {
            Write-Host "   ✗ Modelos AUSENTES: $($modelosAusentes -join ', ')" -ForegroundColor Red
            Write-Host "     AÇÃO NECESSÁRIA: Executar 'npx prisma generate'" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "   ✗ Prisma Client NÃO existe!" -ForegroundColor Red
    Write-Host "     AÇÃO NECESSÁRIA: Executar 'npx prisma generate'" -ForegroundColor Yellow
}
Write-Host ""

# 4. Testar conexão com banco
Write-Host "4. Testando conexão com MySQL..." -ForegroundColor Yellow
$env:DATABASE_URL = "mysql://root:@localhost:3306/pmmirim"
try {
    $result = mysql -u root -e "SELECT 1" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ MySQL está acessível" -ForegroundColor Green
        
        # Verificar se banco existe
        $dbCheck = mysql -u root -e "SHOW DATABASES LIKE 'pmmirim'" 2>&1
        if ($dbCheck -match "pmmirim") {
            Write-Host "   ✓ Banco 'pmmirim' existe" -ForegroundColor Green
            
            # Listar tabelas
            $tables = mysql -u root pmmirim -e "SHOW TABLES" 2>&1
            if ($tables) {
                Write-Host "   Tabelas encontradas:" -ForegroundColor Gray
                $tables -split "`n" | Select-Object -Skip 1 | ForEach-Object { 
                    if ($_ -ne "") { Write-Host "     - $_" -ForegroundColor Gray }
                }
            }
        } else {
            Write-Host "   ✗ Banco 'pmmirim' NÃO existe!" -ForegroundColor Red
            Write-Host "     AÇÃO NECESSÁRIA: Executar 'npx prisma db push'" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ✗ Não foi possível conectar ao MySQL" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Erro ao testar conexão: $_" -ForegroundColor Red
}
Write-Host ""

# 5. Resumo e ações
Write-Host "=== RESUMO E PRÓXIMOS PASSOS ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Se houver problemas acima, execute:" -ForegroundColor Yellow
Write-Host "  1. .\setup-fix.ps1" -ForegroundColor White
Write-Host "  2. npm run dev" -ForegroundColor White
Write-Host ""
