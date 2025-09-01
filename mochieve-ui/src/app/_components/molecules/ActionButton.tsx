"use client";

import { createElement, useState } from "react";


type Props = {
  className?: string;
  isPush: boolean;
  count: number;
  onClick: (isPushed: boolean) => void;
  children: React.ReactNode;
};

export const ActionButton = (props: Props) => {
  const [actionNum, setActionNum] = useState(props.count);
  const [isPush, setIsPush] = useState(props.isPush);
  const className = props.className ? props.className : "";

  const handleClick = () => {
    setIsPush(!isPush);
    setActionNum(actionNum + (isPush ? -1 : 1));
    props.onClick(!isPush);
  };

  return createElement("div",{
    className: "action-button flex items-center" + (className ? ` ${className}` : "")
  },[
    <button className="action-button" onClick={handleClick}>{props.children}</button>,
    <span className="action-num ms-2 text-green-600">{actionNum}</span>
  ]);
};
