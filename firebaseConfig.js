import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA70h_1NC8iuA2McQDwMCz6Y4U7YPjcRkI",
  authDomain: "datos-57ac7.firebaseapp.com",
  projectId: "datos-57ac7",
  storageBucket: "datos-57ac7.firebasestorage.app",
  messagingSenderId: "480042261394",
  appId: "1:480042261394:web:bf8e5f521c7b6c634cff4b"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener la instancia de Firestore
const db = getFirestore(app);

export { db };
