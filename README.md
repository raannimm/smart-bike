** Smart Bike

Système de vélo connecté basé sur un ESP32, avec un dashboard web temps réel inspiré des interfaces de bord type Tesla : scène 3D interactive, télémétrie live, clignotants pilotables (clic ou voix), et géolocalisation en direct.

+ Sommaire
Aperçu
Stack technique
Structure du dépôt
Installation
Utilisation
Roadmap
+ Aperçu

Le système couvre :

Télémétrie temps réel : vitesse, batterie, position GPS, IMU
Scène 3D interactive du vélo (rotation X/Y/Z pilotable au clavier)
Clignotants activables par clic ou par commande vocale, avec retour visuel sur le modèle 3D
Carte de localisation avec tracé du trajet en direct
Simulateur MQTT permettant de développer le frontend sans dépendre du matériel ESP32

Toute la communication passe par un broker MQTT central — aucune dépendance BLE.


+Bloc	Rôle	Communication
ESP32 (firmware)	Lit les capteurs, publie les données, écoute les commandes clignotants	MQTT (TCP 1883) via WiFi
Broker MQTT	Relaie les messages entre ESP32 et client(s) web	MQTT natif (1883) + WebSocket (8083/8084)
Dashboard (React)	S'abonne à la télémétrie, affiche 3D/carte/jauges, publie les commandes	MQTT via WebSocket
Backend Node.js (optionnel)	Archive l'historique, expose une API REST	MQTT (TCP) + REST

+Stack technique

Firmware (ESP32)

PlatformIO (Arduino framework) — board esp32dev
PubSubClient (MQTT) · ArduinoJson
GPS NEO-6M (UART) · IMU MPU6050 (I2C)

Frontend (Dashboard)

Vite · React + TypeScript
three.js + @react-three/fiber + @react-three/drei (scène 3D)
Zustand (état global)
mqtt.js (WebSocket)
react-leaflet + OpenStreetMap (carte)
Tailwind CSS v4
Web Speech API (commande vocale)

Infra

Broker dev : broker.hivemq.com (public, port 1883)
Broker prod (prévu) : Mosquitto / HiveMQ Cloud / EMQX (TLS + auth)
MQTT Explorer (debug)

📁 Structure du dépôt
smart-bike/
├── smartbike-simulator/   # Simulateur Node.js (données factices MQTT)
│   ├── simulator.js
│   └── package.json
└── smartbike-dashboard/   # Dashboard React (frontend)
    └── ...
🚀 Installation
Simulateur
bash
cd smartbike-simulator
npm install
node simulator.js
Dashboard
bash
cd smartbike-dashboard
npm install
npm run dev
▶️ Utilisation
Lance le simulateur (ou le firmware ESP32 réel) pour publier des données sur smartbike/data
Lance le dashboard : il se connecte automatiquement au broker MQTT
Vérifie les topics avec MQTT Explorer si besoin (host broker.hivemq.com, port 1883)
🗺️ Roadmap
 Simulateur MQTT fonctionnel
 Connexion MQTT ↔ dashboard
 Scène 3D du vélo
 Contrôle clignotants (clic + voix)
 Carte de géolocalisation
 Backend historique + statistiques
 Broker sécurisé (TLS + auth) pour la production
👤 Auteur

Projet réalisé dans le cadre d'un stage — ESPRIT (École Supérieure Privée d'Ingénierie et de Technologies)
