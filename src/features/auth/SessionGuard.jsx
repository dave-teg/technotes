import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { selectSessionExpired } from "./authSlice";
import { useSendLogoutMutation } from "./authApiSlice";
import { toast } from "react-toastify";

const SessionGuard = () => {
  const sessionExpired = useSelector(selectSessionExpired)
  const navigate = useNavigate()
  const [sendLogout] = useSendLogoutMutation()
  const hasLoggedOut = useRef(false)

  useEffect(() => {
    const handleSessionExpiry = async () => {
      if(sessionExpired && !hasLoggedOut.current) {
        hasLoggedOut.current = true
        toast.info("Session expired. Please log in Again", {theme: "dark"})
        try {
          await sendLogout().unwrap()
        } catch(err) {
          if (import.meta.env.DEV) {
            console.log(err);
          }
        } finally {
          navigate("/login", {replace: true})
        }
      }
    }

    handleSessionExpiry()

  }, [sessionExpired, sendLogout, navigate])

  return <Outlet/>
}

export default SessionGuard