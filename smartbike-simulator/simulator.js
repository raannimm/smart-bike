const mqtt = require("mqtt");

// ===============================
// MQTT
// ===============================

const broker = "mqtt://broker.hivemq.com";

const client = mqtt.connect(broker);

// ===============================
// Connexion
// ===============================

client.on("connect", () => {

    console.log("✅ Connecté au broker MQTT");

    // Envoyer les données toutes les secondes
    setInterval(() => {

        const data = {
            speed: 25,
            battery: 82,
            lat: 36.8065,
            lng: 10.1815,
            distance: Math.floor(Math.random() * 200)
        };

        const message = JSON.stringify(data);

        client.publish(
            "smartbike/data",
            message
        );

        console.log("📤 Données envoyées :");
        console.log(message);

    }, 1000);
});

// ===============================
// Erreur
// ===============================

client.on("error", (error) => {

    console.error("❌ Erreur MQTT :", error);

});