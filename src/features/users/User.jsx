import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { memo } from "react";

const User = ({ userId }) => {
  const user = useSelector((state) => selectUserById(state, userId));
  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`);
    const userRoleString = user.roles.toString().replaceAll(",", ", ");
    
    return (
      <tr className={user.active ? "text-white" : "text-gray-400"}>
        <td className="t-cell">{user.username}</td>
        <td className="t-cell">{userRoleString}</td>
        <td className="t-cell">
         {user.active ? <span>Active</span> : <span>Inactive</span>}
        </td>
        <td className="t-cell text-center">
          <button onClick={handleEdit}>
            <FaEdit className="cursor-pointer hover:scale-115 transition"/>
          </button>
        </td>
      </tr>
    );
  } else return null;
};

const memoizedUser = memo(User)

export default memoizedUser;
