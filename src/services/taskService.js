import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDocs, 
    query, 
    where, 
    orderBy 
  } from "firebase/firestore";
  import { auth, db } from "./firebase";
  
  // Get all tasks for the current user
  export const getAllTasks = async () => {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");
      
      const tasksRef = collection(db, "users", auth.currentUser.uid, "tasks");
      const tasksSnapshot = await getDocs(tasksRef);
      
      const tasks = [];
      tasksSnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, tasks };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Get completed tasks
  export const getCompletedTasks = async () => {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");
      
      const tasksRef = collection(db, "users", auth.currentUser.uid, "tasks");
      const q = query(tasksRef, where("completed", "==", true));
      const tasksSnapshot = await getDocs(q);
      
      const tasks = [];
      tasksSnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, tasks };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Get incomplete tasks
  export const getIncompleteTasks = async () => {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");
      
      const tasksRef = collection(db, "users", auth.currentUser.uid, "tasks");
      const q = query(tasksRef, where("completed", "==", false));
      const tasksSnapshot = await getDocs(q);
      
      const tasks = [];
      tasksSnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, tasks };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Add a new task
  export const createTask = async (taskData) => {
    try {
      const taskRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        createdAt: new Date(),
        completed: false,
      });
      return { id: taskRef.id, ...taskData };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };
  
  // Update a task
  export const updateTask = async (taskId, taskData) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, taskData);
      return { id: taskId, ...taskData };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };
  
  // Mark a task if it's comple or not complete
  export const toggleTaskCompletion = async (taskId, completed) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { completed });
      return { id: taskId, completed };
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  };
  
  // Delete a task
  export const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      return taskId;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  export const getTasks = async (userId) => {
    try {
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(tasksQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  };