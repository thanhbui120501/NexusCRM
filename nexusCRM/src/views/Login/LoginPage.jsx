import LoginForm from "./LoginForm";
import FeatureHighlight from "./FeatureHighlight";
import { useState } from "react";

function LoginPage() {
    const [loading, setLoading] = useState(false);
    const onLoading = (val) => {
        setLoading(val);
    };
    return (
        <div className="flex flex-row justify-between items-start bg-white overflow-hidden h-full">
            <div className="flex flex-col self-stretch px-4 my-auto  scale-75 sm:scale-100 lg:scale-110 m-4 sm:m-6 lg:m-10">
                <div className="flex gap-2 items-center py-4 w-full text-xl font-semibold font-sans whitespace-nowrap text-neutral-900">
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/93173637173314e133d11df1576e4c797610fa28468e8820ecfbf2dd083cebd2?placeholderIfAbsent=true&apiKey=6129f3f077614e979263c9b69c421594"
                        alt=""
                        className="object-contain shrink-0 self-stretch my-auto w-8 aspect-square"
                    />
                    <h1 className="self-stretch my-auto">Nexus</h1>
                </div>
                <LoginForm onLoading={onLoading}/>
            </div>
            <FeatureHighlight />
            {loading && (
                <div className="fixed flex flex-col inset-0 bg-black bg-opacity-50 z-[10] items-center justify-center pb-40 rounded-xl">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-600 border-solid"></div>
                    <h1 className="text-lg font-medium text-white">
                        Đang đăng nhập
                    </h1>
                </div>
            )}
        </div>
    );
}

export default LoginPage;
