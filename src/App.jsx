import './App.css'
import EmpFlowchart from './EmpFlowchart'

// Images 
import topLeft from './assets/Img1.png';
import topRight from './assets/Img_B2B.png';
import bottomLeft from './assets/Img2.png';
import bottomRight from './assets/Img3.png';
import bottomCenter from './assets/Img_ERP2.png';
import center from './assets/Img_Emp.png';
import icon1 from './assets/Icon1.png';
import icon2 from './assets/Icon2.png';
import icon3 from './assets/Icon3.png';
import arrow from './assets/arrow.png';

export default function App() {
  return (
    <EmpFlowchart
      images={{
        topLeft: topLeft,
        topRight: topRight,
        bottomLeft: bottomLeft,
        bottomRight: bottomRight,
        bottomCenter: bottomCenter,
        center: center,
        number1 : 6,
        number2 : 3,
        number3 : 30,
        number4 : 2,
        icon1: icon1,
        icon2: icon2,
        icon3: icon3,
        stat1: 1356000,
        stat2: 17,
        stat3: 18,
        stat2_1: 932040,
        stat2_2: 17,
        stat3_1: 756000,
        stat3_2: 14,
        stat3_3: 11,
        stat4_1: 62011,
        stat4_2: 4,
        stat5_1: 756000,
        stat5_2: 488012,
        arrow: arrow
      }}
    />
  )
}