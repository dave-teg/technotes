// import { useParams } from "react-router-dom";
/* import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice"; */
/* import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "./usersApiSlice";

const EditUser = () => {
  const { id } = useParams();
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();

  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error?.data?.message}</p>;
  } else if (isSuccess) {
    const userId = users.ids.filter((userId) => userId === id)[0];
    const user = users.entities[userId]

    content = <EditUserForm user={user}/>
  }

  return content;
}; */

import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";
import { useParams } from "react-router-dom";
import EditUserForm from "./EditUserForm";

const EditUser = () => {
  const { id } = useParams();
  const user = useSelector((state) => selectUserById(state, id));

  const content = user ? <EditUserForm user={user} /> : <p>Not Currently available</p>;

  return content;
};

export default EditUser;
