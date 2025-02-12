import { selectNoteById } from "./notesApiSlice"
import { useSelector } from "react-redux"
import {useNavigate} from "react-router-dom"
import { FaEdit } from "react-icons/fa";
import { memo } from "react";


const Note = ({noteId}) => {
  const note = useSelector(state => selectNoteById(state, noteId))
  const navigate = useNavigate()

  if(note) {
    const handleEdit = () => navigate(`/dash/notes/${noteId}`)
    const created = new Date(note.createdAt).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const updated = new Date(note.updatedAt).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return (
      <tr>
        <td className="t-cell">
          {note.completed ? <span className="text-green-500 font-semibold">Completed</span> : <span className=" font-semibold">Open</span>}
        </td>
        <td className="t-cell">{note.username}</td>
        <td className="t-cell">{note.title}</td>
        <td className="t-cell hidden lg:table-cell">{created}</td>
        <td className="t-cell hidden lg:table-cell">{updated}</td>
        <td className="t-cell text-center">
          <button onClick={handleEdit}>
          <FaEdit className="cursor-pointer hover:scale-115 transition"/>
          </button>
        </td>

      </tr>
    )
  } else return null
}

const memoizedNote = memo(Note)

export default memoizedNote