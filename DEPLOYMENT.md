
# Instruções para Deployment da Aplicação

Este documento contém instruções para o correto deployment da aplicação BidSmart em ambiente de produção, incluindo a configuração de domínio personalizado e certificados SSL.

## Configuração de Domínio

### 1. Aquisição de Domínio
- Registre seu domínio em um provedor confiável como Namecheap, GoDaddy ou Google Domains.
- Recomendamos domínios `.com`, `.com.br` ou `.app` para aplicações de investimentos imobiliários.

### 2. Configuração de DNS
Para configurar seu domínio para apontar para sua aplicação, você precisará adicionar registros DNS:

1. Acesse o painel de gerenciamento DNS do seu provedor de domínio
2. Adicione um registro A ou CNAME:
   
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

3. Se quiser configurar o subdomínio "www", adicione:
   ```
   Tipo: CNAME
   Nome: www
   Valor: @
   TTL: 3600
   ```

### 3. Propagação de DNS
Após configurar os registros DNS, aguarde a propagação, que pode levar de 24 a 48 horas.

## Configuração de Certificados SSL

### 1. Certificados Let's Encrypt (Gratuito)

**Opção 1: Usando serviços de hospedagem modernos:**
A maioria dos serviços como Netlify, Vercel, GitHub Pages e Firebase Hosting oferece SSL automático com Let's Encrypt.

**Opção 2: Configuração manual em servidor:**

Se estiver usando um servidor próprio (como Apache ou Nginx), você pode usar Certbot:

```bash
# Instalação do Certbot no Ubuntu/Debian
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx  # para Nginx
sudo apt-get install certbot python3-certbot-apache  # para Apache

# Obtenção do certificado
sudo certbot --nginx -d seudominio.com -d www.seudominio.com  # para Nginx
sudo certbot --apache -d seudominio.com -d www.seudominio.com  # para Apache
```

### 2. Certificados Pagos
Para casos que exigem EV (Extended Validation) ou recursos avançados, recomendamos:
- DigiCert
- Comodo SSL
- GlobalSign

### 3. Configuração HTTPS no Servidor

**Para Nginx:**

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

    # Local da aplicação
    root /var/www/bidsmart;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Redirecionamento de HTTP para HTTPS
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;
    return 301 https://$host$request_uri;
}
```

**Para Apache:**

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

## Verificações Finais

Antes de considerar o deployment concluído, verifique:

1. **Teste de SSL**: Use [SSL Labs](https://www.ssllabs.com/ssltest/) para verificar a segurança do seu certificado SSL.
2. **Compressão de Arquivos**: Certifique-se que gzip/brotli está habilitado para melhor performance.
3. **Headers de Segurança**: Confirme que os headers de segurança estão configurados corretamente.
4. **Responsividade**: Teste a aplicação em vários dispositivos e tamanhos de tela.
5. **Integridade dos Dados**: Certifique-se que o IndexedDB está funcionando corretamente em diversos navegadores.

## Considerações sobre PWA (Progressive Web App)

Para melhorar a experiência do usuário, considere converter sua aplicação em uma PWA:

1. Adicione um manifesto adequado (`manifest.json`)
2. Configure um Service Worker para cache e uso offline
3. Certifique-se que a aplicação é instalável em dispositivos móveis

Estas configurações permitem que usuários instalem a aplicação em seus dispositivos, melhorando a retenção e a experiência do usuário.
