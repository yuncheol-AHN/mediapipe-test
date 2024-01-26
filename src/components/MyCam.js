// import React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera } from '@mediapipe/camera_utils';
import { Hands, Results } from '@mediapipe/hands'   // 여기에 있는 Results를 사용하려고 함 18번째 줄에서, Results는 interface로 제공됨
import drawCanvas from 'utils/drawCanvas';
import { fct } from './f';

const MyCam = () => {

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const resultsRef = useRef();

    /**
     * 검출 결과 : 프레임마다 호출
     * @param results
     */
    const onResults = useCallback((results: Results) => {   // 예시 코드가 이런식으로 나오는데, js로 변경을 어떻게 할까 계속 고민하는 중이었어.
        
        // console.log("call on results")

        // results를 resultsRef.current에 할당
        resultsRef.current = results // results를 이런식으로 사용해야되는데... 그게 안되는 중이었어
        // console.log(onResults);

        // canvasCtx, resultsRef를 가져와 호출
        const canvasCtx = canvasRef.current.getContext("2d");
        drawCanvas(canvasCtx, results);
    }, [])
    
    useEffect(() => {

        // console.log("call my cam !!!")
        fct();

        const hands = new Hands({
            locateFile: (file) => {
                console.log(file);
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });
        
        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        })

        hands.onResults(onResults);

        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null
          ) {
            const camera = new Camera(webcamRef.current.video, {
              onFrame: async () => {
                await hands.send({ image: webcamRef.current.video });
              },
              width: 1280,
              height: 720,
            });
            camera.start();
          }
    })

    const OutputData = () => {
        
        const results = resultsRef.current;
        
        console.log(results.multiHandLandmarks);
    };

    return (
        <div>
            {/* video capture */}
            <Webcam
                audio={false}
                // style={{ visibility: "hidden" }}
                width={800}
                height={600}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    width: 800,
                    height: 600,
                    facingMode: "user",
                }}
            ></Webcam>

            {/* draw landmarks to hand */}
            <canvas
                ref={canvasRef}
                // className={styles.canvas}
                width={800}
                height={600}
            />
            {/* 좌표 출력 */}
            <div>
                <button onClick={OutputData}>
                    Output Data
                </button>
            </div>
        </div>
    );
};

export default MyCam;