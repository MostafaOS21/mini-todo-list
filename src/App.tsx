import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import Todo from "./components/Todo";
import axios from "axios";
import { db } from "./Firebase";
import { collection, addDoc } from "firebase/firestore";
import { async } from "@firebase/util";

const showAdding = (): void => {
  const adding = document.querySelector(".adding") as HTMLDivElement;
  adding.classList.remove("scale-0");
  document.body.classList.add('overflow-hidden');
  document.querySelector('span.before-layer')?.classList.remove('scale-0');
};

const hideAdding = () : void => {
  const adding = document.querySelector(".adding") as HTMLDivElement;
  adding.classList.add("scale-0");
  document.body.classList.remove('overflow-hidden');
  document.querySelector('span.before-layer')?.classList.add('scale-0');
};

function App() {
  let [title, setTitle] = useState("");
  const addTodo = async (e:any) : Promise<void> => {
    e.preventDefault();
    let input = document.getElementById('todoText') as HTMLInputElement;
    let inputVal : string = input.value;
    
    if(inputVal !== "") {
      console.log(inputVal);
      await addDoc(collection(db, "todos"), {
        title: inputVal,
        done: false,
      })

    }

    input.value = '';

    hideAdding();
  };

  return (
    <div
      className="App  relative
      h-[100vh] p-10 py-10 pt-20
      bg-slate-900 text-white flex justify-start items-center
      flex-col gap-2"
    >
      <span className="before-layer scale-0
      transition-transform duration-1000
      center"></span>
      <button
        className="rounded-box bg-white text-slate-900
      hover:bg-slate-400 transition-all duration-1000"
        onClick={showAdding}
      >
        + Add a todo
      </button>
      <div
        className="adding p-4 w-96 rounded-lg bg-slate-800
      fixed center scale-0 transition-transform duration-500 text-2lg z-50"
      >
        <FontAwesomeIcon
          icon={faXmark}
          size={"xl"}
          onClick={hideAdding}
          className="absolute right-4 top-4 cursor-pointer"
        />
        <input
          id="todoText"
          type="text"
          className="outline-none mt-16 p-3
        bg-slate-600 w-full rounded-3xl
        focus:shadow-xl
        focus:-translate-y-1 transition-all duration-500"
          placeholder="Todo..."
        />
        <button
          className="block mt-10 ml-auto p-3
        hover:bg-slate-700 rounded-md transition-colors duration-70"
          onClick={(e) => addTodo(e)}
        >
          Submit
        </button>
      </div>
      <Todo />
    </div>
  );
}

export default App;
