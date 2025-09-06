import { createSlice } from "@reduxjs/toolkit";

//TODO: ここに集約しすぎているのでのちのち分割する
export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    openLoginModal       : false as boolean,
    openPostFormModal    : false as boolean,
    postTargetGroupId    : null  as string | null,
    openGroupFormModal   : false as boolean,
    openPostCompleteModal: false as boolean,
  },
  reducers: {
    openLoginModal: (state) => { state.openLoginModal = true; },
    closeLoginModal: (state) => { state.openLoginModal = false; },

    openPostFormModal: (state, action:{ payload: { groupId: string | null } }) => { 
      state.openPostFormModal = true;
      state.postTargetGroupId = action.payload.groupId;
    },
    closePostFormModal: (state) => {
      state.openPostFormModal = false;
      state.postTargetGroupId = null;
    },

    openGroupFormModal: (state) => { state.openGroupFormModal = true; },
    closeGroupFormModal: (state) => { state.openGroupFormModal = false; },

    openPostCompleteModal: (state) => { state.openPostCompleteModal = true; },
    closePostCompleteModal: (state) => { state.openPostCompleteModal = false; },
  },
});

export const {
  openLoginModal, closeLoginModal,
  openPostFormModal, closePostFormModal,
  openGroupFormModal, closeGroupFormModal,
  openPostCompleteModal, closePostCompleteModal,
} = modalSlice.actions;
export const modalReducer = modalSlice.reducer;


