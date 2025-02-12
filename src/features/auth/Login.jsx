import { useState, useEffect } from "react";
import { useLoginMutation } from "./authApiSlice";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";

const Login = () => {
  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      navigate("/dash");
    }
  }, [isSuccess, navigate]);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const canSubmit = [username, password].every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSubmit) {
      const { accessToken } = await login({ username, password });
      dispatch(setCredentials({ accessToken }));
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
              <p className={isError ? "font-bold text-red-400" : "hidden"}>
                {error?.data?.message}
              </p>
              <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
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

export default Login;
