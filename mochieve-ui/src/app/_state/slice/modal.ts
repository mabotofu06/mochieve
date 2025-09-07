import { createSlice } from "@reduxjs/toolkit";

//TODO: ここに集約しすぎているのでのちのち分割する
export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    openLoginModal       : false as boolean,

    openPostFormModal    : false as boolean,
    postTargetGroupId    : null  as string | null,

    openGroupFormModal   : false as boolean,
    groupFormInit        : undefined  as {title: string, note:string} | undefined,

    openPostCompleteModal: false as boolean,

    openImageModal       : false as boolean,
    imageModalSrc        : "" as string,

    errorModalInfo       : undefined as { title: string, message: string } | undefined,

    loading              : true as boolean,
    loadingModal         : false as boolean,
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

    openGroupFormModal: (state, action: {payload: {title: string, note: string}}) => { 
      state.openGroupFormModal = true; 
      state.groupFormInit = action.payload;
    },
    closeGroupFormModal: (state) => {
      state.openGroupFormModal = false;
      state.groupFormInit = undefined;
    },

    openPostCompleteModal: (state) => { state.openPostCompleteModal = true; },
    closePostCompleteModal: (state) => { state.openPostCompleteModal = false; },

    openImageModal: (state, action: {payload: string}) => { 
      state.openImageModal = true; 
      state.imageModalSrc = action.payload;
    },
    closeImageModal: (state) => { 
      state.openImageModal = false; 
      state.imageModalSrc = "";
    },

    openErrorModal: (state, action: {payload: { title: string, message: string }}) => { 
      state.errorModalInfo = action.payload;
    },
    closeErrorModal: (state) => { 
      state.errorModalInfo = undefined;
    },

    setLoading: (state, action: {payload: boolean}) => {
      state.loading = action.payload;
    },

    setLoadingModal: (state, action: {payload: boolean}) => {
      state.loadingModal = action.payload;
    }
  },
});

export const {
  openLoginModal, closeLoginModal,
  openPostFormModal, closePostFormModal,
  openGroupFormModal, closeGroupFormModal,
  openPostCompleteModal, closePostCompleteModal,
  openImageModal, closeImageModal,
  openErrorModal, closeErrorModal,
  setLoading, setLoadingModal
} = modalSlice.actions;
export const modalReducer = modalSlice.reducer;


