import React, { useState } from "react";
import { EasterEggPageContainer } from "../../shared/styles";
import KongGif from "../../../assets/f2.gif";


const EasterEggPage: React.FC = () => {
  const [kongs,setKongs]=useState(1);


  return (
    <EasterEggPageContainer>
      
     {Array.from(new Array(kongs)).map((_,index)=>{ return <img key={index} src={KongGif} onClick={()=>{if(kongs<=6) setKongs(kongs+1)}} width={70-10*kongs} height={70-10*kongs} style={{cursor:"pointer"}} />})}

      made by Mango
    </EasterEggPageContainer>
  );
};
export default EasterEggPage;
