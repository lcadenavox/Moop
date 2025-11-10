# Moop App - Sistema de Gestão de Motos

## Integrantes

- Davi Gonzaga Ferreira — RM554890 — GitHub: [preencher]
- Leonardo Cadena de Souza — RM557528 — GitHub: [preencher]
- Julia Vasconcelos Oliveira — RM558785 — GitHub: [preencher]

## Descrição

O Moop é um aplicativo desenvolvido em React Native com Expo que permite a gestão de oficinas, mecânicos, depósitos e motos. O aplicativo inclui sistema de autenticação (login/cadastro/logout), temas claro/escuro, internacionalização (PT/ES) e funcionalidades CRUD completas integradas a uma API .NET.

## Funcionalidades Principais

### Sistema de Autenticação
- **Login** com validação de email e senha
- **Cadastro de usuários** com validações completas
- **Logout funcional** com confirmação
- Armazenamento seguro de tokens de autenticação

### Gerenciamento de Oficinas (API)
- **Create**: Cadastro de novas oficinas (nome, endereço, telefone, especialidades)
- **Read**: Lista de oficinas com busca e refresh
- **Update**: Edição de oficinas existentes
- **Delete**: Remoção com confirmação
- **Detalhes**: Visualização completa com ações (ligar, ver no mapa)

### Gerenciamento de Mecânicos (API)
- **Create**: Cadastro de mecânicos (nome, especialidade)
- **Read**: Lista de mecânicos com busca e refresh
- **Update**: Edição de mecânicos existentes
- **Delete**: Remoção com confirmação
- **Detalhes**: Visualização completa do mecânico

### Gerenciamento de Depósitos (API)
- **Create**: Cadastro de novos depósitos (nome, endereço)
- **Read**: Lista de depósitos com refresh
- **Update**: Edição de depósitos existentes
- **Delete**: Remoção com confirmação
- **Detalhes**: Visualização com opção de abrir no mapa

### Sistema de Temas
- **Modo Claro** seguindo Material Design guidelines
- **Modo Escuro** com cores otimizadas
- **Toggle automático** com persistência de preferências
- Cores, tipografia e espaçamentos consistentes

### Internacionalização (i18n)
- Suporte a Português (pt-BR) e Espanhol (es)
- Persistência da linguagem selecionada via AsyncStorage
- Mudança dinâmica sem reiniciar o app
- Arquivos de tradução centralizados (`src/i18n/locales/pt.json`, `es.json`)

### Outras Telas
- **Lista de motos** (integrada à API)
- **Mapa do pátio** mostrando vagas ocupadas e livres (local)
- **Cadastro de vagas** no pátio (local) com validação e feedback
- **Tela de estatísticas** (local + API)

## Arquitetura Técnica

### Estrutura do Projeto
```
src/
├── components/          # Componentes reutilizáveis
│   └── LoadingSpinner.tsx
├── contexts/           # Contextos React
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── screens/           # Telas do aplicativo
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── MotoListScreen.tsx
│   ├── MotoFormScreen.tsx
│   ├── MotoDetailScreen.tsx
│   ├── MecanicoListScreen.tsx
│   ├── MecanicoFormScreen.tsx
│   ├── MecanicoDetailScreen.tsx
│   ├── DepositoListScreen.tsx
│   ├── DepositoFormScreen.tsx
│   ├── DepositoDetailScreen.tsx
│   └── [telas existentes...]
├── services/          # Serviços de API
│   ├── ApiService.ts
│   ├── AuthService.ts
│   ├── MotoService.ts
│   ├── MecanicoService.ts
│   ├── OficinaService.ts
│   └── DepositoService.ts
└── types/            # Definições TypeScript
    └── index.ts
```

