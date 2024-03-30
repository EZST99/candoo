import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Verbindungsdaten
const connectionData = {
    host: "host",
    user: "user",
    password: "password",
    database: "database",
    servername: "localhost",
};

// Zuerst eine Verbindung zum MySQL-Server ohne Datenbankangabe
const initialConnection = await mysql.createConnection({
    host: connectionData.host,
    user: connectionData.user,
    password: connectionData.password,
    servername: connectionData.servername,
});

// Erstellen der Datenbank, falls sie nicht existiert
await initialConnection.query(`CREATE DATABASE IF NOT EXISTS \`${connectionData.database}\``);
await initialConnection.end(); // Schließen der initialen Verbindung

// Jetzt eine Verbindung zur spezifischen Datenbank
const connection = await mysql.createConnection(connectionData);

// Initialisiere Drizzle mit der Verbindung
const db = drizzle(connection);
