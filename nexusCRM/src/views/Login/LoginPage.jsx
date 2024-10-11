import LoginForm from './LoginForm';
import FeatureHighlight from './FeatureHighlight';

function LoginPage() {
  return (
    <div className="flex flex-row justify-between items-start bg-white overflow-hidden h-full">
      <div className="flex flex-col self-stretch px-4 my-auto  scale-75 sm:scale-100 lg:scale-110 m-4 sm:m-6 lg:m-10">
        <div className="flex gap-2 items-center py-4 w-full text-xl font-semibold font-sans whitespace-nowrap text-neutral-900">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/93173637173314e133d11df1576e4c797610fa28468e8820ecfbf2dd083cebd2?placeholderIfAbsent=true&apiKey=6129f3f077614e979263c9b69c421594" alt="" className="object-contain shrink-0 self-stretch my-auto w-8 aspect-square" />
          <h1 className="self-stretch my-auto">Nexus</h1>
        </div>
        <LoginForm />
      </div>
      <FeatureHighlight />
    </div>
  );
}

export default LoginPage;
  
