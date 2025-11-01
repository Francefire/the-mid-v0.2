# Déploiement CapRover - Configuration WebSocket

## Problème identifié
Les WebSockets Appwrite ne fonctionnent pas car les connexions se font du navigateur vers Appwrite (connexion sortante), pas vers votre app CapRover.

## Solution

### 1. Variables d'environnement CapRover
Dans l'onglet "App Configs" de votre app CapRover, ajoutez :

```
VITE_APPWRITE_ENDPOINT=https://votre-instance-appwrite.com
VITE_APPWRITE_PROJECT_ID=votre_project_id
VITE_APPWRITE_PROJECT_NAME=votre_project_name
VITE_APPWRITE_DB_ID=votre_database_id
```

⚠️ **IMPORTANT** : L'endpoint DOIT utiliser `https://` (pas `http://`)

### 2. Paramètres CapRover requis
- ✅ WebSocket Support: **Activé**
- ✅ Force HTTPS: **Activé**
- ✅ Port Mapping: **80** (par défaut)

### 3. Configuration Appwrite
Dans votre console Appwrite :
- Allez dans Settings → Platforms
- Ajoutez votre domaine CapRover comme "Web App": `https://votre-app.caprover-domain.com`
- Activez les permissions de domaine

### 4. Debug WebSocket
Ouvrez la console du navigateur (F12) et vérifiez :
```javascript
// Dans la console, après avoir chargé la page
console.log('Endpoint:', import.meta.env.VITE_APPWRITE_ENDPOINT);
```

Si vous voyez `__VITE_APPWRITE_ENDPOINT__`, les variables ne sont pas remplacées correctement.

### 5. Tester la connexion WebSocket
```javascript
// Dans la console navigateur
const client = new Appwrite.Client();
client.setEndpoint('https://votre-instance-appwrite.com').setProject('votre-project-id');
client.subscribe('test', (response) => console.log('WebSocket OK!', response));
```

## Checklist de déploiement
- [ ] Variables d'environnement définies dans CapRover
- [ ] Endpoint Appwrite utilise HTTPS
- [ ] WebSocket Support activé dans CapRover
- [ ] Force HTTPS activé dans CapRover
- [ ] Domaine ajouté dans Appwrite Platform settings
- [ ] Rebuild et redéploiement de l'app
- [ ] Test dans la console navigateur

## Rebuild de l'app
Après avoir modifié les variables :
```bash
git add .
git commit -m "fix: websocket configuration"
git push
```

Puis dans CapRover, cliquez sur "Deploy" ou utilisez :
```bash
# Si vous utilisez le CLI CapRover
caprover deploy
```
