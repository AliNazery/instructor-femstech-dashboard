import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetInstructorResponse } from "../api/instructor/instructor.type";


interface InstructorState {
  instructor: GetInstructorResponse["data"] | null;
}

const initialState: InstructorState = {
  instructor: null,
};

const instructorSlice = createSlice({
  name: "instructor",
  initialState,
  reducers: {
    addInstructor: (
      state,
      action: PayloadAction<GetInstructorResponse["data"]>
    ) => {
      state.instructor = action.payload;
    },
    resetInstructor: () => initialState,
  },
});

export default instructorSlice.reducer;
export const { addInstructor, resetInstructor } = instructorSlice.actions;
