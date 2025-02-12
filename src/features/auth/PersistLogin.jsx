import { useEffect, useRef, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { setCredentials } from "./authSlice";
import { useDispatch } from "react-redux";
import DashFooter from "../../components/layout/DashFooter";
import DashHeader from "../../components/layout/DashHeader";

const PersistLogin = () => {
  const [refresh, { isLoading, isError, error, isSuccess, isUninitialized }] =
    useRefreshMutation();

  const effectRan = useRef(false);
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);

  const dispatch = useDispatch();

  const [trueSuccess, setTrueSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    if (effectRan.current === true || import.meta.env.MODE !== "development") {
      const verifyRefreshToken = async () => {
        try {
          const { accessToken } = await refresh().unwrap();
          dispatch(setCredentials({ accessToken }));
          setTrueSuccess(true);
        } catch (err) {
          if (import.meta.env.DEV) {
            console.log(err);
          } 
          setErrMsg(err?.status)
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let content;

  if (!persist) {
    content = <Outlet />;
  } else if (isLoading) {
    content = (
      <div className="flex min-h-screen flex-col">
        <DashHeader />
        <div className="grow px-8 pt-3 pb-2">
          <p>Loading...</p>
        </div>
        <DashFooter />
      </div>
    );
  } else if (isError) {
    content = (
      <div className="flex min-h-screen flex-col">
        <DashHeader />
        <div className="grow px-8 pt-3 pb-2">
          <p className="errMsg">{`${error?.data?.message || errMsg} - `}
            <Link to="/login" className="underline">Please login again</Link>
          </p>
        </div>
        <DashFooter />
      </div>
    );
  } else if (isSuccess && trueSuccess) {
    content = <Outlet />;
  } else if (isUninitialized && token) {
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
