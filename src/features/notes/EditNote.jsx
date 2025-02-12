import { useSelector } from "react-redux"
import { selectAllUsers } from "../users/usersApiSlice"
import { selectNoteById } from "./notesApiSlice"
import EditNoteForm from "./EditNoteForm"
import { useParams } from "react-router-dom"


const EditNote = () => {
  const { id } = useParams()

  const users = useSelector(selectAllUsers)
  const note = useSelector(state => selectNoteById(state, id))

  const content = users?.length && note ? <EditNoteForm users={users} note={note}/> : <p>Not Currently available</p>

  return content;
}

export default EditNote