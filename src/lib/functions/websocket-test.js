/**
 * Script de test WebSocket pour diagnostic en production
 * À exécuter dans la console du navigateur avec : testWebSocket()
 */

import { client } from '../appwrite';
import { config } from '../config';

/**
 * Test complet de la connexion WebSocket Appwrite
 * @returns {Promise<object>} Résultat du test
 */
export async function testWebSocket() {
  console.log('🔍 === Test WebSocket Appwrite ===\n');
  
  const results = {
    configValid: false,
    endpointReachable: false,
    websocketConnected: false,
    errors: []
  };

  try {
    // 1. Vérifier la configuration
    console.log('1️⃣ Vérification de la configuration...');
    console.log('Endpoint:', config.appwrite.endpoint);
    console.log('Project ID:', config.appwrite.projectId);
    console.log('Database ID:', config.appwrite.databaseId);
    
    if (config.appwrite.endpoint.includes('__VITE_')) {
      results.errors.push('❌ Variables d\'environnement non configurées !');
      console.error('❌ Les variables d\'environnement ne sont pas remplacées');
      console.log('→ Solution : Définir les variables dans CapRover App Configs');
      return results;
    }
    
    if (!config.appwrite.endpoint.startsWith('https://')) {
      results.errors.push('⚠️  Endpoint devrait utiliser HTTPS');
      console.warn('⚠️  L\'endpoint devrait utiliser HTTPS');
    }
    
    results.configValid = true;
    console.log('✅ Configuration valide\n');

    // 2. Tester l'accessibilité de l'endpoint
    console.log('2️⃣ Test d\'accessibilité de l\'endpoint...');
    try {
      const response = await fetch(config.appwrite.endpoint + '/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        results.endpointReachable = true;
        console.log('✅ Endpoint accessible\n');
      } else {
        results.errors.push(`❌ Endpoint retourne ${response.status}`);
        console.error(`❌ Endpoint retourne ${response.status}`);
      }
    } catch (error) {
      results.errors.push('❌ Endpoint inaccessible : ' + error.message);
      console.error('❌ Impossible d\'atteindre l\'endpoint:', error.message);
      console.log('→ Vérifiez que l\'URL est correcte\n');
    }

    // 3. Tester la connexion WebSocket
    console.log('3️⃣ Test de connexion WebSocket...');
    console.log('Tentative de souscription à "account"...');
    
    return new Promise((resolve) => {
      let timeout;
      let resolved = false;

      const unsubscribe = client.subscribe('account', (response) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          results.websocketConnected = true;
          console.log('✅ WebSocket connecté avec succès !');
          console.log('Réponse:', response);
          unsubscribe();
          
          // Résumé
          console.log('\n🎯 === Résumé du test ===');
          console.log('Configuration:', results.configValid ? '✅' : '❌');
          console.log('Endpoint accessible:', results.endpointReachable ? '✅' : '❌');
          console.log('WebSocket:', results.websocketConnected ? '✅' : '❌');
          
          if (results.errors.length > 0) {
            console.log('\n⚠️  Avertissements:');
            results.errors.forEach(err => console.log(err));
          }
          
          resolve(results);
        }
      });

      // Timeout après 5 secondes
      timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          results.errors.push('❌ WebSocket timeout (pas de réponse après 5s)');
          console.error('❌ WebSocket timeout - pas de réponse après 5 secondes');
          console.log('\n📋 Solutions possibles:');
          console.log('1. Vérifier que "WebSocket Support" est activé dans CapRover');
          console.log('2. Vérifier que le domaine est ajouté dans Appwrite → Platforms');
          console.log('3. Vérifier que "Force HTTPS" est activé dans CapRover');
          console.log('4. Vérifier les logs CapRover pour des erreurs');
          
          unsubscribe();
          
          // Résumé
          console.log('\n🎯 === Résumé du test ===');
          console.log('Configuration:', results.configValid ? '✅' : '❌');
          console.log('Endpoint accessible:', results.endpointReachable ? '✅' : '❌');
          console.log('WebSocket:', results.websocketConnected ? '✅' : '❌');
          console.log('\n⚠️  Problèmes détectés:');
          results.errors.forEach(err => console.log(err));
          
          resolve(results);
        }
      }, 5000);
    });

  } catch (error) {
    results.errors.push('❌ Erreur inattendue : ' + error.message);
    console.error('❌ Erreur lors du test:', error);
    return results;
  }
}

/**
 * Test simple de souscription à une collection spécifique
 * @param {string} channel - Canal de souscription (ex: "databases.dbId.collections.collId.documents")
 */
export function subscribeToChannel(channel) {
  console.log(`🔌 Souscription au canal: ${channel}`);
  
  const unsubscribe = client.subscribe(channel, (response) => {
    console.log('📨 Message reçu:', response);
  });

  console.log('✅ Souscription active');
  console.log('Pour désouscrire, gardez la référence de unsubscribe et appelez: unsubscribe()');
  
  return unsubscribe;
}

/**
 * Affiche la configuration actuelle
 */
export function showConfig() {
  console.log('📋 Configuration Appwrite:');
  console.log({
    endpoint: config.appwrite.endpoint,
    projectId: config.appwrite.projectId,
    projectName: config.appwrite.projectName,
    databaseId: config.appwrite.databaseId,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE
  });
}

/**
 * Vérifie si on est en production
 */
export function checkEnvironment() {
  console.log('🌍 Environnement:');
  console.log('Mode:', import.meta.env.MODE);
  console.log('Production:', import.meta.env.PROD);
  console.log('Dev:', import.meta.env.DEV);
  console.log('URL:', window.location.href);
  console.log('Protocol:', window.location.protocol);
  
  if (window.location.protocol === 'http:' && import.meta.env.PROD) {
    console.warn('⚠️  Vous êtes en HTTP en production - les WebSockets pourraient ne pas fonctionner');
    console.log('→ Activez "Force HTTPS" dans CapRover');
  }
}

// Exporter une fonction globale pour faciliter le test dans la console
if (typeof window !== 'undefined') {
  window.testAppwriteWebSocket = testWebSocket;
  window.showAppwriteConfig = showConfig;
  window.checkAppwriteEnv = checkEnvironment;
  window.subscribeAppwrite = subscribeToChannel;
  
  console.log('✨ Fonctions de test WebSocket disponibles:');
  console.log('- testAppwriteWebSocket() : Test complet');
  console.log('- showAppwriteConfig() : Afficher la config');
  console.log('- checkAppwriteEnv() : Vérifier l\'environnement');
  console.log('- subscribeAppwrite(channel) : Souscrire à un canal');
}
