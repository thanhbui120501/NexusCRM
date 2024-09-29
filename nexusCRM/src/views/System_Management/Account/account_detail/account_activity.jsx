export default function AccountActivity(){
    return(
        <div className="flex flex-col p-6 items-start gap-6 self-stretch border rounded-xl border-gray-200">
            <h1 className="font-semibold text-xl text-[#171717]">Hoạt động</h1>
            <div className="flex flex-col items-start gap-3 self-stretch h-48 overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col items-start self-stretch">
                    <div className="flex items-center gap-3">
                        <img src="/images/avatar.png" alt="avatar" className="w-8 h-8 rounded-full object-cover"/>
                        <h1 className="font-medium text-base text-[#171717]">Thanh Bùi</h1>
                        <h1 className="font-medium text-base text-[#A3A3A3]">1 phút trước</h1>
                    </div>
                    <div className="flex items-center gap-3 self-stretch">
                        <div className="flex w-8 h-8 justify-center items-start gap-2.5">
                            <div  className="h-full w-0.5 bg-gray-400"/>
                        </div>
                        <h1 className="font-normal text-base text-[#171717]">Đã thay đổi mật khẩu</h1>
                    </div>
                </div>
                <div className="flex flex-col items-start self-stretch">
                    <div className="flex items-center gap-3">
                        <img src="/images/avatar.png" alt="avatar" className="w-8 h-8 rounded-full object-cover"/>
                        <h1 className="font-medium text-base text-[#171717]">Thanh Bùi</h1>
                        <h1 className="font-medium text-base text-[#A3A3A3]">1 phút trước</h1>
                    </div>
                    <div className="flex items-center gap-3 self-stretch">
                        <div className="flex w-8 h-8 justify-center items-start gap-2.5">
                            <div  className="h-full w-0.5 bg-gray-400"/>
                        </div>
                        <h1 className="font-normal text-base text-[#171717]">Đã thay đổi mật khẩu</h1>
                    </div>
                </div>
                <div className="flex flex-col items-start self-stretch">
                    <div className="flex items-center gap-3">
                        <img src="/images/avatar.png" alt="avatar" className="w-8 h-8 rounded-full object-cover"/>
                        <h1 className="font-medium text-base text-[#171717]">Thanh Bùi</h1>
                        <h1 className="font-medium text-base text-[#A3A3A3]">1 phút trước</h1>
                    </div>
                    <div className="flex items-center gap-3 self-stretch">
                        <div className="flex w-8 h-8 justify-center items-start gap-2.5">
                            <div  className="h-full w-0.5 bg-gray-400"/>
                        </div>
                        <h1 className="font-normal text-base text-[#171717]">Đã thay đổi mật khẩu</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}