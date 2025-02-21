import { Button } from "@/components/ui/button"
import { CheckBadge } from "@/icons"
import { SignedIn, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Notification } from "./notification"

const Navbar = () => {
  return (
    <div className='flex items-center justify-between p-4'>
      {/* SEARCH BAR */}
      <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <Image src="/search.png" alt="" width={14} height={14}/>
        <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none"/>
      </div>
      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
      <Link href={`/institutions/create`} className="hidden md:inline">
        <Button
          variant="outline"
          className="bg-themeBlack rounded-2xl flex gap-2 border-themeGray hover:bg-themeGray"
        >
          <CheckBadge />
          Create Institute
        </Button>
      </Link>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
        <Notification />
        </div>
        


        <div className='flex flex-col'>
            <SignedIn>
        <UserButton />
      </SignedIn>
        </div>
      </div>
    </div>
  )
}

export default Navbar