import { useNavigate, useLocation } from "react-router-dom"
import { FaHome } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const DashFooter = () => {
  const navigate = useNavigate();
  const {pathname} = useLocation()
  const {username, status} = useAuth()

  let goHomeButton = null

  const onGoHomeClicked = () => navigate("/dash")

  if(pathname !== "/dash") {
    goHomeButton = (
      <button title="home" onClick={onGoHomeClicked}>
        <FaHome className="text-xl cursor-pointer hover:scale-115"/>
      </button>
    )
  }


  return (
    <footer className="bg-primaryClr border-t border-white px-3 py-2 flex gap-4 sticky bottom-0 z-1">
      {goHomeButton}
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  )
}

export default DashFooter