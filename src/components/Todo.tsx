import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark,faTrash, faCheck, faEdit, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { db } from "../Firebase";
import { collection, deleteDoc, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { async } from "@firebase/util";

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<any[]>();
  const [icons, setIcons] : [any, any] = useState();
  const [currClicked, setCurrClicked] : [any, any] = useState()
  const [currEditing, setCurrEditing] = useState<any[]>();


  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosData: any[] = [];
      querySnapshot.forEach((doc) => {
        todosData.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosData);
    });
  }, []);

  const handleShowMore = (e:any, index:number) : void => {
    e.target.classList.toggle('clicked');
    console.log(index);
    
    setCurrClicked(index);
    const parent = document.querySelectorAll('.todo-list > div')[index];
    const elemnets : HTMLCollection = parent.children;
    console.log('Clicked show more');
    
    if(e.target.classList.contains('clicked')) {
      parent.classList.add('-ml-16');
      elemnets[elemnets.length-1].classList.remove('hidden');
      setTimeout(() => {
        elemnets[elemnets.length-1].classList.remove('opacity-0');
      }, 0);
    } else {
      parent.classList.remove('-ml-16');
      elemnets[elemnets.length-1].classList.add('opacity-0');
      setTimeout(() => {
        elemnets[elemnets.length-1].classList.remove('hidden');
        setCurrClicked(null);
      }, 0);
    }
  }

  const handleDoneTask = async (e:any ,el:any) : Promise<void> => {
    if(e.target.nodeName !== 'svg') {
      await updateDoc(doc(db, 'todos', el.id), {
        done: !el.done,
      })
    }
    
  }

  const handleDelete = async (el:any) : Promise<void> => {
    await deleteDoc(doc(db, 'todos', el.id));
  }

  const handleEditing = async (el:any, event:any,index:number) : Promise<void> => {
    const editingInput = document.getElementById('editingTodoText') as HTMLInputElement;
    document.querySelector('.before-layer')?.classList.remove('scale-0');
    editingInput.value = el.title;
    document.querySelector('.editing')?.classList.remove('scale-0');
    
    const submitEditing = document.querySelector('.submit-editing') as HTMLButtonElement;

    submitEditing.addEventListener('click', () => {
      el.title = editingInput.value;
      handleSubmitEditing(el.id, el.title);
    })
    
  }

  const handleSubmitEditing = async (id:string, title:string) => {
    const input = document.getElementById('editingTodoText') as HTMLInputElement;
    await updateDoc(doc(db, 'todos', id), {title: title});
    document.querySelector('.before-layer')?.classList.add('scale-0');
    input.value = '';
    document.querySelector('.editing')?.classList.add('scale-0');
  }

  const elements = !todos ? null : todos.map((el:any, index:number) => {
    const classes = el.done ? `rounded-box cursor-pointer mt-3 
    bg-green-600 relative
    hover:bg-green-700  transition-all duration-500 w-[100%]` : 
    `rounded-box cursor-pointer mt-3 
    bg-slate-600 relative
    hover:bg-slate-700  transition-all duration-500 w-[100%]`;
    let check;
    if(el.done) {
      check = <FontAwesomeIcon icon={faCheck}
      className="absolute left-5
        top-1/2 -translate-y-1/2 p-2"/>
    }
    return(
      <div key={el.id} className={classes}
        onClick={(e) => handleDoneTask(e,el)}>
          {check}
        <p className="break-words">{el.title}</p>
        <FontAwesomeIcon icon={faEllipsis} size={'sm'} className="absolute right-2
          top-1/2 -translate-y-1/2 p-2 hover:bg-slate-500 rounded-full
          transition-colors duration-300" 
          onClick={(e) => handleShowMore(e, index)}/>
        <div className="hidden opacity-0 transition-opacity duration-1000 bg-white absolute z-30
          -right-20 top-1/2
          -translate-y-1/2">
        <FontAwesomeIcon icon={faTrash} size={'sm'} className="absolute right-2
          top-1/2 -translate-y-1/2 p-2 hover:bg-slate-500 rounded-full
          transition-colors duration-300" 
          onClick={() => handleDelete(el)}/>
        <FontAwesomeIcon icon={faEdit} className="absolute right-10
          top-1/2 -translate-y-1/2 p-2 hover:bg-slate-500 rounded-full
          transition-colors duration-300"
          onClick={(e) => handleEditing(el, e, index)}/>
      </div>
      </div>
    )
  })

  return (
    <>
    <div
        className="editing p-4 w-96 rounded-lg bg-slate-800
      absolute center scale-0 transition-transform duration-500 text-2lg z-50"
      >
        <FontAwesomeIcon
          icon={faXmark}
          size={"xl"}
          className="absolute right-4 top-4 cursor-pointer"
          onClick={() => {
            document.querySelector('.before-layer')?.classList.add('scale-0');
            document.querySelector('.editing')?.classList.add('scale-0');
          }}
        />
        <input
          id="editingTodoText"
          type="text"
          className="outline-none mt-16 p-3
        bg-slate-600 w-full rounded-3xl
        focus:shadow-xl
        focus:-translate-y-1 transition-all duration-500"
          placeholder="Todo..."
        />
        <button
          className="submit-editing block mt-10 ml-auto p-3
        hover:bg-slate-700 rounded-md transition-colors duration-70"
        >
          Edit
        </button>
      </div>
      <div className="todo-list">{elements}</div>
    </>
  );
};

export default Todo;
