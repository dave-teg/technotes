import { useAddNewUserMutation } from "./usersApiSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import { ROLES } from "../../config/roles";
import useTitle from "../../hooks/useTitle"

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUser = () => {
  useTitle("techNotes: Create User")

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);
  const [addNewUser, { isLoading, isError, isSuccess, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    const test = USER_REGEX.test(username);
    setValidUsername(test);
  }, [username]);

  useEffect(() => {
    const test = PWD_REGEX.test(password);
    setValidPassword(test);
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles("");
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setRoles((prevRoles) => {
      if (prevRoles.includes(role)) {
        return prevRoles.filter((r) => r !== role);
      } else {
        return [...prevRoles, role];
      }
    });
  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <div key={role} className="ml-2 flex items-center">
        <input
          type="checkbox"
          id={role}
          value={role}
          checked={roles.includes(role)}
          onChange={handleRoleChange}
          className="cursor-pointer accent-blue-600"
        />
        <label className="ml-1" htmlFor={role}>
          {role}
        </label>
      </div>
    );
  });

  const canSave =
    [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, password, roles });
    }
  };

  const content = (
    <div className="max-w-[800px]">
      <form onSubmit={handleSaveUser}>
        <div className="flex items-center justify-between">
          <h2>Add New User</h2>
          <button
            className={`mr-12 text-2xl transition ${!canSave ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"}`}
            title="save"
            disabled={!canSave}
          >
            <FaSave />
          </button>
        </div>
        <p className={isError ? "errMsg" : "hidden"}>{error?.data?.message}</p>
        <label htmlFor="username" className="text-sm">
          Username: [3-20 letters]
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
          className={` ${validUsername ? "border-blue-700" : "border-red-700"}`}
        />
        <label htmlFor="password" className="text-sm">
          Password: [4-12 chars incl. !@#$%]
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          className={` ${validPassword ? "border-blue-700" : "border-red-700"}`}
        />
        <label htmlFor="roles" className="text-sm uppercase">
          Assigned Roles
        </label>
        <div>{options}</div>
      </form>
    </div>
  );

  return content;
};

export default NewUser;
