import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { ROLES } from "../../config/roles";
import DeleteModal from "../../components/pages/DeleteModal";
import useTitle from "../../hooks/useTitle";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,20}$/;

const EditUserForm = ({ user }) => {
  useTitle("techNotes: Edit User")

  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();
  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteUserMutation();

  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleActiveChange = (e) => setActive(e.target.checked);
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
      <div className="flex gap-2" key={role}>
        <input
          type="checkbox"
          id={role}
          value={role}
          checked={roles.includes(role)}
          onChange={handleRoleChange}
          className="cursor-pointer accent-blue-600"
        />
        <label htmlFor={role}>{role}</label>
      </div>
    );
  });
  let canSave;
  if (password) {
    canSave =
      [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
  } else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
  }

  const handleSaveUser = async () => {
    if (canSave) {
      if (password) {
        await updateUser({ id: user.id, username, password, active, roles });
      } else {
        await updateUser({ id: user.id, username, active, roles });
      }
    }
  };

  const handleDeleteUser = async () => {
    await deleteUser({ id: user.id });
    setIsModalOpen(false);
  };

  const errContent = (error?.data?.message || delError?.data?.message) ?? "";

  const content = (
    <div className="max-w-[800px]">
      <p className={isError || isDelError ? "errMsg" : "hidden"}>
        {errContent}
      </p>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-center justify-between">
          <h2>Edit User</h2>
          <div className="flex gap-2">
            <button
              className={`text-2xl transition ${canSave ? "cursor-pointer hover:scale-110" : "cursor-not-allowed opacity-50"}`}
              disabled={!canSave}
              onClick={handleSaveUser}
            >
              <FaSave />
            </button>
            <button
              className="cursor-pointer text-2xl transition hover:scale-110"
              onClick={() => setIsModalOpen(true)}
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
        <label htmlFor="username" className="text-sm">
          Username: [3-20 letters]
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
          className={`${validUsername ? "border-blue-600" : "border-red-600"}`}
        />
        <label htmlFor="password" className="text-sm">
          Password: [4-20 chars incl. !@#$%]
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          className={`${password && !validPassword ? "border-red-600" : "border-blue-600"}`}
        />
        <div className="flex gap-2">
          <label htmlFor="active">Active</label>
          <input
            type="checkbox"
            id="active"
            checked={active}
            onChange={handleActiveChange}
            className="cursor-pointer accent-blue-600"
          />
        </div>
        <label htmlFor="roles" className="uppercase">
          Assigned roles
        </label>
        <div className="ml-2">{options}</div>
      </form>
    </div>
  );

  return (
    <>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteUser}
        item={"user"}
      />
      {content}
    </>
  );
};

export default EditUserForm;
