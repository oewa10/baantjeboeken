import { redirect } from "next/navigation"

export default function ClubsPage() {
  // Redirect to search page since we don't want a standalone clubs page
  redirect('/search')
}
