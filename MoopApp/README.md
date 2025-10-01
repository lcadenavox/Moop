# Moop App - Sistema de Gestão de Motos

## Integrantes

- Davi Gonzaga Ferreira RM554890
- Leonardo Cadena de Souza RM557528
- Julia Vasconcelos Oliveira RM558785

## Descrição

O Moop é um aplicativo avançado desenvolvido em React Native com Expo que permite a gestão de oficinas, mecânicos, depósitos e motos locais. O aplicativo inclui sistema de autenticação, temas claro/escuro e funcionalidades CRUD completas através de uma API .NET.

## Funcionalidades Principais

### Sistema de Autenticação
- **Login** com validação de email e senha
- **Cadastro de usuários** com validações completas
- **Logout funcional** com confirmação
- Armazenamento seguro de tokens de autenticação

### Gerenciamento de Oficinas (API Integration)
- **Create**: Cadastro de novas oficinas (nome, endereço, telefone, especialidades)
- **Read**: Lista de oficinas com busca e refresh
- **Update**: Edição de oficinas existentes
- **Delete**: Remoção com confirmação
- **Detalhes**: Visualização completa com ações (ligar, ver no mapa)

### Gerenciamento de Mecânicos (API Integration)
- **Create**: Cadastro de mecânicos (nome, especialidade)
- **Read**: Lista de mecânicos com busca e refresh
- **Update**: Edição de mecânicos existentes
- **Delete**: Remoção com confirmação
- **Detalhes**: Visualização completa do mecânico

### Gerenciamento de Depósitos (API Integration)
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

### Funcionalidades Existentes (Mantidas)
- **Lista de motos** (funcionalidade original com AsyncStorage)
- **Mapa do pátio** mostrando vagas ocupadas e livres
- **Cadastro de vagas** no pátio
- **Tela de estatísticas** integrada (vagas locais + API)

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
- **TypeScript** para tipagem estática
- **React Navigation** para navegação
- **AsyncStorage** para persistência local
- **Expo Vector Icons** para ícones
- **API .NET** para backend (https://localhost:7054)

## Instruções de Instalação

### Pré-requisitos
- Node.js 18+ 
- Expo CLI
- API .NET rodando em https://localhost:7054

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

3. **Configure a API**
   - Certifique-se de que a API .NET esteja rodando em `https://localhost:7054`
   - Verifique os endpoints para Motos e Mecânicos
   - Configure CORS se necessário

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
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/logout` - Logout do usuário

### Oficinas
- `GET /api/oficinas` - Listar todas as oficinas
- `GET /api/oficinas/{id}` - Obter oficina por ID
- `POST /api/oficinas` - Criar nova oficina
- `PUT /api/oficinas/{id}` - Atualizar oficina
- `DELETE /api/oficinas/{id}` - Deletar oficina

### Mecânicos
- `GET /api/mecanicos` - Listar todos os mecânicos
- `GET /api/mecanicos/{id}` - Obter mecânico por ID
- `POST /api/mecanicos` - Criar novo mecânico
- `PUT /api/mecanicos/{id}` - Atualizar mecânico
- `DELETE /api/mecanicos/{id}` - Deletar mecânico

### Depósitos
- `GET /api/Deposito` - Listar depósitos (paginado)
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

## Funcionalidades Implementadas Conforme Critérios

### ✅ Telas Funcionais Integradas com API (40 pontos)
- **2 funcionalidades completas** (Oficinas e Mecânicos)
- **CRUD completo** para ambas as entidades
- **Tratamento de formulários** com validações e mensagens de erro
- **Indicadores de carregamento** em todas as chamadas de rede

### ✅ Sistema de Login (20 pontos)
- **Tela de Login** com validações
- **Tela de Cadastro** com validações completas
- **Logout funcional** com confirmação

### ✅ Estilização com Tema (15 pontos)
- **Modo claro e escuro** implementados
- **Personalização visual** consistente
- **Material Design guidelines** seguidas
- **Identidade visual** coerente e criativa

### ✅ Arquitetura de Código (15 pontos)
- **Organização lógica** de arquivos e componentes
- **Nomeação clara** e padronizada
- **Separação de responsabilidades** bem definida
- **Código limpo** e bem estruturado
- **Boas práticas React Native** aplicadas

## Como Testar

### 🔧 Configuração Importante
O aplicativo está configurado em **MODO SIMULADO** por padrão, funcionando sem necessidade da API. Para ativar a API real:

1. Abra o arquivo `src/services/ApiService.ts`
2. Altere `const OFFLINE_MODE = true;` para `const OFFLINE_MODE = false;`
3. Certifique-se de que sua API .NET esteja rodando em `http://localhost:7054`

### Autenticação (Modo Simulado)
1. Abra o app (será direcionado para Login)
2. **Use as credenciais de teste:**
   - Email: `teste@moop.com`
   - Senha: `123456`
   - Ou clique em "Preencher Automaticamente"
3. Alternativamente, clique em "Não tem conta? Cadastre-se" para criar uma nova conta

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
- **Verde "API Online"**: A API está respondendo normalmente
- **Amarelo "Modo Simulado"**: API offline, usando dados simulados
- Use o botão de refresh para verificar o status novamente

## Observações Importantes

- Certifique-se de que a API .NET esteja rodando antes de testar as funcionalidades
- As validações seguem as mesmas regras dos models da API
- O armazenamento local (AsyncStorage) é usado para manter sessão e preferências
- Todas as operações de rede possuem tratamento de erro adequado
- O aplicativo funciona offline para as funcionalidades existentes (mapa, estatísticas locais)

## Migração para um novo repositório (Plano B)

Como a sua API .NET já está em outro repositório, você pode migrar este app Expo para um repositório limpo seguindo estes passos:

1. Crie um repositório vazio no GitHub (ex.: `moop-app-expo`).
2. Nesta pasta (`MoopApp/`), inicialize o Git e faça o primeiro commit.
3. Aponte o remoto e publique.

Exemplo de comandos (no PowerShell):

```powershell
git init
git add .
git commit -m "chore: initial import (Expo app)"
git remote add origin https://github.com/<seu-usuario>/<seu-repo>.git
git branch -M main
git push -u origin main
```

Notas de integração com a API:
- Mantenha a API .NET no repositório dedicado (já separado).
- Exponha `GET /api/health` para o health check.
- Confirme os endpoints (Oficina, Mecanico, Deposito) e o casing: `GET /api/Deposito` (paginado), `GET /api/Deposito/{id}`, `POST /api/Deposito`, `PUT /api/Deposito/{id}`, `DELETE /api/Deposito/{id}`.
- Ajuste o `OFFLINE_MODE` em `src/services/ApiService.ts` (true = simulado; false = API real).

URLs e CORS:
- Expo Web tipicamente roda em `http://localhost:19006` (ou `https://localhost:19006`).
- Adicione essas origens na policy de CORS da sua API.
- Se usar HTTPS, confie no certificado dev com `dotnet dev-certs https --trust`.
