import { sidebarItems } from "@/utils/data"
import Link from "next/link"

export const Sidebar =()=>{
    return(
        <aside className="w-75  bg-(--bg-primary) border-r border-(--border) h-screen overflow-y-auto ">
            <div className="p-6 mb-6 border-b border-(--border)">
                <div className="flex gap-3 items-center mb-1">
                     <div className="w-12 h-12 rounded-md bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary-dark)_100%)] flex items-center justify-center text-white text-xl font-semibold" >🦷</div>
                     <div className="text-lg font-semibold text-(--text-primary)">Mehreen Dental Clinic</div>

                </div>
                <div className="text-sm  text-(--text-light) ml-15">Caring For Your Smile </div>
            </div>
            <nav>
                <ul className="px-3">
                    {
                        sidebarItems.map((item)=>{
                            return(
                                <li key={item.value} className="flex items-center gap-3 px-6 py-3 text-(--text-primary) hover:bg-(--bg-secondary) cursor-pointer">
                                    <Link href={item.route}>
                                    <span>{item.icon}</span>
                                    <span>{item.value}</span>
                                    </Link>
                                </li>
                            ) 
                        })

                    }
                </ul>

            </nav>
        </aside>
    )
}