import { TemplatesMyWorks } from "@/app/_components/templates/MyWorks";

type Props = {
  params: Promise<{ user_id: string }>;
  searchParams: Promise<{
    type: "all" | "doing" | "completed" | undefined;
  }>
}

export default async function MyWorkGroup(props: Props) {
  const params = await props.params;
  const userId = decodeURIComponent(params.user_id);
  if(!userId)  throw new Error("User ID is required");

  return <TemplatesMyWorks userId={userId} />
}
