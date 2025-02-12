import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => "/notes",
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        if (Array.isArray(responseData)) {
          const loadedNotes = responseData.map((note) => ({
            ...note,
            id: note._id,
          }));
          return notesAdapter.setAll(initialState, loadedNotes);
        }
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else {
          return [{ type: "Note", id: "LIST" }];
        }
      },
    }),
    addNewNote: builder.mutation({
      query: noteData => ({
        url: "/notes",
        method: "POST",
        body: { ...noteData}
      }),
      invalidatesTags: [
        {type: "Note", id: "LIST"}
      ]
    }),
    updateNote: builder.mutation({
      query: noteData => ({
        url: "/notes",
        method: "PATCH",
        body: { ...noteData}
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Note", id: arg.id}
      ]
    }),
    deleteNote: builder.mutation({
      query: ({id}) => ({
        url: "/notes",
        method: "DELETE",
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Note", id: arg.id},
        { type: "User", id: "LIST"}
      ]
    })
  }),
});

export const { 
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation
} = notesApiSlice;

const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data,
);

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState,
);
