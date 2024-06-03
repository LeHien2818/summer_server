/*
 *
 * HomePage
 *
 */

import React from 'react';
import pluginId from '../../pluginId';
import { useEffect, useState } from 'react';
import { BaseHeaderLayout, HeaderLayout, Layout, Button } from '@strapi/design-system';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { request } from '@strapi/helper-plugin';
import { any, string } from 'prop-types';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
const HomePage = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await request("/content-manager/collection-types/api::student.student?pageSize=100", {
        method: "GET"
      }); 
      console.log(response);
      setData(processData(response.results))
    };

    fetchData();
  }, []);

  console.log(data);
  

  return (
    <Layout>
      <BaseHeaderLayout
       title="Chart Plugin" 
       subtitle="Statistic Annalysis for summer school"
       as="h2" >
      </BaseHeaderLayout>
      <HeaderLayout
        title="Figure of statistical number"
        as="h3" />
       {/* <p>{mock_data}</p> */}

    </Layout>
  );
};

export default HomePage;

interface IStudent {
    Address: string,
    Birthday: any,
    IdentityCode: string,
    MSV: string,
    Purpose: string,
    classification: string,
    email: string,
    gender: string,
    name: string,
    phone: string
}

const processData = (students:Array<IStudent>)=>{
  const result:any = {
    address: [''],
    birthday: [''],
    IdentityCode: [''],
    msv: [''],
    purpose: [''],
    classification: [''],
    email: [''],
    gender: [''],
    name: [''],
    phone: ['']
  }

  students.map((student:IStudent)=>{
    result.address.push(student.Address)
    result.birthday.push(student.Birthday)
    result.IdentityCode.push(student.IdentityCode)
    result.msv.push(student.MSV)
    result.purpose.push(student.Purpose)
    result.classification.push(student.classification)
    result.email.push(student.email)
    result.gender.push(student.gender)
    result.name.push(student.name)
    result.phone.push(student.phone)
  })
  result.address.shift()
  result.birthday.shift()
  result.IdentityCode.shift()
  result.msv.shift()
  result.purpose.shift()
  result.classification.shift()
  result.email.shift()
  result.gender.shift()
  result.name.shift()
  result.phone.shift()

  return result
}