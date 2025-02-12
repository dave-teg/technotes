import { useState, useEffect } from "react";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import DeleteModal from "../../components/pages/DeleteModal";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const EditNoteForm = ({ users, note }) => {
  useTitle("techNotes: Edit Note")
  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation();

  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteNoteMutation();

  const { isAdmin, isManager } = useAuth();

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [completed, setCompleted] = useState(note.completed);
  const [user, setUser] = useState(note.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setText("");
      navigate("/dash/notes");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChange = (e) => setTitle(e.target.value);
  const onTextChange = (e) => setText(e.target.value);
  const onCompletedChange = (e) => setCompleted(e.target.checked);
  const onUserChange = (e) => setUser(e.target.value);

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id} className="text-black">
        {user.username}
      </option>
    );
  });

  const canSave = [title, text, user].every(Boolean) && !isLoading;

  const onSaveUser = async () => {
    if (canSave) {
      await updateNote({ id: note.id, title, text, completed, userId: user });
    }
  };

  const onDeleteUser = async () => {
    await deleteNote({ id: note.id });
    setIsModalOpen(false);
  };

  const errContent = (error?.data?.message || delError?.data?.message) ?? "";

  const createdAt = Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date(note.createdAt));

  const updatedAt = Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date(note.updatedAt));

  let deleteButton = null;
  if (isAdmin || isManager) {
    deleteButton = (
      <button
        className="cursor-pointer text-2xl transition hover:scale-110"
        title="Delete"
        onClick={() => setIsModalOpen(true)}
      >
        <FaTrashAlt />
      </button>
    );
  }

  const content = (
    <div className="max-w-[800px]">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-center justify-between">
          <h2>
            Edit Note <span>#{note?.ticketNo}</span>
          </h2>
          <div className="flex gap-2">
            <button
              className={`text-2xl transition ${canSave ? "cursor-pointer hover:scale-110" : "cursor-not-allowed opacity-50"}`}
              disabled={!canSave}
              title="save"
              onClick={onSaveUser}
            >
              <FaSave />
            </button>
            {deleteButton}
          </div>
        </div>
        <p className={isError || isDelError ? "errMsg" : "hidden"}>
          {errContent}
        </p>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          className={` ${!title ? "border-red-400" : "border-blue-400"}`}
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
        <div className="mt-2 flex items-center gap-2">
          <label htmlFor="completed">Work Completed</label>
          <input
            type="checkbox"
            checked={completed}
            onChange={onCompletedChange}
            className="size-4 cursor-pointer accent-blue-500"
          />
        </div>
        <div className="mt-2 flex items-start gap-2">
          <label htmlFor="user">Assigned To:</label>
          <select
            name="user"
            id="user"
            onChange={onUserChange}
            className="min-w-[160px] border border-black bg-white p-0.25 text-black"
          >
            {options}
          </select>
        </div>
        <div className="mt-3 flex gap-2">
          <p>Created At:</p>
          <p>{createdAt}</p>
        </div>
        <div className="mt-3 flex gap-2">
          <p>Updated At:</p>
          <p>{updatedAt}</p>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onDeleteUser}
        item={"note"}
      />
      {content}
    </>
  );
};

export default EditNoteForm;
