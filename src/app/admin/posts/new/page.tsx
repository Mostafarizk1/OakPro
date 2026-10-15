import EditPost from "../[id]/page";
export const dynamic = "force-dynamic";
export default function NewPost() { return EditPost({ params: Promise.resolve({ id: "new" }) }); }
