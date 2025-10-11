"use client"

import { createElement, useState } from "react";
import { createLogger } from "@/app/_constants/utils/logger";

type Props = {
  tabMenu: { label: string; code: number; }[];
  activeTab: number;
  onChange: (index: number) => void;
}

export const OrganismsTabMenu = (props: Props) => {
  const logger = createLogger('OrganismsTabMenu');
  if(props.tabMenu.length === 0){
    logger.warn("tabMenu is empty");
    return (null);
  }
  const [code, setCode] = useState<number>(props.activeTab);

  return (
      <div className="nav-tab flex justify-center mt-3 border-b-2 border-green-500 overflow-x-auto">
        {props.tabMenu.map((item, index) => {
          return createElement(
            'button',
            {
              className: `nav-tab-item-button min-w-56 py-2 rounded-t-xl ${item.code === code ? 'bg-green-500 text-white' : ''}`,
              key: index,
              onClick: () => { setCode(item.code); props.onChange(item.code); }
            },
            item.label
          )
        })}
      </div>
  )
}
