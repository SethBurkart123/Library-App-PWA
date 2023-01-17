import { useEffect, useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';

export default function Install() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  

  useEffect(() => {
    const currentPlatform = navigator.platform;
    const checkStandalone = () => {
      if (navigator.standalone) {
        return true;
      } else {
        return false;
      }
    }
    
    if (currentPlatform.includes('iPad') || currentPlatform.includes('iPod') || currentPlatform.includes('iPhone')) {
      console.log('IOS');
      handleChangeIndex(0);
      console.log(checkStandalone());
    } else if (currentPlatform.includes('Android')) {
      console.log('Android');
      handleChangeIndex(1);
      console.log(checkStandalone());
    } else if (currentPlatform.includes('Win')) {
      console.log('Windows');
      handleChangeIndex(2);
      console.log(checkStandalone());
    } else if (currentPlatform.includes('Mac')) {
      console.log('Mac OS');
      handleChangeIndex(3);
      console.log(checkStandalone());
    }
  }, [])


  return (
    <div className="bg-secondary flex-col min-h-screen">
      <div className="absolute top-2 right-2 text-white bg-secondary-400 p-2 z-10 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div className="w-4/5 mx-auto">
        <Tabs variant="scrollable" value={value} onChange={handleChange} aria-label="icon label tabs example">
          <StyledTab icon={<IOS />} label="IOS" />
          <StyledTab icon={<Android />} label="Android" />
          <StyledTab icon={<Windows />} label="Windows" />
          <StyledTab icon={<Mac />} label="Mac" />
        </Tabs>
      </div>
      <TabPanel value={value} index={0} dir={'x'}>
        <div className="px-4 text-white">
          IOS
        </div>
      </TabPanel>
      <TabPanel value={value} index={1} dir={'x'}>
        <div className="px-4 text-white">
          Android
        </div>
      </TabPanel>
      <TabPanel value={value} index={2} dir={'x'}>
        <div className="px-4 text-white">
          Windows
        </div>
      </TabPanel>
      <TabPanel value={value} index={3} dir={'x'}>
        <div className="px-4 text-white">
          Macos
        </div>
      </TabPanel>
    </div>
  );
  
}


const StyledTab = styled((props) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: '#fff',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
  width: '20%'
}));

const Mac = () => {
  return (<svg height="20" width="20" className="mb-2 text-white" fill="currentColor" preserveAspectRatio="xMidYMid" viewBox="0 0 256 315"><path d="m213.803394 167.030943c.441806 47.578703 41.739088 63.411696 42.196606 63.613784-.349188 1.11663-6.598617 22.563566-21.75737 44.716719-13.104075 19.152523-26.704377 38.234887-48.128871 38.630099-21.051708.387897-27.821007-12.483717-51.889069-12.483717-24.060792 0-31.581791 12.088473-51.5095774 12.871614-20.6800719.782568-36.4277295-20.710917-49.6407047-39.79328-26.99911473-39.033618-47.6320248-110.299834-19.9272419-158.405692 13.7631451-23.8895647 38.3589257-39.0174344 65.0554465-39.4053604 20.307302-.387364 39.4749815 13.6620755 51.8890925 13.6620755 12.40624 0 35.69905-16.8956822 60.185922-14.4143377 10.251041.4266581 39.025882 4.1408404 57.502998 31.1865416-1.4888.922944-34.334275 20.044016-33.977231 59.821599m-39.564252-116.8322847c10.979189-13.2898714 18.368816-31.7906014 16.352846-50.1987033-15.825676.63605023-34.962474 10.5457909-46.313879 23.8283506-10.173039 11.7623252-19.082334 30.5886769-16.678452 48.6324426 17.639574 1.3647501 35.659756-8.963767 46.639485-22.2620683"/></svg>)
}

