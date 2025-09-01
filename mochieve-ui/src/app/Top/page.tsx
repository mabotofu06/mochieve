import { Metadata } from "next";
import TemplateTop from "../_components/templates/Top";
import { APP_NAME } from "../_constants/app";

export const metadata: Metadata = {
  title: `トップ | ${APP_NAME}`,
  description: "",
};

export default async function Page() {
  return <TemplateTop />;
}
