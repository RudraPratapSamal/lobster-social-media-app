import React from "react";
import * as loader from '../lottie/dots-loader.json'
import Lottie from 'react-lottie'
export default function DotsLoader(){
    const defaultOptions1 = {
        loop: true,
        autoplay: true,
        animationData: loader.default,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
    return(
        <div>
            <Lottie options={defaultOptions1} height={200} width={200} />
        </div>
    )
}