import { useAddNewUserMutation } from "./usersApiSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import { ROLES } from "../../config/roles";


const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {
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

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleRoleChange = (e) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setRoles(selectedValues);
  };

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
      <p className={isError ? "errMsg" : "hidden"}>
        {error?.data?.message}
      </p>
      <form onSubmit={handleSaveUser}>
        <div className="flex justify-between">
          <h2>Create New User</h2>
          <button
            className={`mr-12 text-2xl transition ${!canSave ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"}`}
            title="save"
            disabled={!canSave}
          >
            <FaSave />
          </button>
        </div>

        <label htmlFor="username" className="text-sm">
          Username: [3-20 letters]
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
          className="w-1/2 rounded-xl border-2 border-blue-700 bg-white p-1 pl-2 text-black focus:border-none"
        />
        <label htmlFor="password" className="text-sm">
          Password: [4-12 chars incl. !@#$%]
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          className="w-1/2 rounded-xl border-2 border-blue-700 bg-white p-1 pl-2 text-black focus:border-none"
        />
        <label htmlFor="roles" className="text-sm uppercase">
          Assigned Roles
        </label>
        <select
          multiple
          id="roles"
          className="rounded-sm border border-black p-0.5"
          size={3}
          value={roles}
          onChange={handleRoleChange}
        >
          {options}
        </select>
      </form>
    </div>
  );

  return content;
};

export default NewUserForm;
