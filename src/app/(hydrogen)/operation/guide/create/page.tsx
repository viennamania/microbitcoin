'use client';


import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';

import ImportButton from '@/app/shared/import-button';
import { metaObject } from '@/config/site.config';
import CreateGuide from '@/app/shared-vienna/guide/guide-create';


import { PiArrowUp, PiDownloadSimpleBold, PiList, PiRecordLight, } from 'react-icons/pi';

/*
export const metadata = {
  ...metaObject('유형별가이드'),
};
*/


const pageHeader = {
  title: '유형별가이드',
  breadcrumb: [
    {
      href: "/",
      name: 'Home',
    },
    {
      href: routes.operation.guide,
      name: '운영관리',
    },
    {
      href: routes.operation.guide,
      name: '유형별가이드',
    },
    {
      name: '등록하기',
    },
  ],
};

export default function CreatePage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>


        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          onClick={
            () =>
            window.history.back()
          }
        >
          <PiList className="me-2 h-4 w-4" />
          {'목록'}
        </button>

      </PageHeader>
      
      <CreateGuide />

      {/*
      <CreateOrder />
      */}
    </>
  );
}
