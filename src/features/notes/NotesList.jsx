import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAllNotes } from "./notesApiSlice";
import { FaCalendarAlt } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const NotesList = () => {
  useTitle("techNotes: NotesList")

  const {
    // data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery(undefined, {
    //this first parameter is the label to the query
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { username, isAdmin, isManager } = useAuth();

  const notesData = useSelector(selectAllNotes);

  const filteredNotesData = useMemo(() => {
    if(isAdmin || isManager) {
      return [...(notesData || [])]
    } else {
      return notesData?.filter(note => note.username === username) || []
    }
  }, [isAdmin, isManager, username, notesData])

  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    setSearchResult(filteredNotesData);
  }, [filteredNotesData]);

  const handleSearchChange = (e) => {
    if (!e.target.value) return setSearchResult(filteredNotesData);
    const result = filteredNotesData?.filter((note) =>
      note.title.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setSearchResult(result);
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (!selectedDate) return setSearchResult(filteredNotesData);
    const result = filteredNotesData.filter((note) => {
      const noteDateCreated = new Date(note.createdAt)
        .toISOString()
        .split("T")[0];
      const noteDateUpdated = new Date(note.updatedAt)
        .toISOString()
        .split("T")[0];

      return (
        noteDateCreated === selectedDate || noteDateUpdated === selectedDate
      );
    });

    setSearchResult(result);
  };

  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    // sanitize error msg
    content = <p className="errMsg">{error.data?.message}</p>;
  } else if (isSuccess) {
    /* if (filteredNotesData) { */
      const tableContent = searchResult?.length ? (
        searchResult.map((note) => <Note key={note._id} noteId={note._id} />)
      ) : (
        <tr>
          <td colSpan={6} className="t-cell text-center">
            No result
          </td>
        </tr>
      );

      content = (
        <>
          <form
            className="mx-auto mt-6 flex w-full max-w-[1200px]"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              id="search"
              placeholder="Filter by note title..."
              className="w-68 rounded-sm border border-gray-300 bg-transparent p-1 pl-2 text-white outline-none placeholder:text-sm placeholder:text-gray-300"
              onChange={handleSearchChange}
            />
            <div className="flex items-center">
              <label htmlFor="date" className="ml-4 text-sm text-gray-300">
                Filter by date:
              </label>
              <div className="relative inline">
                <input
                  type="date"
                  id="date"
                  className="ml-2 rounded-sm border border-gray-300 p-1 pl-2 text-sm text-gray-300 outline-none"
                  onChange={handleDateChange}
                />
                <FaCalendarAlt className="pointer-events-none absolute top-2 right-1.5 inline size-3" />
              </div>
            </div>
          </form>
          <div className="mx-auto mt-3 max-h-[400px] w-full max-w-[1200px] overflow-y-auto">
            <table className="w-full table-auto">
              <thead className="sticky top-0 z-2 bg-gray-600">
                <tr>
                  <th className="t-cell font-semibold">Status</th>
                  <th className="t-cell font-semibold">Owner</th>
                  <th className="t-cell font-semibold">Title</th>
                  <th className="t-cell hidden font-semibold lg:table-cell">
                    Created At
                  </th>
                  <th className="t-cell hidden font-semibold lg:table-cell">
                    Updated At
                  </th>
                  <th className="t-cell font-semibold">Edit</th>
                </tr>
              </thead>
              <tbody>{tableContent}</tbody>
            </table>
          </div>
        </>
      );
    /* } else {
      content = (
        <div className="mt-4 flex items-center justify-center">
          <p>No notes found</p>
        </div>
      );
    } */
  }

  return content;
};

export default NotesList;
