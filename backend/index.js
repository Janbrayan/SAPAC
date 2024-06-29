const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'sapac-670e4' // Reemplaza 'your-project-id' con el ID de tu proyecto Firebase
});

// Configurar Firebase para usar los emuladores
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8082';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Servidor en funcionamiento');
});

app.post('/createUser', async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    const db = admin.firestore();
    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      role,
    });

    res.status(200).send({ message: 'Usuario creado exitosamente', uid: userRecord.uid });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(400).send({ message: 'Error al crear el usuario', error: error.message });
  }
});

app.put('/updateUser/:id', async (req, res) => {
  const { id } = req.params;
  const { email, name, role } = req.body;

  try {
    // Actualizar usuario en Firebase Authentication
    await admin.auth().updateUser(id, { email });

    // Actualizar usuario en Firestore
    const db = admin.firestore();
    await db.collection('users').doc(id).update({ name, email, role });

    res.status(200).send({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(400).send({ message: 'Error al actualizar el usuario', error: error.message });
  }
});

app.delete('/deleteUser/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Eliminar usuario de autenticación
    await admin.auth().deleteUser(id);

    // Eliminar usuario de Firestore
    const db = admin.firestore();
    await db.collection('users').doc(id).delete();

    res.status(200).send({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(400).send({ message: 'Error al eliminar el usuario', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
