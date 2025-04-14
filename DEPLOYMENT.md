
# Instruções para Deployment da Aplicação BidSmart

Este documento contém instruções para o correto deployment da aplicação BidSmart em ambiente de produção, incluindo a configuração de domínio personalizado e certificados SSL.

## Preparação de Ambiente

### 1. Preparando a Aplicação para Build
Antes de realizar o deploy, certifique-se de que o build de produção está funcionando corretamente:

```bash
# Instale todas as dependências
npm install

# Gere o build de produção
npm run build

# Teste o build localmente
npm run preview
```

Certifique-se que a aplicação está funcionando conforme esperado, incluindo o armazenamento local de dados.

## Configuração de Domínio

### 1. Aquisição de Domínio
- Registre seu domínio em um provedor confiável como Namecheap, GoDaddy ou Google Domains.
- Recomendamos domínios `.com`, `.com.br` ou `.app` para aplicações de investimentos imobiliários.

### 2. Configuração de DNS
Para configurar seu domínio para apontar para sua aplicação, você precisará adicionar registros DNS:

**Opção 1: Se estiver usando serviços como Netlify, Vercel ou GitHub Pages:**
   ```
   Tipo: CNAME
   Nome: @
   Valor: [seu-subdominio].netlify.app (ou equivalente)
   TTL: 3600
   ```

**Opção 2: Se estiver usando um servidor próprio:**
   ```
   Tipo: A
   Nome: @
   Valor: [Endereço IP do seu servidor]
   TTL: 3600
   ```

**Para configurar o subdomínio "www":**
   ```
   Tipo: CNAME
   Nome: www
   Valor: @
   TTL: 3600
   ```

### 3. Verificação da Propagação de DNS
Após configurar os registros DNS, você pode verificar a propagação usando ferramentas como:
- [DNSChecker](https://dnschecker.org/)
- [whatsmydns.net](https://www.whatsmydns.net/)

A propagação pode levar de 24 a 48 horas.

## Configuração de Certificados SSL

### 1. Certificados Let's Encrypt (Gratuito)

#### Opção 1: Usando serviços de hospedagem modernos
A maioria dos serviços como Netlify, Vercel, GitHub Pages e Firebase Hosting oferece SSL automático com Let's Encrypt.

#### Opção 2: Configuração manual em servidor próprio

Se estiver usando um servidor próprio (como Apache ou Nginx), use o Certbot:

```bash
# Instalação do Certbot no Ubuntu/Debian
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx  # para Nginx
sudo apt-get install certbot python3-certbot-apache  # para Apache

# Obtenção do certificado
sudo certbot --nginx -d seudominio.com -d www.seudominio.com  # para Nginx
sudo certbot --apache -d seudominio.com -d www.seudominio.com  # para Apache
```

#### Opção 3: Renovação automática do certificado
Configure a renovação automática dos certificados Let's Encrypt:

```bash
# Verificar se a renovação automática está funcionando
sudo certbot renew --dry-run

# A renovação geralmente é configurada como um cron job
sudo crontab -e

# Adicione a linha abaixo para verificar duas vezes por dia
0 */12 * * * certbot renew --quiet
```

### 2. Configuração HTTPS no Servidor

#### Para Nginx:

```nginx
server {
    listen 443 ssl;
    server_name seudominio.com www.seudominio.com;

    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;

    # Configurações de segurança recomendadas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Headers de segurança
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";

    # Configuração para uma Single Page Application (SPA)
    root /var/www/bidsmart;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}

# Redirecionamento de HTTP para HTTPS
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;
    return 301 https://$host$request_uri;
}
```

#### Para Apache:

```apache
<VirtualHost *:443>
    ServerName seudominio.com
    ServerAlias www.seudominio.com
    
    DocumentRoot /var/www/bidsmart
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/seudominio.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/seudominio.com/privkey.pem
    
    # Headers de segurança
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-XSS-Protection "1; mode=block"
    
    <Directory /var/www/bidsmart>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Para SPAs (Single Page Applications)
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Cache para assets estáticos
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
        Header set Cache-Control "max-age=2592000, public"
    </FilesMatch>
    
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

# Redirecionamento de HTTP para HTTPS
<VirtualHost *:80>
    ServerName seudominio.com
    ServerAlias www.seudominio.com
    
    Redirect permanent / https://seudominio.com/
</VirtualHost>
```

## Verificação após Deployment

Após o deployment, verifique:

1. **Teste de SSL**: Use [SSL Labs](https://www.ssllabs.com/ssltest/) para verificar a segurança do seu certificado SSL.
2. **Verificação de IndexedDB**: Certifique-se que o armazenamento local está funcionando em diferentes navegadores.
3. **Compressão de Arquivos**: Confirme que gzip/brotli está habilitado para melhor performance.
4. **Headers de Segurança**: Verifique que os headers de segurança estão configurados corretamente.
5. **Responsividade**: Teste a aplicação em vários dispositivos e tamanhos de tela.

## Considerações sobre PWA (Progressive Web App)

Para melhorar a experiência do usuário, considere ativar as funcionalidades de PWA:

1. Verifique se o manifesto (`manifest.json`) está corretamente configurado
2. Certifique-se que o Service Worker está configurado para cache e uso offline
3. Teste se a aplicação é instalável em dispositivos móveis

## Monitoramento e Manutenção

### Monitoramento de Erros no Cliente
Como a aplicação usa armazenamento local, considere implementar um sistema de log de erros do cliente:

```javascript
window.addEventListener('error', function(event) {
  // Armazenar logs localmente ou enviar para um serviço de monitoramento
  console.error('Erro capturado:', event.error);
});
```

### Backups Automáticos
Recomende aos usuários realizar backups regulares usando a funcionalidade de exportação já implementada na aplicação.

## Considerações de Privacidade

Como a aplicação armazena dados sensíveis localmente:

1. Implemente uma política de privacidade clara sobre quais dados são armazenados
2. Explique aos usuários que os dados são armazenados apenas em seus dispositivos
3. Forneça instruções sobre como limpar os dados se necessário
