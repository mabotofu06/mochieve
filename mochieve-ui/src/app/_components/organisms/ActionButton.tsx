"use client";

import { useState } from "react";
import { ActionButton } from "../molecules/ActionButton";
import { AtomsIconHeart } from "../atoms/icon/Heart";
import { AtomsIconBookmark } from "../atoms/icon/Bookmark";


type Props = {
  isLike: boolean;
  isBookmark: boolean;
  likeNum: number;
  bookmarkNum: number;
};

export const OrganismsReactionButton = (props: Props) => {
  const [actionNum, setActionNum] = useState(props.likeNum);
  const [isLikePush, setIsLikePush] = useState(props.isLike);
  const [isBookmarkPush, setIsBookmarkPush] = useState(props.isBookmark);

  const handleLikeClick = () => {
    setIsLikePush(!isLikePush);
    setActionNum(actionNum + (isLikePush ? -1 : 1));
  };
  const handleBookmarkClick = () => {
    setIsBookmarkPush(!isBookmarkPush);
    setActionNum(actionNum + (isBookmarkPush ? -1 : 1));
  };

  return (
    <div className="reaction-button flex items-center">
      <ActionButton
        isPush={isLikePush}
        count={actionNum}
        onClick={handleLikeClick}
      >
        <AtomsIconHeart className="text-green-700" size={25} isFill={isLikePush} />
      </ActionButton>

      <ActionButton
        className="ms-5"
        isPush={isBookmarkPush}
        count={actionNum}
        onClick={handleBookmarkClick}
      >
        <AtomsIconBookmark className="text-green-700" size={25} isFill={isBookmarkPush} />
      </ActionButton>
    </div>
  );
};
