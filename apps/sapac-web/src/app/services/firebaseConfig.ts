// apps/sapac-web/src/services/firebaseConfig.ts
import { initializeApp, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyBudX6kUlmUgvsZSZeda9AcT4wGkimgDHM",
    authDomain: "sapac-670e4.firebaseapp.com",
    projectId: "sapac-670e4",
    storageBucket: "sapac-670e4.appspot.com",
    messagingSenderId: "675912575796",
    appId: "1:675912575796:web:025de52e420821100a9361",
    measurementId: "G-R3Z2X88967"
};

const app = initializeApp(firebaseConfig);

// Inicialización de los servicios de Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Conectar emuladores
const isLocalhost = location.hostname === "localhost";

// Authentication Emulator
if (isLocalhost) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

// Firestore Emulator
if (isLocalhost) {
    connectFirestoreEmulator(db, "127.0.0.1", 8082);
}

// Realtime Database Emulator
if (isLocalhost) {
    connectDatabaseEmulator(rtdb, "127.0.0.1", 9000);
}

// Storage Emulator
if (isLocalhost) {
    connectStorageEmulator(storage, "127.0.0.1", 9199);
}

// Functions Emulator
if (isLocalhost) {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

// Exportar los servicios configurados
export { app, auth, db, rtdb, storage, functions };