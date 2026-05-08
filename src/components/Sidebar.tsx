import { sidebarItems } from "@/utils/data"

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
                <ul>
                    {
                        
                    }
                </ul>

            </nav>
        </aside>
    )
}