### Tecnologias Utilizadas
- **React Native** com Expo 53
- **TypeScript**
- **React Navigation**
- **AsyncStorage** (sessão/tema/idioma)
- **Expo Vector Icons**
- **API .NET** para backend (https://localhost:7054/swagger)
- **i18next + react-i18next + expo-localization** (internacionalização)
- **Yup** (validação de formulários reutilizável)

## Instruções de Instalação

### Pré-requisitos
- Node.js 18+ 
- Expo CLI
- API .NET rodando em https://localhost:7054 (ou http conforme seu ambiente)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd MoopApp
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```
   Dependências principais adicionais utilizadas:
   - i18n: `i18next react-i18next expo-localization`
   - Validação: `yup`

3. **Configure a API**
   - Certifique-se de que a API .NET esteja rodando em `https://localhost:7054`
   - Habilite CORS para as origens do Expo (web e dispositivo)
   - Se estiver usando certificado de desenvolvimento, confie nele (`dotnet dev-certs https --trust`)
   - Ajuste a BASE URL do app via variável de ambiente quando necessário (veja abaixo)

4. **Inicie o aplicativo**
   ```bash
   npm start
   ```
   
   Ou para plataformas específicas:
   ```bash
   npm run android    # Para Android
   npm run ios        # Para iOS
   npm run web        # Para Web
   ```

## API Endpoints Utilizados

A aplicação consome os seguintes endpoints da API .NET:

### Autenticação
- `POST /api/Auth/login` - Login do usuário
- `POST /api/Auth/register` - Registro de usuário
- `POST /api/Auth/logout` - Logout do usuário

### Oficinas
- `GET /api/Oficina?page=1&pageSize=50` - Listar oficinas (paginado)
- `GET /api/Oficina/{id}` - Obter oficina por ID
- `POST /api/Oficina` - Criar nova oficina
- `PUT /api/Oficina/{id}` - Atualizar oficina
- `DELETE /api/Oficina/{id}` - Deletar oficina

### Mecânicos
- `GET /api/Mecanico?page=1&pageSize=50` - Listar mecânicos (paginado)
- `GET /api/Mecanico/{id}` - Obter mecânico por ID
- `POST /api/Mecanico` - Criar novo mecânico
- `PUT /api/Mecanico/{id}` - Atualizar mecânico
- `DELETE /api/Mecanico/{id}` - Deletar mecânico

### Depósitos
- `GET /api/Deposito?page=1&pageSize=50` - Listar depósitos (paginado)
- `GET /api/Deposito/{id}` - Obter depósito por ID
- `POST /api/Deposito` - Criar novo depósito
- `PUT /api/Deposito/{id}` - Atualizar depósito
- `DELETE /api/Deposito/{id}` - Deletar depósito

## Models da API

### Oficina
```csharp
public class Oficina
{
    public int Id { get; set; }
    [Required]
    public string Nome { get; set; } = string.Empty;
    [Required]
    public string Endereco { get; set; } = string.Empty;
    [Required]
    public string Telefone { get; set; } = string.Empty;
    public string[] Especialidades { get; set; } = Array.Empty<string>();
}
```

### Mecânico
```csharp
public class Mecanico
{
    public int Id { get; set; }
    [Required]
    public string Nome { get; set; } = string.Empty;
    [Required]
    public string Especialidade { get; set; } = string.Empty;
}
```

## Funcionalidades Implementadas Conforme Critérios (Sprint 3)

### ✅ Telas Funcionais Integradas com API (40 pontos)
- 2 funcionalidades completas: Oficinas e Mecânicos (CRUD completo: Create/Read/Update/Delete)
- Formulários com validações, mensagens de erro e feedback ao usuário
- Indicadores de carregamento em chamadas de rede (Listas e Forms)

### ✅ Sistema de Login (20 pontos)
- Tela de Login com validações e loading
- Tela de Cadastro com validações e loading
- Logout funcional com confirmação

### ✅ Estilização com Tema (15 pontos)
- Modo claro e escuro implementados (persistência via AsyncStorage)
- Paleta de cores, tipografia e espaçamentos consistentes
- Aderência às guidelines do Material Design
- Identidade visual coerente

### ✅ Arquitetura de Código (15 pontos)
- Organização lógica (components, contexts, services, screens, types)
- Nomeação clara e padronizada
- Separação de responsabilidades bem definida
- Código limpo e tipado (TypeScript)
- Boas práticas RN aplicadas

### ✅ Internacionalização (10 pontos)
- Todos os textos de interface extraídos para arquivos de tradução
- Alternância manual via componente `LanguageSwitcher`
- Persistência da escolha do idioma entre sessões
- Mensagens de validação e alertas traduzidos

### ✅ Validação de Formulários (incluído nos pontos de UX/Arquitetura)
- Uso de schemas Yup centralizados em `src/validation/schemas.ts`
- Regras consistentes para Login, Cadastro, Depósito, Mecânico, Oficina e Cadastro de Vaga
- Exibição de erros inline e mensagens de feedback traduzidas

## Exemplos de i18n

Inicialização (já configurada em `App.tsx`):
```ts
import '../src/i18n'; // garante init antes de usar t()
```

Uso em um componente:
```tsx
import { useTranslation } from 'react-i18next';

const Example = () => {
   const { t } = useTranslation();
   return <Text>{t('moto.form.titleNew')}</Text>;
};
```

Troca manual de idioma (`LanguageSwitcher.tsx`):
```tsx
i18n.changeLanguage(lang); // lang pode ser 'pt' ou 'es'
```

Estrutura das traduções:
```
src/i18n/locales/
   ├── pt.json
   └── es.json
```

## Exemplos de Validação (Yup)

Schemas centralizados (`src/validation/schemas.ts`):
```ts
export const createLoginSchema = (t: TFunction) =>
   Yup.object({
      email: Yup.string().trim().required(t('auth.common.errorEmailRequired')).email(t('auth.common.errorEmailInvalid')),
      password: Yup.string().trim().required(t('auth.common.errorPasswordRequired')).min(6, t('auth.common.errorPasswordMin')),
   });
```

Uso em um Formulário (exemplo adaptado do Login):
```ts
const schema = createLoginSchema(t);
const result = await validateWith(schema, { email, password });
if (!result.valid) {
   setEmailError(result.errors.email || '');
   setPasswordError(result.errors.password || '');
   return;
}
```

Helper genérico:
```ts
export async function validateWith(schema, values) {
   try {
      await schema.validate(values, { abortEarly: false, stripUnknown: true });
      return { valid: true, errors: {} };
   } catch (err) {
      // mapeia erros de campo
   }
}
```

Benefícios:
- Reutilização e consistência das regras
- Mensagens traduzidas conforme idioma atual
- Fácil expansão para novos formulários

## Como Testar

### 🔧 Configuração da BASE da API
- Por padrão, usamos `https://localhost:7054/api` (casando com o Swagger).
- Para ambientes diferentes, defina a variável `EXPO_PUBLIC_API_BASE_URL` antes de iniciar o app.

Windows PowerShell (exemplos):

```powershell
# HTTPS (padrão)
$env:EXPO_PUBLIC_API_BASE_URL = "https://localhost:7054/api"
npm start

# Somente HTTP (se sua API não usa https em dev)
$env:EXPO_PUBLIC_API_BASE_URL = "http://localhost:7054/api"
npm start

# Emulador Android (host do PC no emulador)
$env:EXPO_PUBLIC_API_BASE_URL = "http://10.0.2.2:7054/api"
npm start

# Dispositivo físico na mesma rede
$env:EXPO_PUBLIC_API_BASE_URL = "http://SEU-IP-LOCAL:7054/api"
npm start
```

### Autenticação
1. Abra o app (será direcionado para Login)
2. Faça login com usuário já cadastrado na sua API ou use a tela de cadastro
3. Após login, você será redirecionado para a Home

### Lista de Motos (Funcionalidade Original)
1. Na tela inicial, clique em "Lista de Motos"
2. Visualize as motos cadastradas localmente
3. Adicione novas motos através do formulário
4. Veja as estatísticas de vagas ocupadas

### CRUD de Oficinas
1. Na tela inicial, clique em "Gerenciar Oficinas"
2. Use o botão + para adicionar uma nova oficina
3. Preencha nome, endereço, telefone e selecione especialidades
4. Toque em uma oficina para ver os detalhes
5. Use as ações: ligar, ver no mapa, editar ou excluir

### CRUD de Mecânicos
1. Na tela inicial, clique em "Gerenciar Mecânicos"
2. Use o botão + para adicionar um novo mecânico
3. Toque em um mecânico para ver os detalhes
4. Use os botões de editar/excluir para testar as operações

### CRUD de Depósitos
1. Na tela inicial, clique em "Gerenciar Depósitos"
2. Use o botão + para adicionar um novo depósito
3. Preencha nome e endereço
4. Toque em um depósito para ver os detalhes
5. Use os botões de editar/excluir para testar as operações

### Temas
1. Na tela inicial, toque no ícone de sol/lua no canto superior direito
2. O tema deve alternar entre claro e escuro
3. A preferência é salva automaticamente

### Indicador de Status da API
O componente de status tenta primeiro `GET /health` e depois um endpoint leve (`/Deposito?page=1&pageSize=1`).

Estados:
- Verde "API Online": API respondendo sem necessidade de autenticação adicional.
- Laranja "API Online (requer autenticação)": API alcançável, mas o endpoint usado exige token (resposta 401/403).
- Offline (não exibido): se a API estiver realmente indisponível, o banner não aparece para evitar ruído visual.

Use o botão de refresh para forçar nova verificação.

#### Configurando versão e base da API
O app aceita duas variáveis de ambiente públicas (Expo) para resolver diferenças entre `/api` e `/api/v1`:

| Variável | Exemplo | Observação |
|----------|---------|------------|
| `EXPO_PUBLIC_API_BASE_URL` | `https://localhost:7054/api` | Base SEM a versão (ou já com versão) |
| `EXPO_PUBLIC_API_VERSION`  | `v1` | Versão da API (não incluir barras). Será concatenada se não estiver presente na base |

Se você já definir a base com a versão (`https://localhost:7054/api/v1`) não precisa setar `EXPO_PUBLIC_API_VERSION`.

PowerShell exemplos:
```powershell
# Base + versão separadas
$env:EXPO_PUBLIC_API_BASE_URL = "https://localhost:7054/api"
$env:EXPO_PUBLIC_API_VERSION = "v1"
npm run web

# Base já inclui versão
$env:EXPO_PUBLIC_API_BASE_URL = "https://localhost:7054/api/v1"
Remove-Item Env:EXPO_PUBLIC_API_VERSION -ErrorAction SilentlyContinue
npm run web
```

#### Endpoint de Health (Backend .NET)
Adicionar um endpoint simples melhora a detecção sem exigir autenticação:
```csharp
// Program.cs
app.MapGet("/api/v1/health", () => Results.Ok(new { status = "ok" }));
```

#### Habilitando CORS para o Front-end Expo
```csharp
builder.Services.AddCors(options =>
{
   options.AddPolicy("MoopWeb", policy =>
   {
      policy
         .WithOrigins(
            "http://localhost:8081",       // Metro web
            "http://localhost:19006",       // Expo web clássico
            "https://localhost:8081",
            "https://localhost:19006"
         )
         .WithMethods("GET","POST","PUT","DELETE","OPTIONS")
         .WithHeaders("Content-Type","Authorization")
         .AllowCredentials();
   });
});

var app = builder.Build();
app.UseHttpsRedirection();
app.UseCors("MoopWeb");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/api/v1/health", () => Results.Ok(new { status = "ok" }));
app.Run();
```

#### Confiando o Certificado de Desenvolvimento
```powershell
dotnet dev-certs https --trust
```
Se o navegador ainda bloquear:
```powershell
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

#### Debug rápido
```powershell
curl -k https://localhost:7054/api/v1/health
curl -k "https://localhost:7054/api/v1/Deposito?page=1&pageSize=1"
```
200 = ok; 401/403 = ok (auth necessária); falha de conexão = backend realmente indisponível.
### Troca de Idioma
1. Abra o app e localize o componente de troca de idioma no topo (se integrado ao header) ou na home.
2. Altere entre Português e Espanhol.
3. Verifique que os textos das telas e mensagens de validação são atualizados instantaneamente.
4. Reinicie o app: o idioma escolhido deve persistir.

### Validações
1. Abra cada formulário (Login, Cadastro, Depósito, Mecânico, Oficina, Vaga).
2. Tente enviar vazio ou com dados inválidos.
3. Observe mensagens de erro localizadas.
4. Corrija os campos e envie novamente; deve aparecer alerta de sucesso traduzido.



## Observações Importantes

- Certifique-se de que a API .NET esteja rodando antes de testar as funcionalidades
- As validações seguem as mesmas regras dos models da API e são centralizadas via Yup
- O AsyncStorage é usado para sessão e preferências (tema)
- Todas as operações de rede possuem tratamento de erro e indicadores de carregamento

## Apresentação (Vídeo)
- Inclua aqui o link do vídeo demonstrando o app em funcionamento real (emulador ou dispositivo), cobrindo:
   - Login, Cadastro e Logout
   - CRUD de Oficinas (Create/Read/Update/Delete)
   - CRUD de Mecânicos (Create/Read/Update/Delete)
   - Alternância de Tema (claro/escuro)
   - Indicador de Status da API

Exemplo: [link do vídeo aqui]

URLs e CORS:
- Expo Web tipicamente roda em `http://localhost:19006` (ou `https://localhost:19006`).
- Adicione essas origens na policy de CORS da sua API.
- Se usar HTTPS, confie no certificado dev com `dotnet dev-certs https --trust`.
