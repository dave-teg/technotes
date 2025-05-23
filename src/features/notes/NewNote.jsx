import { useSelector } from "react-redux"
import { selectAllUsers } from "../users/usersApiSlice"
import NewNoteForm from "./NewNoteForm";

const NewNote = () => {
  const users = useSelector(selectAllUsers);
  const content = users?.length ? <NewNoteForm users={users}/> : <p>Not Currently available</p>
  return content;
}

export default NewNote