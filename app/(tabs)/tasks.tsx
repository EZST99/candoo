import { AntDesign, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { InferSelectModel } from 'drizzle-orm';
import CheckBox from 'expo-checkbox';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import authenticatedFetch from '../../common/authenticatedFetch';
import ButtonCircle from '../../common/components/PlusButton';
import { tasks as tasksTable } from '../../common/db/schema';
import { MarkAsDoneResult } from '../api/markAsDone+api';
//import { mdiMagnify } from '@mdi/js';

interface Category {
  category_id: number;
  categoryname: string;
  color: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<
    (InferSelectModel<typeof tasksTable> & { color: string })[]
  >([]);
  const router = useRouter();
  const { category_id } = useLocalSearchParams<{ category_id: string }>();
  const [category, setCategory] = useState<Category[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState<'smart' | 'importance' | 'due_date'>(
    'smart'
  );

  useFocusEffect(
    useCallback(() => {
      getTasks();
      getCategory();
    }, [category_id])
  );

  async function getTasks() {
    try {
      let url = '/api/taskView';
      if (category_id !== undefined) {
        url = `/api/taskView?category_id=${category_id}`;
      }

      let data = await authenticatedFetch<
        Array<InferSelectModel<typeof tasksTable>>
      >(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      data = await Promise.all(
        data.map(async (task) => {
          let color = await getCategoryColor(task.category_id);
          return { ...task, color };
        })
      );

      setTasks(
        data as (InferSelectModel<typeof tasksTable> & { color: string })[]
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function getCategory() {
    try {
      if (category_id === undefined) {
        return;
      }

      let url = `/api/categoryDetails?category_id=${category_id}`;
      const data = await authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setCategory(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getCategoryColor(category_id: number) {
    try {
      const url = `/api/categoryDetails?category_id=${category_id}`;
      const data = await authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return data[0]?.color;
    } catch (error) {
      console.error(error);
    }
  }

  const handleTaskSelection = (taskId: number) => {
    const newDoneState = !tasks.find((task) => task.task_id === taskId)
      ?.is_done;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task_id === taskId ? { ...task, is_done: newDoneState } : task
      )
    );

    authenticatedFetch<MarkAsDoneResult>('/api/markAsDone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task_id: taskId,
        is_done: newDoneState,
      }),
    })
      .then(({ task_id, is_done }) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === task_id ? { ...task, is_done } : task
          )
        );
      })
      .catch((error) => {
        console.error('Task selection failed:', error);
      });
  };

  const TaskItem = ({
    taskname,
    color,
    task_id,
    is_done,
  }: {
    taskname: string;
    color: string;
    task_id: string;
    is_done: boolean;
  }) => {
    return (
      <TouchableOpacity
        key={parseInt(task_id)}
        onPress={() => router.push(`/task-detail/${task_id}`)}
      >
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <View style={[styles.square, { backgroundColor: color }]}></View>
            <Text style={styles.itemText}>{taskname}</Text>
          </View>
          <CheckBox
            value={is_done}
            onValueChange={() => handleTaskSelection(parseInt(task_id))}
          />
        </View>
      </TouchableOpacity>
    );
  };

  // Funktion zum Filtern der Tasks basierend auf dem Suchbegriff
  const filterTasks = (task: InferSelectModel<typeof tasksTable>) => {
    return task.taskname.toLowerCase().includes(searchTerm.toLowerCase());
  };

  // Event-Handler für die Änderung des Suchbegriffs
  const handleSearchTermChange = (text: string) => {
    setSearchTerm(text);
  };

  // Anwenden des Filters auf das tasks-Array
  const filteredTasks = tasks.filter(filterTasks);

  function sortSmart(
    a: InferSelectModel<typeof tasksTable>,
    b: InferSelectModel<typeof tasksTable>
  ) {
    const dueDateA = new Date(a.due_date);
    const dueDateB = new Date(b.due_date);

    // if a is more important and more urgent than b, rank a higher
    if (
      a.importance > b.importance &&
      dueDateA.getTime() < dueDateB.getTime()
    ) {
      return -1;
    }

    // if b is more important and more urgent than a, rank b higher
    if (
      b.importance > a.importance &&
      dueDateB.getTime() < dueDateA.getTime()
    ) {
      return 1;
    }

    // if a is more important than b, rank a higher
    if (a.importance > b.importance) {
      return -1;
    }

    // if b is more important than a, rank b higher
    if (b.importance > a.importance) {
      return 1;
    }

    // if a is more urgent than b, rank a higher
    if (dueDateA.getTime() < dueDateB.getTime()) {
      return -1;
    }

    // if b is more urgent than a, rank b higher
    if (dueDateB.getTime() < dueDateA.getTime()) {
      return 1;
    }

    return 0;
  }
  return (
    <>
      <View style={{ backgroundColor: '#FF0000' }}>
        <View>
          <TextInput
            style={styles.search}
            placeholder='Search'
            onChangeText={handleSearchTermChange}
          />
          <FontAwesome6 name='magnifying-glass' style={styles.magnifyer} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome
            name='sort-amount-desc'
            size={24}
            color='white'
            style={{ marginHorizontal: 15, marginVertical: 5, padding: 5 }}
          />
          <Dropdown
            style={styles.dropdown}
            data={
              [
                { label: 'Smart', value: 'smart' },
                { label: 'Due Date', value: 'due_date' },
                { label: 'Importance', value: 'importance' },
              ] as const
            }
            placeholderStyle={{ color: 'rgba(0, 0, 0, 0.19)' }}
            labelField='label'
            valueField='value'
            value={sort}
            // placeholder={!isFocus ? "Select category" : "..."}
            onChange={(item) => {
              setSort(item.value);
            }}
          />
        </View>
      </View>

      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(255, 0, 0, 0.72)', 'white']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '110%',
          }}
        />
        <Text style={styles.sectionTitle}>
          {category_id ? category?.[0]?.categoryname + ' \n' : 'All '}Tasks
        </Text>
        <ScrollView>
          {tasks.every((task) => task.is_done) ? (
            <Image
              source={require('../../assets/all-done.png')}
              style={{ width: 250, height: 250, alignSelf: 'center' }}
            />
          ) : null}
          {filteredTasks
            .sort((a, b) => {
              switch (sort) {
                case 'smart':
                  return sortSmart(a, b);
                case 'due_date':
                  return (
                    new Date(a.due_date).getTime() -
                    new Date(b.due_date).getTime()
                  );
                case 'importance':
                  return b.importance - a.importance;
                default:
                  return 0;
              }
            })
            .map((task) => (
              <TaskItem
                taskname={task.taskname}
                color={task.color}
                task_id={task.task_id.toString()}
                is_done={task.is_done}
                key={task.task_id}
              />
            ))}
        </ScrollView>
      </View>
      <View style={styles.addButton}>
        <ButtonCircle onPress={() => router.push('taskscreate')}>
          <View>
            <AntDesign name='plus' size={24} color='white' />
          </View>
        </ButtonCircle>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    /*alignItems: "center",
    justifyContent: "center",*/
  },
  tasksWrapper: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  square: {
    width: 25,
    height: 25,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    alignSelf: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  search: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    paddingLeft: 30,
    position: 'relative',
  },
  magnifyer: {
    position: 'absolute',
    top: 20,
    left: 15,
    fontSize: 20,
    color: 'gray',
    opacity: 0.5,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.19)',
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    textAlign: 'center',
    width: 200,
  },
});
