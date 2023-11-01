import React from "react";
import * as spinner from '../lottie/fJBE5OJvwP.json'
import Lottie from 'react-lottie'
export default function PreLoader(){
    const defaultOptions1 = {
        loop: true,
        autoplay: true,
        animationData: spinner.default,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
    return(
        <div className='preloader'>
            <Lottie options={defaultOptions1} height={200} width={200} />
        </div>
    )
}