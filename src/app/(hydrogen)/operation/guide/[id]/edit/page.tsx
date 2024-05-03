'use client';

import { routes } from '@/config/routes';

import GuideForm from '@/app/shared-vienna/guide/guide-form';

import PageHeader from '@/app/shared/page-header';
import ProfileSettingsNav from '@/app/shared/account-settings/navigation';
import { metaObject } from '@/config/site.config';


import { useEffect, useState } from 'react';


import { data } from '@/data/doingdoit/guide/data';

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
      href: routes.operation.healthinfo,
      name: '운영관리',
    },
    {
      href: routes.operation.healthinfo,
      name: '유형별가이드',
    },
    {
      name: '수정하기',
    },
  ],
};

export default function Page({
  params,
}: {
  params: any;
}) {

  const id =  params?.id;


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

      <div className="@container">
        <GuideForm id={id} />
      </div>

      
    </>
  );


}
