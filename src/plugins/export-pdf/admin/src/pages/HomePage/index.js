// @ts-nocheck
/*
 *
 * HomePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { HeaderLayout, Layout, Button, Box, SubNav, SubNavSections, SubNavSection, Flex } from '@strapi/design-system';
import { request } from '@strapi/helper-plugin';
import * as XLSX from 'xlsx'
const HomePage = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const response = await request("/content-manager/collection-types/api::course.course?pageSize=100&populate=*", {
        method: "GET"
      }); 
      console.log(response.results);
      setData(response.results)
    };

    fetchData();
  }, []);
  return (
    <Box background="neutral100">
      <Layout>
      <HeaderLayout
        title="ExportPDF Plugin" 
        subtitle="Export current list of student in available course"
        as="h3" />
       <Flex direction="column" gap={4}>
        {
           data.map((course, id)=>{
            let students = course.students
            let size = students.length
            
            return(
              <Button  variant="default" width="186" height="151" size="L"onClick={() => {
                if(size !== 0) {
                  const workbook = XLSX.utils.book_new()
                  let dataToWb = []
                  for(let i = 0; i < size; i++){
                    let item = {
                      Fullname: students[i].name,
                      Birthday: students[i].Birthday,
                      IdentityCode: students[i].IdentityCode,
                      MSV: students[i].MSV,
                      expertise: students[i].expertise,
                      gender: students[i].gender,
                      Address: students[i].Address,
                      Opcupation: students[i].classification,
                      email: students[i].email,
                      phone: students[i].phone

                    }
                    dataToWb.push(item)
                  }
                  const worksheet = XLSX.utils.json_to_sheet(dataToWb)
                  XLSX.utils.book_append_sheet(workbook, worksheet, `Danh sách sinh viên`)
                  XLSX.writeFile(workbook, `Danh sách sinh viên.xlsx`, {compression: true})
                }else {
                  alert("Hiện tại khóa học chưa có thành viên nào")
                }

              }}>
                  {`Export the list of student of ${course.name} course`}
              </Button>
            )
        })
        }
       </Flex>
        
      </Layout>
    </Box>
  );
};

export default HomePage;
