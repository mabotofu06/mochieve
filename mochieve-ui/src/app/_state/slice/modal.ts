import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    openLoginModal: false,
    openPostFormModal: false,
    openGroupFormModal: false,
    openPostCompleteModal: false,
  },
  reducers: {
    openLoginModal: (state) => { state.openLoginModal = true; },
    closeLoginModal: (state) => { state.openLoginModal = false; },
    openPostFormModal: (state) => { state.openPostFormModal = true; },
    closePostFormModal: (state) => { state.openPostFormModal = false; },
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


