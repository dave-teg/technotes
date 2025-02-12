import { useState, useEffect } from "react";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

const NewNoteForm = ({ users }) => {
  useTitle("tecNotes: Create Note")
  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [user, setUser] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setText("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id} className="text-black">
        {user.username}
      </option>
    );
  });

  const onTitleChange = (e) => setTitle(e.target.value);
  const onTextChange = (e) => setText(e.target.value);
  const onUserChange = (e) => {
    setUser(e.target.value);
  };

  const canSave = [title, text, user].every(Boolean) && !isLoading;

  const onSaveUser = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewNote({ title, text, userId: user });
    }
  };

  return (
    <div className="max-w-[800px]">
      <form onSubmit={onSaveUser}>
        <div className="flex items-center justify-between">
          <h2>Add New Note</h2>
          <button
            disabled={!canSave}
            className={`${canSave ? "cursor-pointer transition hover:scale-110" : "cursor-not-allowed opacity-50"}`}
          >
            <FaSave className="size-6" />
          </button>
        </div>
        <p className={`${isError ? "errMsg" : "hidden"}`}>
          {error?.data?.message}
        </p>
        <label htmlFor="title" className="">
          Title
        </label>
        <input
          type="text"
          className={` ${!title ? "border-red-500" : "border-blue-500"}`}
          value={title}
          onChange={onTitleChange}
        />
        <label htmlFor="text">Description</label>
        <textarea
          name="text"
          id="text"
          rows="5"
          cols="45"
          className={`resize-none rounded-sm border-2 bg-white pl-2 text-black ${!text ? "border-red-400" : "border-blue-400"}`}
          value={text}
          onChange={onTextChange}
        ></textarea>
        <div className="mt-3 flex items-start gap-2">
          <label htmlFor="user">Assigned To:</label>
          <select
            className="min-w-[160px] border border-black p-0.25 text-black bg-white"
            name="user"
            id="user"
            value={user}
            onChange={onUserChange}
          >
            {options}
          </select>
        </div>
      </form>
    </div>
  );
};

export default NewNoteForm;