const IOS = () => {
  return (<svg height="20" width="20" className="mb-2 text-white" fill="currentColor" preserveAspectRatio="xMidYMid" viewBox="0 0 256 315"><path d="m213.803394 167.030943c.441806 47.578703 41.739088 63.411696 42.196606 63.613784-.349188 1.11663-6.598617 22.563566-21.75737 44.716719-13.104075 19.152523-26.704377 38.234887-48.128871 38.630099-21.051708.387897-27.821007-12.483717-51.889069-12.483717-24.060792 0-31.581791 12.088473-51.5095774 12.871614-20.6800719.782568-36.4277295-20.710917-49.6407047-39.79328-26.99911473-39.033618-47.6320248-110.299834-19.9272419-158.405692 13.7631451-23.8895647 38.3589257-39.0174344 65.0554465-39.4053604 20.307302-.387364 39.4749815 13.6620755 51.8890925 13.6620755 12.40624 0 35.69905-16.8956822 60.185922-14.4143377 10.251041.4266581 39.025882 4.1408404 57.502998 31.1865416-1.4888.922944-34.334275 20.044016-33.977231 59.821599m-39.564252-116.8322847c10.979189-13.2898714 18.368816-31.7906014 16.352846-50.1987033-15.825676.63605023-34.962474 10.5457909-46.313879 23.8283506-10.173039 11.7623252-19.082334 30.5886769-16.678452 48.6324426 17.639574 1.3647501 35.659756-8.963767 46.639485-22.2620683"/></svg>)
}

const Android = () => {
  return (<svg height="20" width="20" className="mb-2 text-white" fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m387.512 378.89c0 10.701-8.632 19.385-19.353 19.385h-224.154c-10.701 0-19.364-8.683-19.364-19.385v-200.263c58.757-.215 195.83-.215 262.871 0z"/><path d="m207.678 75.95c1.106 2.171.266 4.885-1.935 6.011-2.181 1.106-4.894.236-6-1.945l-28.334-55.224c-1.126-2.201-.226-4.864 1.956-6 2.181-1.127 4.874-.256 6 1.936l28.314 55.224z"/><path d="m310.876 78.275c-1.229 2.14-3.952 2.877-6.103 1.608-2.13-1.209-2.857-3.932-1.608-6.073l31.027-53.73c1.229-2.13 3.973-2.887 6.082-1.628 2.151 1.218 2.877 3.953 1.649 6.072l-31.048 53.75z"/><path d="m455.946 324.587c0 15.575-12.615 28.221-28.221 28.221-15.606 0-28.252-12.636-28.252-28.221v-123.505c0-15.606 12.636-28.211 28.252-28.211 15.596 0 28.221 12.606 28.221 28.211z"/><path d="m112.496 324.587c0 15.575-12.656 28.221-28.211 28.221-15.616 0-28.242-12.636-28.242-28.221v-123.505c0-15.606 12.615-28.211 28.242-28.211 15.555 0 28.211 12.606 28.211 28.211z"/><path d="m235.397 465.93c0 15.575-12.636 28.221-28.262 28.221-15.575 0-28.19-12.636-28.19-28.221v-123.505c0-15.565 12.615-28.242 28.19-28.242 15.616 0 28.262 12.677 28.262 28.242z"/><path d="m333.302 465.93c0 15.575-12.636 28.221-28.252 28.221-15.575 0-28.221-12.636-28.221-28.221v-123.505c0-15.565 12.636-28.242 28.221-28.242 15.606 0 28.252 12.677 28.252 28.242z"/><path d="m256.082 46.663c-68.649 0-125.184 52.245-132.741 119.399h265.472c-7.536-67.154-64.041-119.398-132.731-119.398zm-59.894 72.387c-6.124 0-11.07-4.925-11.07-11.028 0-6.082 4.946-11.008 11.07-11.008 6.062 0 11.008 4.925 11.008 11.008 0 6.103-4.946 11.028-11.008 11.028zm120.023 0c-6.103 0-11.049-4.925-11.049-11.028 0-6.082 4.946-11.008 11.049-11.008 6.123 0 11.029 4.925 11.029 11.008 0 6.103-4.905 11.028-11.029 11.028z"/></svg>)
}

const Windows = () => {
  return (<svg height="20" width="20" className="mb-2 text-white" preserveAspectRatio="xMidYMid" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 258 259"><path d="M-1-1h258v259H-1z"/><path d="M0 36.357L104.62 22.11l.045 100.914-104.57.595L0 36.358v-.001zm104.57 98.293l.08 101.002L.081 221.275l-.006-87.302 104.494.677zm12.682-114.405L255.968 0v121.74l-138.716 1.1V20.246zM256 135.6l-.033 121.191-138.716-19.578-.194-101.84z" fill="#fff"/></svg>)
}


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>{children}</>
      )}
    </div>
  );
}