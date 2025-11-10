# Backend .NET: Health Endpoint, CORS e Configuração de HTTPS

Este guia mostra as mudanças mínimas para habilitar CORS para o front Expo/Web e expor um endpoint público de health (`/api/v1/health`).

## 1) Program.cs (mínimo ASP.NET Core 8)

```csharp
var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("MoopWeb", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:8081",       // Metro bundler web
                "https://localhost:8081",
                "http://localhost:19006",      // Expo web clássico
                "https://localhost:19006"
                // Se usar dispositivo físico/lan, adicione: "http://SEU-IP:19006"
            )
            .WithMethods("GET","POST","PUT","DELETE","OPTIONS")
            .WithHeaders("Content-Type","Authorization")
            .AllowCredentials();
    });
});

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();
builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("MoopWeb");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Endpoint público de health (ajuste o prefixo/versão conforme seu padrão)
app.MapGet("/api/v1/health", () => Results.Ok(new { status = "ok" }));

app.Run();
```

> Observação: se sua API já usa `MapGroup("/api/v1")`, adicione `group.MapGet("/health", ...)` dentro do grupo.

## 2) appsettings.json (opcional, exemplo de Kestrel)

```json
{
  "Kestrel": {
    "Endpoints": {
      "Https": {
        "Url": "https://localhost:7054",
        "Protocols": "Http1AndHttp2"
      }
    }
  },
  "AllowedHosts": "*"
}
```

## 3) Confiar certificado de desenvolvimento

No Windows PowerShell:

```powershell
dotnet dev-certs https --trust
```

Se precisar limpar e recriar:

```powershell
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

## 4) Testes rápidos

```powershell
curl -k https://localhost:7054/api/v1/health
# 200 -> ok

curl -k "https://localhost:7054/api/v1/Deposito?page=1&pageSize=1"
# 200 -> ok; 401/403 -> ok (auth necessária); CORS/ERR_FAILED -> revisar CORS/config
```

## 5) Variáveis do App (Expo)

- `EXPO_PUBLIC_API_BASE_URL` = `https://localhost:7054/api` (ou `https://localhost:7054/api/v1`)
- `EXPO_PUBLIC_API_VERSION` = `v1` (se a base não tiver a versão)

Isso evita 404 quando o backend usa prefixo `/api/v1`.
