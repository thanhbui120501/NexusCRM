//import React from 'react';

function FeatureHighlight() {
  return (
    <section className="flex flex-col justify-center self-stretch p-4 my-auto min-h-[768px] min-w-[240px] w-[960px] h-[736px] max-md:max-w-full scale-75 sm:scale-100 lg:scale-110 m-4 sm:m-6 lg:mr-10 lg:mt-10 lg:mb-10">
      <div className="flex overflow-hidden relative flex-1 gap-2.5 items-start rounded-3xl border border-solid bg-neutral-50 border-neutral-200 size-full max-md:max-w-full">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a4900a4a6bc767cfcde99844efdd233d42b17fee89535b525c20745f8ccd3bfd?placeholderIfAbsent=true&apiKey=6129f3f077614e979263c9b69c421594"
          alt=""
          className="object-contain absolute -bottom-10 z-0 rounded-3xl aspect-[2.05] h-[540px] min-w-[240px] right-[-227px] w-[1106px] max-md:max-w-full"
        />
        <div className="flex z-0 flex-col flex-1 shrink pt-8 pr-6 pb-6 pl-20 basis-0 min-w-[240px] max-md:px-5 max-md:max-w-full">
          <div className="flex flex-col w-full max-md:max-w-full">
            <div className="flex gap-3 items-center self-start text-base font-medium text-orange-600">
              <div className="flex shrink-0 self-stretch my-auto w-3 h-3 bg-orange-600 rounded-full" aria-hidden="true" />
              <p>Tính năng nổi bật</p>
            </div>
            <h2 className="mt-3 text-2xl font-semibold leading-none text-neutral-900 max-md:max-w-full">
              Quản lý tài khoản thuận tiện
            </h2>
          </div>
          <p className="mt-4 text-base leading-6 text-neutral-900 max-md:max-w-full">
            Giúp bạn có cái nhìn tổng quan về toàn bộ thông tin khách hàng, từ lịch sử tương tác đến các cơ hội kinh doanh tiềm năng. Với giao diện trực quan và dễ sử dụng, bạn có thể quản lý thông tin khách hàng một cách hiệu quả, từ đó đưa ra những quyết định kinh doanh sáng suốt.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeatureHighlight;