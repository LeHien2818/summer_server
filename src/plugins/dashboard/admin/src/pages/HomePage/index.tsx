/*
 *
 * HomePage
 *
 */

import { useEffect, useState } from 'react';
import { HeaderLayout, Layout, Button, Box, SubNav, SubNavSections, SubNavSection } from '@strapi/design-system';
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
  const [charts, setCharts] = useState(Array);
  const [age, setAge] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await request("/content-manager/collection-types/api::student.student?pageSize=100", {
        method: "GET"
      }); 
      console.log(response);
      setData(processData(response.results))
      setAge(processData(response.results).birthday.map((dob:any)=>getAge(dob)))
    };

    fetchData();
  }, []);

  console.log(data);
  

  return (
    <Box background="neutral100">
      <Layout>
        <HeaderLayout
        title="Chart Plugin" 
        subtitle="Statistic Annalysis for summer school"
        as="h3" />
        <HeaderLayout
          title="Figure of statistical number"
          as="h3" />
        {/* <p>{mock_data}</p> */}

      </Layout>
      <Layout sideNav={
        <SubNav ariaLabel="Builder sub nav">
        <SubNavSections>
                <SubNavSection label="Diagram type" collapsable badgeLabel={'4'} gap={3}>
                    <Button variant="default" width="186" height="151" size="L" onClick={() => {setCharts([drawBarChartOfExpertiseLevel(data)])}}>
                      Number of people according to expertise level
                    </Button>
                  <br />
                  <Button variant="default" width="186" height="151" size="L" onClick={() => {setCharts([drawPieChartOfExpertiseLevel(data)])}}>
                     Percentage of people according to expertise level
                  </Button>
                  <br />
                  <Button variant="default" width="186" height="151" size="L" onClick={() => {setCharts([drawBarChartOfAge(age)])}}>
                     Number of people according to age
                  </Button>
                  <br />
                  <Button variant="default" width="186" height="151" size="L" onClick={() => {setCharts([drawPieChartOfAge(age)])}}>
                     Percentage of people according to expertise level
                  </Button>
                  <br />
                </SubNavSection>
              </SubNavSections>

        </SubNav>}>
        <div>
        {charts.map((chart:any, index:any) => (
          <div key={index} style={{ height: '400px', margin: '20px 0'}}>
            {chart.type === 'bar' && (
              <Bar height={400} data={chart.data} options={chart.options} />
            )}

            {chart.type === 'pie' && (
                <Pie height={400} data={chart.data} options={chart.options} />
            )}
          </div>
        ))}
      </div>

      </Layout>
    </Box>
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
    phone: string,
    expertise: string
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
    phone: [''],
    expertise: ['']
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
    result.expertise.push(student.expertise)
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
  result.expertise.shift()

  return result
}
const getRandomColor = ()=>{
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const getAge = (dateString:string)=>{
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
}

const processExpertiseLevel = (expertiseLevel:any)=>{
  const result = {
    label: ['Novice', 'Intermediate', 'Advance'],
    data: [0, 0, 0],
  };
  for (let i = 0; i < expertiseLevel.length; i++) {
    if (expertiseLevel[i] === 'Novice') {
      result.data[0]++;
    } else if (expertiseLevel[i] === 'Intermediate') {
      result.data[1]++;
    }else {
      result.data[2]++;
    }
  }
  return result;
}

const processAge = (age:Array<never>)=>{
  const uniqueAge:any = [];
  const ageIndex:any = {};
  const count:any = [];
  for (let i = 0; i < age.length; i++) {
      if (!uniqueAge.includes(age[i])) {
          uniqueAge.push(age[i]);
          ageIndex[age[i]] = uniqueAge.length - 1;
      }
      if (ageIndex[age[i]] >= count.length) {
          count.push(1);
      } else {
          count[ageIndex[age[i]]] = count[ageIndex[age[i]]] + 1;
      }
  }

  return {
      label: uniqueAge,
      data: count
  }
}

const drawBarChartOfExpertiseLevel = (data:any)=>{
  const processedExpertiseLevel = processExpertiseLevel(data.expertise);
  const dataValues = processedExpertiseLevel.data;
  const backgroundColors = '#E1359D'

  const dt = {
    labels: processedExpertiseLevel.label,
    datasets: [
      {
        label: 'Expertise Level',
        data: processedExpertiseLevel.data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
        barThickness: 50, // Adjust bar thickness as needed
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
        title: {
            display: true,
            text: 'Number of people of each expertise level',
            color: 'gray'
        }
    }
  };

  const chart = {
    type: 'bar',
    data: dt,
    options: options,
  };

  return chart;
}

const drawPieChartOfExpertiseLevel = (data:any)=>{
  const processedExpertiseLevel = processExpertiseLevel(data.expertise);
  const dataValues = processedExpertiseLevel.data;
  const backgroundColors = dataValues.map(() => getRandomColor());
  const dt = {
      labels: processedExpertiseLevel.label,
      datasets: [
        {
          label: 'Dataset 1',
          data: processedExpertiseLevel.data,
          backgroundColor: backgroundColors,
        }
      ]
  };

  const options = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Percentage of each expertise level',
          color: 'gray'
        }
      }
  }
  const chart = {
      type: 'pie',
      data: dt,
      options: options,
    };
  
  return chart;
}

const drawBarChartOfAge = (age:any)=>{
  const processedAge = processAge(age.sort());
  const backgroundColors = '#EC233F'
  const dt = {
      labels: processedAge.label,
      datasets: [
        {
          label: 'Age',
          data: processedAge.data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1,
          barThickness: 50, // Adjust bar thickness as needed
        },
      ],
    };
  
    const options = {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
          title: {
              display: true,
              text: 'Number of people of each age',
              color: 'gray'
          }
      }
    };
  
    const chart = {
      type: 'bar',
      data: dt,
      options: options,
    };
  
    return chart;
}

const drawPieChartOfAge = (age:any)=>{
  const processedAge = processAge(age.sort());
  const dataValues = processedAge.data;
  const backgroundColors = dataValues.map(() => getRandomColor());
  const dt = {
      labels: processedAge.label,
      datasets: [
        {
          label: 'Dataset 1',
          data: processedAge.data,
          backgroundColor: backgroundColors,
        }
      ]
  };

  const options = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          color: 'white'
        },
        title: {
          display: true,
          text: 'Percentage of each age',
          color: 'gray'
        }
      }
  }
  const chart = {
      type: 'pie',
      data: dt,
      options: options,
    };
  
  return chart;
}
