import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { db } from './firebaseConfig'; // Asumiendo que firebaseConfig está configurado correctamente
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Obtener las dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

const App = () => {
  const [target, setTarget] = useState({ x: 100, y: 100 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [topScores, setTopScores] = useState([]);

  const getRandomPosition = () => {
    const x = Math.floor(Math.random() * (width - 100));
    const y = Math.floor(Math.random() * (height - 100));
    return { x, y };
  };

  const moveTarget = () => {
    setTarget(getRandomPosition());
  };

  const handleClick = () => {
    setScore(score + 1);
    moveTarget();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      moveTarget();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
      saveScore(score);
      fetchTopScores();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const saveScore = async (score) => {
    try {
      await addDoc(collection(db, 'scores'), {
        score,
        timestamp: new Date(),
      });
    } catch (e) {
      console.error('Error al guardar el puntaje: ', e);
    }
  };

  const fetchTopScores = async () => {
    const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(5));
    const querySnapshot = await getDocs(q);
    const scoresArray = querySnapshot.docs.map((doc) => doc.data());
    setTopScores(scoresArray);
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    moveTarget();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Caza el Círculo</Text>
      <Text style={styles.score}>Puntaje: {score}</Text>
      <Text style={styles.timer}>Tiempo restante: {timeLeft}s</Text>

      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>¡Tiempo agotado!</Text>
          <Text style={styles.gameOverText}>Puntaje final: {score}</Text>
          <TouchableOpacity style={styles.button} onPress={restartGame}>
            <Text style={styles.buttonText}>Jugar de nuevo</Text>
          </TouchableOpacity>
          <View style={styles.leaderboard}>
            <Text style={styles.leaderboardTitle}>🏆 Mejores Puntajes</Text>
            {topScores.map((entry, index) => (
              <Text key={index} style={styles.leaderboardItem}>
                Puntaje: {entry.score}
              </Text>
            ))}
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.target, { top: target.y, left: target.x }]}
          onPress={handleClick}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 20,
    marginVertical: 10,
  },
  timer: {
    fontSize: 20,
    marginBottom: 20,
  },
  gameOverContainer: {
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  leaderboard: {
    marginTop: 20,
    alignItems: 'center',
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  leaderboardItem: {
    fontSize: 18,
  },
  target: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: 'red',
    borderRadius: 50,
  },
});

export default App;
