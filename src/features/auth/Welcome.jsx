import { Link } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const Welcome = () => {

  const today = Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date());

  const { username, isManager, isAdmin } = useAuth();

  useTitle(`techNotes: ${username}`)

  return (
    <section>
      <p>{today}</p>
      <h1 className="py-4 text-2xl font-semibold">Welcome {username} !</h1>

      <p className="flex items-center gap-2 pb-3">
        <FaLongArrowAltRight />
        <Link to="/dash/notes">View the notes</Link>
      </p>

      <p className="flex items-center gap-2 pb-3">
        <FaLongArrowAltRight />
        <Link to="/dash/notes/new">Add New Note</Link>
      </p>

      <p className="flex items-center gap-2 pb-3">
        {(isAdmin || isManager) && (
          <>
            <FaLongArrowAltRight />
            <Link to="/dash/users">View User Settings</Link>
          </>
        )}
      </p>

      <p className="flex items-center gap-2 pb-3">
        {(isAdmin || isManager) && (
          <>
            <FaLongArrowAltRight />
            <Link to="/dash/users/new">Add New User</Link>
          </>
        )}
      </p>
    </section>
  );
};

export default Welcome;
