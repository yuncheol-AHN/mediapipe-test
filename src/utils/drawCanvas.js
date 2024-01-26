import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";

const drawCanvas = (ctx, results) => {
    
    /**
     * 계속해서 호출됨 !
     * what is ctx      => canvas
     * what is results  => 관절 좌표 !!
     */

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // canvas의 좌우 반전
    ctx.scale(-1, 1);
    ctx.translate(-width, 0);

    // capture image 그리기
    ctx.drawImage(results.image, 0, 0, width, height);

    // 손 묘사
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 1,
            });
            drawLandmarks(ctx, landmarks, {
                color: "#FF0000",
                lineWidth: 0.3,
                radius: 1,
            });
        }
    }
    ctx.restore();
};
export default drawCanvas;