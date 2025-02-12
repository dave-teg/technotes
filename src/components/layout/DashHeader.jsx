import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from "../../features/auth/authApiSlice";
import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { FaFileCirclePlus } from "react-icons/fa6";
import { FaFilePen } from "react-icons/fa6";
import { FaUserGear } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  const [sendLogout, { isLoading }] = useSendLogoutMutation();

  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { isAdmin, isManager } = useAuth();

  const handleLogout = async () => {
    try {
      await sendLogout().unwrap();
      navigate("/", {replace: true});
    } catch (err) {
      setErrMsg(err?.data?.message);
    }
  };

  const onNewNoteClicked = () => navigate("/dash/notes/new");
  const onNewUserClicked = () => navigate("/dash/users/new");
  const onNotesClicked = () => navigate("/dash/notes");
  const onUsersClicked = () => navigate("/dash/users");

  let newNoteBtn = null;
  if (NOTES_REGEX.test(pathname)) {
    newNoteBtn = (
      <button title="New Note" className="icon-btn" onClick={onNewNoteClicked}>
        <FaFileCirclePlus />
      </button>
    );
  }

  let newUserBtn = null;
  if (USERS_REGEX.test(pathname)) {
    newUserBtn = (
      <button title="New User" className="icon-btn" onClick={onNewUserClicked}>
        <FaUserPlus />
      </button>
    );
  }

  let userBtn = null;
  if (isManager || isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      userBtn = (
        <button title="Users" className="icon-btn" onClick={onUsersClicked}>
          <FaUserGear />
        </button>
      );
    }
  }

  let notesBtn = null;
  if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
    notesBtn = (
      <button title="Notes" className="icon-btn" onClick={onNotesClicked}>
        <FaFilePen />
      </button>
    );
  }

  const logoutBtn = (
    <button title="logout" className="icon-btn" onClick={handleLogout}>
      <MdLogout />
    </button>
  );

  let buttonContent;
  if (isLoading) {
    buttonContent = <p>Logging out...</p>;
  } else {
    buttonContent = (
      <>
        {newNoteBtn}
        {newUserBtn}
        {notesBtn}
        {userBtn}
        {logoutBtn}
      </>
    );
  }

  return (
    <>
      <p className={errMsg ? "errMsg" : "hidden"}>{errMsg}</p>
      <header className="bg-primaryClr sticky top-0 z-1 border-b border-white px-3 py-2">
        <div className="flex items-center justify-between">
          <Link to="/dash">
            <h1 className="text-3xl font-bold">techNotes</h1>
          </Link>
          <nav className="flex gap-3 lg:mr-12">{buttonContent}</nav>
        </div>
      </header>
    </>
  );
};

export default DashHeader;
