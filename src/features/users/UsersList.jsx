import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "./usersApiSlice";
import useTitle from "../../hooks/useTitle";

const UsersList = () => {
  useTitle("tecNotes: UsersList")
  
  const {
    // data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(undefined, { //this first parameter is the label to the query
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  });

  const usersData = useSelector(selectAllUsers);

  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    if (usersData) {
      setSearchResult(usersData);
    }
  }, [usersData]);

  let content;

  const handleSearchChange = (e) => {
    if (!e.target.value) return setSearchResult(usersData);
    const result = usersData.filter((user) =>
      user.username.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setSearchResult(result);
  };

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p className="errMsg">{error.data?.message}</p>;
  } else if (isSuccess) {
    if (usersData) {
      const tableContent = searchResult?.length ? (
        searchResult.map((user) => <User key={user._id} userId={user._id} />)
      ) : (
        <tr>
          <td colSpan={4} className="t-cell text-center">
            No results
          </td>
        </tr>
      );

      content = (
        <>
          <form
            className="mx-auto mt-6 w-full max-w-[900px]"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="w-68 rounded-sm border border-gray-300 p-1 pl-2 outline-none bg-transparent text-white placeholder:text-gray-300 placeholder:text-sm"
              type="text"
              id="search"
              placeholder="Filter by usernames..."
              onChange={handleSearchChange}
            />
          </form>
          <div className="mx-auto mt-2 max-w-[900px] max-h-[440px] overflow-y-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-600 sticky top-[1px] z-2">
                <tr>
                  <th className="t-cell font-semibold">Username</th>
                  <th className="t-cell font-semibold">Roles</th>
                  <th className="t-cell font-semibold">Active</th>
                  <th className="t-cell font-semibold">Edit</th>
                </tr>
              </thead>
              <tbody>{tableContent}</tbody>
            </table>
          </div>
        </>
      );
    } else {
      content = (
        <div className="mt-4 flex items-center justify-center">
          <p>No users found</p>
        </div>
      );
    }
  }

  return content;
};


export default UsersList;
