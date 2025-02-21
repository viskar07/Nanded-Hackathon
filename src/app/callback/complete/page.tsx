import { onSignUpUser } from "@/actions/auth"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const CompleteOAuthAfterCallback = async () => {
  const user = await currentUser()
  
  if (!user) {

    redirect("/sign-in")
  }
  
  const complete = await onSignUpUser({
    firstname: user.firstName as string,
    lastname: user.lastName as string,
    clerkId: user.id,
    email:user.emailAddresses[0].emailAddress
  })

  if (complete.status == 200) {
    redirect(`/group/create`)
  }

  if (complete.status !== 200) {
    redirect("/sign-in")
  }
}

export default CompleteOAuthAfterCallback
