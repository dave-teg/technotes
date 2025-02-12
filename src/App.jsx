import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";
import Public from "./components/Public";
import DashLayout from "./components/layout/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import EditNote from "./features/notes/EditNote";
import NewUser from "./features/users/NewUser";
import Prefetch from "./features/auth/Prefetch";
import NewNote from "./features/notes/NewNote";
import LoginNew from "./features/auth/LoginNew";
import SessionGuard from "./features/auth/SessionGuard";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";

function App() {
  useTitle("Dan D. Repairs")
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Public />} />
          <Route path="login" element={<LoginNew />} />

          {/* protected routes */}
          <Route element={<SessionGuard />}>
            <Route element={<PersistLogin />}>
              <Route
                element={
                  <RequireAuth allowedRoles={[...Object.values(ROLES)]} />
                }
              >
                <Route element={<Prefetch />}>
                  <Route path="dash" element={<DashLayout />}>
                    <Route index element={<Welcome />} />

                    <Route path="notes">
                      <Route index element={<NotesList />} />
                      <Route path=":id" element={<EditNote />} />
                      <Route path="new" element={<NewNote />} />
                    </Route>

                    <Route
                      element={
                        <RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]} />
                      }
                    >
                      <Route path="users">
                        <Route index element={<UsersList />} />
                        <Route path=":id" element={<EditUser />} />
                        <Route path="new" element={<NewUser />} />
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
