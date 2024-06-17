import { Feather } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { InferSelectModel } from 'drizzle-orm';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import authenticatedFetch from '../../common/authenticatedFetch';
import ButtonCircle from '../../common/components/ButtonCircle';
import { categories as categoriesTable } from '../../common/db/schema';
import { TaskUpdateRequest } from '../api/taskDetailEdit+api';

const TaskDetailScreen = () => {
  const [show, setShow] = useState(false);
  const [task, setTask] = useState({
    taskname: '',
    category_id: '',
    category_name: '',
    due_date: '',
    importance: '',
    description: '',
  });
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const [categories, setCategories] = useState<
    Array<InferSelectModel<typeof categoriesTable>>
  >([]);

  const setDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      const utcDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      );
      setTask({ ...task, due_date: utcDate.toISOString() });
    }
    setShow(false); // Close the DateTimePicker after selecting a date
  };

  const fetchTask = async () => {
    const taskData = await authenticatedFetch(
      `/api/taskDetails?task_id=${taskId}`
    );
    console.log('Task data:');
    console.log(taskData);
    const category = categories.find(
      (cat) => cat.category_id.toString() === taskData.category_id.toString()
    );
    setTask({
      taskname: taskData.taskname,
      category_id: taskData.category_id,
      category_name: category ? category.categoryname : '',
      due_date: new Date(taskData.due_date).toISOString(),
      importance: taskData.importance,
      description: taskData.description,
    });
  };

  const fetchCategoryname = async () => {
    const newCategories = await authenticatedFetch<
      Array<InferSelectModel<typeof categoriesTable>>
    >(`/api/categoryView`);
    console.log('Category data:');
    console.log(newCategories);
    setCategories(newCategories);
  };

  useEffect(() => {
    fetchTask();
  }, [categories]);

  useEffect(() => {
    fetchCategoryname();
  }, []);

  const validateInput = () => {
    if (
      isNaN(parseInt(task.importance)) ||
      parseInt(task.importance) < 1 ||
      parseInt(task.importance) > 5
    ) {
      Alert.alert('Validation Error', 'Importance must between 1 to 5.');
      return false;
    }
    return true;
  };

  async function handleTaskUpdate() {
    if (!validateInput()) {
      return;
    }

    const body: TaskUpdateRequest = {
      task_id: Number(taskId),
      category_id: Number(task.category_id),
      taskname: task.taskname,
      due_date: new Date(task.due_date),
      description: task.description,
      importance: Number(task.importance),
    };

    console.log('Task Update Request:', body);

    authenticatedFetch('/api/taskDetailEdit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((data) => {
        console.log('Task Update successful:', data);
        Alert.alert('Success', 'Task successfully updated.');
      })
      .catch((error) => {
        console.error('Task Update failed:', error);
        Alert.alert('Error', 'Failed to update task.');
      });
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['rgba(255, 0, 0, 0.72)', 'white']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '110%',
        }}
      />
      <View style={styles.tasksWrapper}>
        <Dropdown
          data={categories}
          placeholderStyle={{ color: 'white' }}
          labelField='categoryname'
          valueField='category_id'
          placeholder={task.category_name || 'Select Category'}
          value={task.category_id}
          onChange={(item) => {
            setTask({
              ...task,
              category_id: item.category_id.toString(),
              category_name: item.categoryname,
            });
          }}
        />

        <Text style={styles.sectionTitle}></Text>
        <TextInput
          style={styles.sectionTitle}
          onChangeText={(text) => setTask({ ...task, taskname: text })}
          value={task.taskname}
          placeholder='Task Name'
        />
        <View style={styles.items}>
          <TouchableWithoutFeedback onPress={() => setShow(true)}>
            <View style={styles.itemLeft}>
              {show && (
                <DateTimePicker
                  mode='date'
                  onChange={setDate}
                  value={new Date(task.due_date)}
                />
              )}
              <Text style={styles.itemLeft}>
                Due Date: {new Date(task.due_date).toLocaleDateString()}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.itemLeft}>
            <Text style={styles.itemLeft}>Importance: </Text>
            <TextInput
              style={styles.itemLeft}
              keyboardType='number-pad'
              onChangeText={(number) =>
                setTask({ ...task, importance: number })
              }
              value={task.importance.toString()}
            />
          </View>
          <Text style={styles.itemLeft}>Description: {task.description}</Text>
          <TextInput
            style={styles.item}
            onChangeText={(text) => setTask({ ...task, description: text })}
            placeholder='Task Description'
          />
        </View>
        {/* Add additional task details here */}
        <View style={styles.delbtn}>
          <MaterialIcons
            name='delete-outline'
            size={24}
            color='white'
            onPress={() => {
              Alert.alert(
                'Delete Task',
                'Are you sure you want to delete this task?\n"' +
                  task.taskname +
                  '" will be permanently deleted.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: async () => {
                      await authenticatedFetch(`/api/taskDeletion`, {
                        method: 'DELETE',
                        body: JSON.stringify({ task_id: taskId }),
                      });
                      Alert.alert('Success', 'Task successfully deleted.');
                      router.push(`../tasks`);
                    },
                  },
                ]
              );
            }}
          />
        </View>
        <View style={styles.btn}>
          <ButtonCircle onPress={handleTaskUpdate}>
            <View>
              <Feather name='check' size={24} color='white' />
            </View>
          </ButtonCircle>
        </View>
      </View>
    </View>
  );
};

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
  items: {
    marginTop: 30,
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
    color: '#fff',
    marginBottom: 10,
  },
  itemText: {
    alignSelf: 'center',
  },
  categoryTitle: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  btn: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  delbtn: {
    position: 'relative',
    paddingHorizontal: 20,
    paddingVertical: 30,
    bottom: 10,
    width: '100%',
    color: 'white',
  },
});

export default TaskDetailScreen;
