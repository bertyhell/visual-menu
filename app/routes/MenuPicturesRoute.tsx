import type { Route } from "./+types/MenuPicturesRoute";

import React from "react";
import {MenuPicturesPage} from "~/pages/MenuPicturesPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Take a picture of the menu" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}


export default () => {
  return <MenuPicturesPage/>;
};
