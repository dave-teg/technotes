import { useState, useEffect, useRef } from "react";
import { useLoginMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import usePersist from "../../hooks/usePersist";
import useTitle from "../../hooks/useTitle";

const LoginNew = () => {
  useTitle("Employee Login")

  const [login, { isLoading }] = useLoginMutation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [persist, setPersist] = usePersist();

  const userRef = useRef();
  const errRef = useRef();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handlePersistToggle = (e) => setPersist(e.target.checked)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash", {replace: true});
    } catch (err) {
      setErrMsg(err?.data?.message);
      errMsg?.current?.focus();
    }
  };

  const content = (
    <section className="flex min-h-screen flex-col gap-4 p-4">
      <header>
        <h1 className="border-b-3 border-white pb-2 text-2xl font-bold">
          Employee Login
        </h1>
      </header>
      <main className="grow">
        <div className="max-w-[800px]">
          {isLoading && <p>Loading...</p>}
          {!isLoading && (
            <>
              <p
                ref={errRef}
                className={errMsg ? "errMsg" : "hidden"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  ref={userRef}
                  value={username}
                  onChange={handleUsernameChange}
                  required
                  className={`w-full sm:w-1/2 ${!username ? "border-red-400" : "border-blue-400"}`}
                />
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className={`w-full sm:w-1/2 ${!password ? "border-red-400" : "border-blue-400"}`}
                />

                <Button
                  variant="secondary"
                  className="mt-4 w-full cursor-pointer rounded-2xl sm:w-1/2"
                >
                  Sign in
                </Button>

                <div className="mt-4 flex items-center gap-2">
                  <input type="checkbox" id="persist" checked={persist} className="size-4 cursor-pointer accent-blue-500" onChange={handlePersistToggle} />
                  <label htmlFor="persist">Trust This Device</label>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
      <footer className="border-t-3 border-white pt-2">
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );

  return content;
};

export default LoginNew;
