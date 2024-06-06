import { InferSelectModel } from 'drizzle-orm';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import authenticatedFetch from '../../common/authenticatedFetch';
import { tasks } from '../../common/db/schema';

export default function App() {
  const [quote, setQuote] = useState({ quote: '', author: '' });
  const [task, setTask] = useState<InferSelectModel<typeof tasks> | null>(null);

  const fetchQuote = async () => {
    try {
      const data = await authenticatedFetch('/api/quote');
      setQuote(data);
    } catch (error) {
      setQuote({
        quote: "Couldn't fetch quote. Now that's a quote!",
        author: 'Candoo Team',
      });
    }
  };

  const fetchTask = async () => {
    try {
      const data = await authenticatedFetch('/api/main-task');
      console.log(data);
      setTask(data);
    } catch (error) {
      setTask(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchQuote();
      fetchTask();
    }, [])
  );

  return (
    <View style={styles.container}>
      {quote !== null ? (
        <View style={styles.quoteContainer}>
          <Text style={styles.heading}>"{quote.quote}"</Text>
          <Text>— {quote.author}</Text>
        </View>
      ) : null}
      <View>
        {task ? (
          <Link
            href={`/task-detail/${task.task_id}`}
            style={styles.taskContainer}
          >
            <View>
              <Text style={styles.taskText}>Next task:</Text>
              <Text style={styles.taskName}>{task.taskname}</Text>
              <Text style={styles.taskText}>
                Due: {new Date(task.due_date).toDateString()}
              </Text>
            </View>
          </Link>
        ) : null}

        <View style={styles.imageContainer}>
          <Image
            source={
              task
                ? require('../../assets/get-things-done.webp')
                : require('../../assets/all-done.png')
            }
            style={{ width: 250, height: 250 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  quoteContainer: {
    marginBottom: 12,
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 8,
  },
  heading: {
    fontSize: 24,
    marginBottom: 24,
  },
  taskContainer: {
    marginTop: 24,
    backgroundColor: '#ff0000b8',
    padding: 12,
    borderRadius: 8,
  },
  taskName: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 26,
  },
  taskText: {
    color: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
});
